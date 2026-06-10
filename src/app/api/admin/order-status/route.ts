import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isAdminEmail } from "@/lib/admin";

const VALID = ["pending_payment", "paid", "in_progress", "delivered", "cancelled"] as const;

export async function POST(req: Request) {
  let body: { id?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.id || !body.status) {
    return NextResponse.json({ error: "id and status required" }, { status: 400 });
  }
  if (!(VALID as readonly string[]).includes(body.status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  // Verify caller is an admin via session
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user || !isAdminEmail(data.user.email)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  } catch {
    return NextResponse.json({ error: "Auth error" }, { status: 401 });
  }

  // Update via service role so RLS doesn't get in the way
  try {
    const admin = createSupabaseAdminClient();
    const { error } = await admin
      .from("orders")
      .update({ status: body.status })
      .eq("id", body.id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/order-status] update failed", e);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
