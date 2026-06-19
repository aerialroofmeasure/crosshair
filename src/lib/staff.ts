import "server-only";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { OrderStatus, FileKind } from "@/lib/orders";

/**
 * Server-only data access for staff (employee + admin) views.
 * Uses the service-role client — callers MUST already be authorized by their
 * route-group layout (mirrors the existing admin orders page).
 */

export interface StaffOrder {
  id: string;
  order_number: number;
  user_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_company: string | null;
  notes: string | null;
  location_mode: "type" | "link";
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  maps_link: string | null;
  service_slug: string;
  service_name: string;
  format: string;
  speed: string;
  total_cents: number;
  status: OrderStatus;
  assigned_to: string | null;
  assigned_at: string | null;
  completed_by: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface OrderFile {
  id: string;
  order_id: string;
  kind: FileKind;
  file_name: string;
  storage_path: string;
  size_bytes: number | null;
  created_at: string;
}

const ORDER_COLS =
  "id, order_number, user_id, customer_name, customer_email, customer_company, notes, location_mode, street, city, state, zip, maps_link, service_slug, service_name, format, speed, total_cents, status, assigned_to, assigned_at, completed_by, completed_at, created_at";

export interface FetchOrdersOpts {
  status?: OrderStatus | OrderStatus[];
  assignedTo?: string;
  completedBy?: string;
  unassigned?: boolean;
  limit?: number;
}

export async function fetchStaffOrders(opts: FetchOrdersOpts = {}): Promise<StaffOrder[]> {
  try {
    const admin = createSupabaseAdminClient();
    let q = admin.from("orders").select(ORDER_COLS);

    if (opts.status) {
      if (Array.isArray(opts.status)) q = q.in("status", opts.status);
      else q = q.eq("status", opts.status);
    }
    if (opts.assignedTo) q = q.eq("assigned_to", opts.assignedTo);
    if (opts.completedBy) q = q.eq("completed_by", opts.completedBy);
    if (opts.unassigned) q = q.is("assigned_to", null);

    q = q.order("created_at", { ascending: false }).limit(opts.limit ?? 200);

    const { data, error } = await q;
    if (error || !data) return [];
    return data as StaffOrder[];
  } catch {
    return [];
  }
}

/** Map of order_id → its files, for the given order ids. */
export async function fetchOrderFilesMap(orderIds: string[]): Promise<Map<string, OrderFile[]>> {
  const map = new Map<string, OrderFile[]>();
  if (orderIds.length === 0) return map;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("order_files")
      .select("id, order_id, kind, file_name, storage_path, size_bytes, created_at")
      .in("order_id", orderIds)
      .order("created_at", { ascending: true });
    for (const f of (data ?? []) as OrderFile[]) {
      const arr = map.get(f.order_id) ?? [];
      arr.push(f);
      map.set(f.order_id, arr);
    }
  } catch {
    /* empty */
  }
  return map;
}

export interface StaffProfile {
  id: string;
  email: string;
  full_name: string;
  company: string;
  role: "customer" | "employee" | "admin";
  is_active: boolean;
  created_at: string;
}

/** Map of user_id → display name/email, for resolving assignee/completer names. */
export async function fetchProfilesMap(userIds: string[]): Promise<Map<string, StaffProfile>> {
  const map = new Map<string, StaffProfile>();
  const ids = [...new Set(userIds.filter(Boolean))];
  if (ids.length === 0) return map;
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("id, email, full_name, company, role, is_active, created_at")
      .in("id", ids);
    for (const p of (data ?? []) as StaffProfile[]) map.set(p.id, p);
  } catch {
    /* empty */
  }
  return map;
}

/** All profiles of a given role (e.g. the employee roster, the customer book). */
export async function fetchProfilesByRole(role: "customer" | "employee" | "admin"): Promise<StaffProfile[]> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("id, email, full_name, company, role, is_active, created_at")
      .eq("role", role)
      .order("created_at", { ascending: false });
    return (data ?? []) as StaffProfile[];
  } catch {
    return [];
  }
}

export function displayName(p: StaffProfile | undefined, fallback = "—"): string {
  if (!p) return fallback;
  return p.full_name?.trim() || p.email || fallback;
}
