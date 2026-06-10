import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  type OrderPayload,
  type Speed,
  type Format,
  type LocationMode,
  priceOrderCents,
  formatRef,
  SPEED_LABELS,
  FORMAT_LABELS,
} from "@/lib/orders";
import { siteConfig } from "@/lib/site-config";

/**
 * POST /api/orders — create a new order.
 *
 * Flow:
 *   1. Parse + validate payload
 *   2. Recompute pricing server-side (never trust the client)
 *   3. Look up the calling user (if logged in) — attach to order
 *   4. Insert via the service-role client so we always succeed
 *      regardless of guest/auth state and RLS edge cases
 *   5. Fire two emails via Resend: customer confirmation + admin alert
 *   6. Return { ok, ref } so the client can show the order number
 */
export async function POST(req: Request) {
  let payload: OrderPayload;
  try {
    payload = (await req.json()) as OrderPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  // --- Validate required fields -----------------------------------------
  const errors = validate(payload);
  if (errors.length) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  // --- Server-side price calculation ------------------------------------
  let pricing;
  try {
    pricing = priceOrderCents(payload.service_slug, payload.speed);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Invalid pricing";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  // --- Optionally bind to logged-in user --------------------------------
  let userId: string | null = null;
  try {
    const supa = await createSupabaseServerClient();
    const { data } = await supa.auth.getUser();
    if (data.user) userId = data.user.id;
  } catch {
    // No session → guest checkout, that's fine
  }

  // --- Insert -----------------------------------------------------------
  let row;
  try {
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("orders")
      .insert({
        user_id: userId,
        customer_name: payload.customer_name.trim(),
        customer_email: payload.customer_email.trim().toLowerCase(),
        customer_company: payload.customer_company?.trim() || null,
        notes: payload.notes?.trim() || null,
        location_mode: payload.location_mode,
        street: payload.street?.trim() || null,
        city: payload.city?.trim() || null,
        state: payload.state?.trim().toUpperCase() || null,
        zip: payload.zip?.trim() || null,
        maps_link: payload.maps_link?.trim() || null,
        service_slug: payload.service_slug,
        service_name: pricing.service.name,
        format: payload.format,
        speed: payload.speed,
        base_price_cents: pricing.baseCents,
        total_cents: pricing.totalCents,
        status: "pending_payment",
      })
      .select("id, order_number, total_cents, customer_email, customer_name")
      .single();

    if (error) throw error;
    row = data;
  } catch (e) {
    console.error("[orders] insert failed", e);
    return NextResponse.json(
      { error: "Couldn't save your order. Please try again." },
      { status: 500 }
    );
  }

  const ref = formatRef(row.order_number);

  // --- Send emails (best-effort) ----------------------------------------
  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const totalUsd = (row.total_cents / 100).toFixed(0);
    const addressLine = payload.location_mode === "type"
      ? `${payload.street}, ${payload.city}, ${payload.state} ${payload.zip}`
      : payload.maps_link;

    // Customer confirmation
    try {
      await resend.emails.send({
        from: `Aerial Roof Measure <${siteConfig.email.orders}>`,
        to: [row.customer_email],
        replyTo: siteConfig.email.orders,
        subject: `Order ${ref} received — invoice coming shortly`,
        text:
          `Hi ${row.customer_name},\n\n` +
          `Thanks for ordering with Aerial Roof Measure. Here's your order summary:\n\n` +
          `Order: ${ref}\n` +
          `Property: ${addressLine}\n` +
          `Report: ${pricing.service.name}\n` +
          `Format: ${FORMAT_LABELS[payload.format as Format]}\n` +
          `Delivery: ${SPEED_LABELS[payload.speed as Speed]}\n` +
          `Estimated total: $${totalUsd}\n\n` +
          `We'll send a payment invoice to this email within a few minutes. ` +
          `Once it's settled, we'll start measuring and have your report ready ` +
          `within the timeframe you selected.\n\n` +
          `Questions? Reply to this email and we'll get back to you within 4 business hours.\n\n` +
          `— Aerial Roof Measure`,
      });
    } catch (e) {
      console.error("[orders] customer email failed", e);
    }

    // Admin alert
    try {
      await resend.emails.send({
        from: `Aerial Roof Measure Orders <${siteConfig.email.orders}>`,
        to: [siteConfig.email.orders],
        replyTo: row.customer_email,
        subject: `New order ${ref} — ${pricing.service.name} · $${totalUsd}`,
        text:
          `New order: ${ref}\n` +
          `\n` +
          `From: ${row.customer_name} <${row.customer_email}>` +
          (payload.customer_company ? ` · ${payload.customer_company}` : "") +
          `\n` +
          `Property: ${addressLine}\n` +
          `Report: ${pricing.service.name}\n` +
          `Format: ${FORMAT_LABELS[payload.format as Format]}\n` +
          `Delivery: ${SPEED_LABELS[payload.speed as Speed]}\n` +
          `Total: $${totalUsd}\n` +
          (payload.notes ? `\nNotes: ${payload.notes}\n` : "") +
          `\nManage at ${siteConfig.url}/admin/orders\n`,
      });
    } catch (e) {
      console.error("[orders] admin email failed", e);
    }
  } else {
    console.warn("[orders] RESEND_API_KEY missing — emails skipped");
  }

  return NextResponse.json({ ok: true, ref, total_cents: row.total_cents });
}

// ---------------- helpers ----------------

function validate(p: OrderPayload): string[] {
  const errs: string[] = [];
  if (!p.customer_name?.trim()) errs.push("Name required");
  if (!p.customer_email?.trim()) errs.push("Email required");
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.customer_email)) errs.push("Email looks invalid");
  if (!p.service_slug?.trim()) errs.push("Service required");
  if (!p.format?.trim()) errs.push("Format required");
  if (!["standard", "rush", "express"].includes(p.speed)) errs.push("Speed invalid");
  if (!["type", "link"].includes(p.location_mode as LocationMode)) errs.push("Location mode invalid");
  if (p.location_mode === "type") {
    if (!p.street?.trim()) errs.push("Street required");
    if (!p.city?.trim()) errs.push("City required");
    if (!p.state?.trim()) errs.push("State required");
    if (!p.zip || !/^\d{5}$/.test(p.zip)) errs.push("ZIP must be 5 digits");
  } else if (p.location_mode === "link") {
    if (!p.maps_link?.trim()) errs.push("Maps link required");
  }
  return errs;
}
