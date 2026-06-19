import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { assertStaff } from "@/lib/profile";

/**
 * POST /api/employee/claim — an employee picks up an unassigned paid order.
 * Race-safe: the conditional update only succeeds while the order is still
 * `paid` and unclaimed, so two employees can't grab the same order.
 */
export async function POST(req: Request) {
  const guard = await assertStaff();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body: { orderId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("orders")
      .update({
        assigned_to: guard.user!.id,
        assigned_at: new Date().toISOString(),
        status: "in_progress",
      })
      .eq("id", body.orderId)
      .eq("status", "paid")
      .is("assigned_to", null)
      .select("id")
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      return NextResponse.json(
        { error: "This order was already claimed or isn't ready yet." },
        { status: 409 }
      );
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[employee/claim] failed", e);
    return NextResponse.json({ error: "Couldn't claim this order." }, { status: 500 });
  }
}
