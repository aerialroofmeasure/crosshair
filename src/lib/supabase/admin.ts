import { createClient } from "@supabase/supabase-js";

/**
 * Service-role Supabase client.
 * NEVER import this from a client component or expose its key.
 * Used for: server-side inserts (where we want to bypass RLS),
 * admin operations, and webhook handlers.
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const secret = process.env.SUPABASE_SECRET_KEY;
  if (!url || !secret) {
    throw new Error(
      "Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY env vars."
    );
  }
  return createClient(url, secret, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
