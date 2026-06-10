-- =====================================================
-- 0001_orders.sql
-- Aerial Roof Measure — orders table + RLS + admin gate
--
-- Run this in: Supabase Dashboard → SQL Editor → New Query → Paste → Run
-- Or via: supabase db push (if using the Supabase CLI)
-- =====================================================

-- =====================================================
-- 1. Admin gate function
-- Returns true if the calling user's email is in the admin whitelist.
-- Used in RLS policies on `orders`. Easy to change later.
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
$$;

comment on function public.is_admin() is
  'Email-whitelist check for admin access. Update the email list here to grant/revoke admin rights.';


-- =====================================================
-- 2. Orders table
-- =====================================================
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_number    bigserial unique not null,                -- human-friendly: ARM-0001024
  user_id         uuid references auth.users(id) on delete set null,

  -- Customer contact (filled even for guest checkout)
  customer_name    text not null,
  customer_email   text not null,
  customer_company text,
  notes            text,

  -- Property location
  location_mode    text not null check (location_mode in ('type', 'link')),
  street           text,
  city             text,
  state            text,
  zip              text,
  maps_link        text,

  -- Order details
  service_slug     text not null,
  service_name     text not null,
  format           text not null,
  speed            text not null check (speed in ('standard', 'rush', 'express')),

  -- Pricing (stored in cents to avoid float rounding)
  base_price_cents integer not null check (base_price_cents >= 0),
  total_cents      integer not null check (total_cents >= 0),

  -- Status lifecycle
  status           text not null default 'pending_payment'
                   check (status in ('pending_payment', 'paid', 'in_progress', 'delivered', 'cancelled')),

  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Indexes for the queries we'll actually run
create index if not exists orders_user_id_idx     on public.orders(user_id);
create index if not exists orders_status_idx      on public.orders(status);
create index if not exists orders_created_at_idx  on public.orders(created_at desc);
create index if not exists orders_email_idx       on public.orders(customer_email);


-- =====================================================
-- 3. Auto-update updated_at on every UPDATE
-- =====================================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();


-- =====================================================
-- 4. Row Level Security
-- =====================================================
alter table public.orders enable row level security;

-- Customers can read their own orders
drop policy if exists "Users read own orders" on public.orders;
create policy "Users read own orders"
  on public.orders for select
  using (auth.uid() is not null and auth.uid() = user_id);

-- Admins can read every order
drop policy if exists "Admins read all orders" on public.orders;
create policy "Admins read all orders"
  on public.orders for select
  using (public.is_admin());

-- Customers can insert orders for themselves
drop policy if exists "Users insert own orders" on public.orders;
create policy "Users insert own orders"
  on public.orders for insert
  with check (auth.uid() is not null and auth.uid() = user_id);

-- Guests (no session) can insert orders without a user_id.
-- NB: our /api/orders route uses the SERVICE ROLE key so this policy is
-- never the actual insert path in production — but keeping it here makes
-- direct browser inserts work too if you ever want them.
drop policy if exists "Guests insert anonymous orders" on public.orders;
create policy "Guests insert anonymous orders"
  on public.orders for insert
  with check (auth.uid() is null and user_id is null);

-- Admins can update orders (status changes, notes, etc.)
drop policy if exists "Admins update orders" on public.orders;
create policy "Admins update orders"
  on public.orders for update
  using (public.is_admin())
  with check (public.is_admin());


-- =====================================================
-- 5. Convenience view: human-friendly order number
-- ARM-{6-digit zero-padded number}
-- =====================================================
create or replace view public.orders_with_ref as
  select
    *,
    'ARM-' || lpad(order_number::text, 6, '0') as ref
  from public.orders;

-- Inherit RLS from the underlying table
alter view public.orders_with_ref set (security_invoker = true);
