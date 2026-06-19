import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

export type Role = "customer" | "employee" | "admin";

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  company: string;
  role: Role;
  is_active: boolean;
}

/**
 * Server-side: resolve the current user's profile (role, active flag, etc.).
 * Returns null when there's no session or Supabase isn't configured.
 *
 * Falls back to the email whitelist for admin role so the founder always has
 * access even before the profiles backfill runs.
 */
export async function getProfile(): Promise<Profile | null> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;
    if (!user) return null;

    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, company, role, is_active")
      .eq("id", user.id)
      .maybeSingle();

    if (data) {
      // Whitelist always wins for admin.
      const role: Role = isAdminEmail(user.email) ? "admin" : (data.role as Role);
      return { ...(data as Profile), role };
    }

    // No profile row yet (e.g. migration not run) — synthesize from auth.
    return {
      id: user.id,
      email: user.email ?? "",
      full_name: (user.user_metadata?.full_name as string) ?? "",
      company: (user.user_metadata?.company as string) ?? "",
      role: isAdminEmail(user.email) ? "admin" : "customer",
      is_active: true,
    };
  } catch {
    return null;
  }
}

export function isStaffRole(role: Role | undefined | null): boolean {
  return role === "employee" || role === "admin";
}

/* ============================================================
   API-route guards. Each returns { user, profile } on success
   or a NextResponse-friendly { error, status } on failure.
   Use via the helpers below in route handlers.
   ============================================================ */

export interface GuardResult {
  ok: boolean;
  status: number;
  error?: string;
  user?: { id: string; email: string | null };
  profile?: Profile;
}

async function resolveCaller(): Promise<{ profile: Profile | null; error?: string; status?: number }> {
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) return { profile: null, error: "Not signed in", status: 401 };
  } catch {
    return { profile: null, error: "Auth error", status: 401 };
  }
  const profile = await getProfile();
  if (!profile) return { profile: null, error: "Not signed in", status: 401 };
  if (!profile.is_active) return { profile: null, error: "Account disabled", status: 403 };
  return { profile };
}

/** Require an active employee or admin. */
export async function assertStaff(): Promise<GuardResult> {
  const { profile, error, status } = await resolveCaller();
  if (!profile) return { ok: false, status: status ?? 401, error };
  if (!isStaffRole(profile.role)) return { ok: false, status: 403, error: "Forbidden" };
  return { ok: true, status: 200, user: { id: profile.id, email: profile.email }, profile };
}

/** Require an active admin. */
export async function assertAdmin(): Promise<GuardResult> {
  const { profile, error, status } = await resolveCaller();
  if (!profile) return { ok: false, status: status ?? 401, error };
  if (profile.role !== "admin") return { ok: false, status: 403, error: "Forbidden" };
  return { ok: true, status: 200, user: { id: profile.id, email: profile.email }, profile };
}

/**
 * Service-role lookup of an arbitrary user's profile (used inside admin
 * routes that need to inspect/modify another account).
 */
export async function getProfileById(id: string): Promise<Profile | null> {
  try {
    const admin = createSupabaseAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("id, email, full_name, company, role, is_active")
      .eq("id", id)
      .maybeSingle();
    return (data as Profile) ?? null;
  } catch {
    return null;
  }
}
