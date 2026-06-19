import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { assertAdmin } from "@/lib/profile";

/**
 * POST /api/admin/assign — admin assigns an order to an employee, or clears
 * the assignment (employeeId: null) and returns the order to the pool.
 */
export async function POST(req: Request) {
  const guard = await assertAdmin();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });

  let body: { orderId?: string; employeeId?: string | null };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  try {
    // Unassign → back to the pool.
    if (!body.employeeId) {
      const { error } = await admin
        .from("orders")
        .update({ assigned_to: null, assigned_at: null, status: "paid" })
        .eq("id", body.orderId)
        .eq("status", "in_progress");
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    // Assign → verify the target is an active employee/admin.
    const { data: target } = await admin
      .from("profiles")
      .select("id, role, is_active")
      .eq("id", body.employeeId)
      .maybeSingle();
    if (!target || !target.is_active || (target.role !== "employee" && target.role !== "admin")) {
      return NextResponse.json({ error: "Pick an active employee." }, { status: 400 });
    }

    const { error } = await admin
      .from("orders")
      .update({
        assigned_to: body.employeeId,
        assigned_at: new Date().toISOString(),
        status: "in_progress",
      })
      .eq("id", body.orderId)
      .in("status", ["paid", "in_progress"]);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[admin/assign] failed", e);
    return NextResponse.json({ error: "Couldn't update the assignment." }, { status: 500 });
  }
}
