import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { assertStaff } from "@/lib/profile";
import { requiredKindsForFormat, inferFileKind, formatRef } from "@/lib/orders";
import { siteConfig } from "@/lib/site-config";
import { reportReadyEmail } from "@/lib/email";

const BUCKET = "reports";
const MAX_FILE_BYTES = 50 * 1024 * 1024; // 50 MB per file

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(-120) || "file";
}

/**
 * POST /api/employee/complete — upload the report file(s) and deliver the order.
 *
 * Guards:
 *   • caller is active staff
 *   • caller is the assignee (or an admin) and the order is in progress
 *   • the uploaded files satisfy the format the customer ordered
 */
export async function POST(req: Request) {
  const guard = await assertStaff();
  if (!guard.ok) return NextResponse.json({ error: guard.error }, { status: guard.status });
  const isAdmin = guard.profile!.role === "admin";

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const orderId = String(form.get("orderId") || "");
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length === 0) return NextResponse.json({ error: "Attach at least one report file." }, { status: 400 });
  for (const f of files) {
    if (f.size > MAX_FILE_BYTES) {
      return NextResponse.json({ error: `${f.name} is too large (max 50 MB).` }, { status: 400 });
    }
  }

  const admin = createSupabaseAdminClient();

  // --- Load + authorize the order ---------------------------------------
  let order: { id: string; format: string; status: string; assigned_to: string | null; customer_email: string; customer_name: string; order_number: number; service_name: string };
  try {
    const { data, error } = await admin
      .from("orders")
      .select("id, format, status, assigned_to, customer_email, customer_name, order_number, service_name")
      .eq("id", orderId)
      .maybeSingle();
    if (error) throw error;
    if (!data) return NextResponse.json({ error: "Order not found." }, { status: 404 });
    order = data;
  } catch (e) {
    console.error("[employee/complete] load order failed", e);
    return NextResponse.json({ error: "Couldn't load the order." }, { status: 500 });
  }

  if (order.status !== "in_progress") {
    return NextResponse.json({ error: "Only in-progress orders can be completed." }, { status: 409 });
  }
  if (!isAdmin && order.assigned_to !== guard.user!.id) {
    return NextResponse.json({ error: "This order is assigned to someone else." }, { status: 403 });
  }

  // --- Validate the uploaded kinds against the ordered format -----------
  const required = requiredKindsForFormat(order.format);
  const present = new Set(files.map((f) => inferFileKind(f.name)));
  const missing = required.filter((k) => !present.has(k));
  if (missing.length > 0) {
    return NextResponse.json(
      { error: `Missing required file(s): ${missing.join(", ").toUpperCase()}.` },
      { status: 400 }
    );
  }

  // --- Upload to storage + index in order_files -------------------------
  const inserted: { kind: string; file_name: string; storage_path: string; size_bytes: number }[] = [];
  try {
    for (const f of files) {
      const cleanName = safeName(f.name);
      const path = `${orderId}/${Date.now()}-${cleanName}`;
      const buffer = Buffer.from(await f.arrayBuffer());
      const { error: upErr } = await admin.storage.from(BUCKET).upload(path, buffer, {
        contentType: f.type || "application/octet-stream",
        upsert: true,
      });
      if (upErr) throw upErr;
      inserted.push({
        kind: inferFileKind(f.name),
        file_name: cleanName,
        storage_path: path,
        size_bytes: f.size,
      });
    }

    const { error: filesErr } = await admin.from("order_files").insert(
      inserted.map((f) => ({
        order_id: orderId,
        kind: f.kind,
        file_name: f.file_name,
        storage_path: f.storage_path,
        size_bytes: f.size_bytes,
        uploaded_by: guard.user!.id,
      }))
    );
    if (filesErr) throw filesErr;
  } catch (e) {
    console.error("[employee/complete] upload failed", e);
    return NextResponse.json({ error: "Couldn't upload the report files." }, { status: 500 });
  }

  // --- Mark delivered ----------------------------------------------------
  try {
    const { error } = await admin
      .from("orders")
      .update({
        status: "delivered",
        completed_by: guard.user!.id,
        completed_at: new Date().toISOString(),
      })
      .eq("id", orderId);
    if (error) throw error;
  } catch (e) {
    console.error("[employee/complete] status update failed", e);
    return NextResponse.json({ error: "Files saved but couldn't finalize. Try again." }, { status: 500 });
  }

  // --- Notify the customer (best effort) --------------------------------
  if (process.env.RESEND_API_KEY && order.customer_email) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      const ref = formatRef(order.order_number);
      const mail = reportReadyEmail({
        customerName: order.customer_name,
        ref,
        serviceName: order.service_name,
      });
      await resend.emails.send({
        from: `Aerial Roof Measure <${siteConfig.email.orders}>`,
        to: [order.customer_email],
        replyTo: siteConfig.email.support,
        subject: mail.subject,
        html: mail.html,
        text: mail.text,
      });
    } catch (e) {
      console.error("[employee/complete] email failed", e);
    }
  }

  return NextResponse.json({ ok: true, files: inserted.length });
}
