/**
 * Single source of truth for who's an admin.
 * Mirrors the email whitelist in supabase/migrations/0001_orders.sql →
 * `is_admin()`.
 * Keep them in sync when adding people.
 */
export const ADMIN_EMAILS = [
  "founder@aerialroofmeasure.com",
  "orders@aerialroofmeasure.com",
] as const;

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return (ADMIN_EMAILS as readonly string[]).includes(email.toLowerCase());
}
