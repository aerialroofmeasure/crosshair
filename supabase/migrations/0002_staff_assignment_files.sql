-- =====================================================
-- 0002_staff_assignment_files.sql
-- Aerial Roof Measure — roles, order assignment, report files
--
-- Adds the fulfillment loop on top of 0001_orders.sql:
--   • profiles table (customer / employee / admin) + auto-create trigger
--   • role helper functions (is_admin extended, is_staff added)
--   • orders assignment columns (assigned_to / completed_by + timestamps)
--   • order_files table (delivered report files)
--   • private `reports` storage bucket
--   • RLS for the above
--
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- (same as 0001). Safe to re-run — everything is idempotent.
-- =====================================================


-- =====================================================
-- 1. Profiles table
-- One row per auth user. role drives portal access.
-- =====================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  full_name   text,
  company     text,
  role        text not null default 'customer'
              check (role in ('customer', 'employee', 'admin')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists profiles_role_idx on public.profiles(role);
create index if not exists profiles_email_idx on public.profiles(email);

-- Reuse the updated_at trigger function from 0001.
drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- =====================================================
-- 2. Auto-create a profile whenever a new auth user appears.
-- Pulls name/company from the signup metadata (see auth-form.tsx).
-- New self-signups are always customers.
-- =====================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, full_name, company, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'company', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'customer')
  )
  on conflict (id) do update
    set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- =====================================================
-- 3. Backfill profiles for existing users, seed admins.
-- =====================================================
insert into public.profiles (id, email, full_name, company, role)
select
  u.id,
  u.email,
  coalesce(u.raw_user_meta_data ->> 'full_name', ''),
  coalesce(u.raw_user_meta_data ->> 'company', ''),
  case
    when u.email in ('founder@aerialroofmeasure.com', 'orders@aerialroofmeasure.com')
      then 'admin'
    else 'customer'
  end
from auth.users u
on conflict (id) do nothing;

-- Make sure the whitelist emails are admins even if they already had a profile.
update public.profiles
set role = 'admin'
where email in ('founder@aerialroofmeasure.com', 'orders@aerialroofmeasure.com')
  and role <> 'admin';


-- =====================================================
-- 4. Role helper functions.
-- is_admin extended: profile role OR the original email whitelist (fallback).
-- is_staff: employee or admin.
-- =====================================================
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select coalesce(
    (auth.jwt() ->> 'email') in (
      'founder@aerialroofmeasure.com',
      'orders@aerialroofmeasure.com'
    ),
    false
  )
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'admin' and p.is_active
  );
$$;

comment on function public.is_admin() is
  'True if the caller is an admin (profiles.role = admin) or in the legacy email whitelist.';

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public, auth
as $$
  select public.is_admin()
  or exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.role = 'employee' and p.is_active
  );
$$;

comment on function public.is_staff() is
  'True if the caller is staff — an active employee or an admin.';


-- =====================================================
-- 5. Orders — assignment + completion columns.
-- =====================================================
alter table public.orders
  add column if not exists assigned_to  uuid references auth.users(id) on delete set null,
  add column if not exists assigned_at  timestamptz,
  add column if not exists completed_by uuid references auth.users(id) on delete set null,
  add column if not exists completed_at timestamptz;

create index if not exists orders_assigned_to_idx  on public.orders(assigned_to);
create index if not exists orders_completed_by_idx on public.orders(completed_by);


-- =====================================================
-- 6. Order files — delivered report artifacts.
-- Files themselves live in the private `reports` storage bucket;
-- this table is the index. storage_path is "{order_id}/{filename}".
-- =====================================================
create table if not exists public.order_files (
  id           uuid primary key default gen_random_uuid(),
  order_id     uuid not null references public.orders(id) on delete cascade,
  kind         text not null check (kind in ('pdf', 'esx', 'xml', 'bundle', 'other')),
  file_name    text not null,
  storage_path text not null,
  size_bytes   integer,
  uploaded_by  uuid references auth.users(id) on delete set null,
  created_at   timestamptz not null default now()
);

create index if not exists order_files_order_id_idx on public.order_files(order_id);


-- =====================================================
-- 7. Private storage bucket for report files.
-- =====================================================
insert into storage.buckets (id, name, public)
values ('reports', 'reports', false)
on conflict (id) do nothing;


-- =====================================================
-- 8. Row Level Security
-- All privileged mutations go through service-role API routes, so these
-- policies are read-focused defense-in-depth.
-- =====================================================

-- ---- profiles ----
alter table public.profiles enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Staff read all profiles" on public.profiles;
create policy "Staff read all profiles"
  on public.profiles for select
  using (public.is_staff());

-- Users may update their own profile but never their role / active flag.
drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select p.role from public.profiles p where p.id = auth.uid())
    and is_active = (select p.is_active from public.profiles p where p.id = auth.uid())
  );

drop policy if exists "Admins manage profiles" on public.profiles;
create policy "Admins manage profiles"
  on public.profiles for all
  using (public.is_admin())
  with check (public.is_admin());

-- ---- orders: staff read all (customers/admins already covered by 0001) ----
drop policy if exists "Staff read all orders" on public.orders;
create policy "Staff read all orders"
  on public.orders for select
  using (public.is_staff());

-- ---- order_files ----
alter table public.order_files enable row level security;

drop policy if exists "Staff read all order files" on public.order_files;
create policy "Staff read all order files"
  on public.order_files for select
  using (public.is_staff());

drop policy if exists "Customers read own order files" on public.order_files;
create policy "Customers read own order files"
  on public.order_files for select
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_files.order_id and o.user_id = auth.uid()
    )
  );

drop policy if exists "Staff write order files" on public.order_files;
create policy "Staff write order files"
  on public.order_files for insert
  with check (public.is_staff());
