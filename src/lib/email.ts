import { siteConfig } from "@/lib/site-config";

/**
 * Branded transactional email templates (Aerial Roof Measure).
 *
 * Email-client-safe: table-based layout, inline styles only, web-safe fonts,
 * solid colors (no flexbox/grid/gradients that break in Outlook). Every
 * builder returns { subject, html, text } — text is the plain-text fallback.
 */

const COLORS = {
  navy: "#0b1e3a",
  navy2: "#0e2342",
  copper: "#c9892f",
  copperLight: "#ddb05c",
  cream: "#f4ede0",
  warmWhite: "#faf7f2",
  ink: "#0b1e3a",
  body: "#3a3f48",
  stone: "#8a8f99",
  border: "#e8e2d6",
};

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface DetailRow {
  label: string;
  value: string;
  strong?: boolean;
}

interface BaseOpts {
  preheader: string;
  eyebrow: string;
  heading: string;
  intro: string;
  rows?: DetailRow[];
  note?: string;
  cta?: { label: string; url: string; tone?: "navy" | "copper" };
}

function detailTable(rows: DetailRow[]): string {
  const body = rows
    .map((r, i) => {
      const last = i === rows.length - 1;
      const border = last ? "" : `border-bottom:1px solid ${COLORS.border};`;
      const valColor = r.strong ? COLORS.copper : COLORS.ink;
      const valSize = r.strong ? "16px" : "14px";
      const valWeight = r.strong ? "700" : "600";
      return `
        <tr>
          <td style="padding:12px 0;${border}font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${COLORS.stone};vertical-align:top;">${escapeHtml(r.label)}</td>
          <td align="right" style="padding:12px 0;${border}font-family:Arial,Helvetica,sans-serif;font-size:${valSize};font-weight:${valWeight};color:${valColor};vertical-align:top;">${escapeHtml(r.value)}</td>
        </tr>`;
    })
    .join("");
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:8px 0 4px;">${body}</table>`;
}

function ctaButton(cta: NonNullable<BaseOpts["cta"]>): string {
  const bg = cta.tone === "copper" ? COLORS.copper : COLORS.navy;
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px 0 6px;">
      <tr>
        <td align="center" bgcolor="${bg}" style="border-radius:10px;">
          <a href="${escapeHtml(cta.url)}" target="_blank"
             style="display:inline-block;padding:13px 28px;font-family:Arial,Helvetica,sans-serif;font-size:14px;font-weight:600;color:#ffffff;text-decoration:none;border-radius:10px;">
            ${escapeHtml(cta.label)} &rarr;
          </a>
        </td>
      </tr>
    </table>`;
}

function baseLayout(o: BaseOpts): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <meta name="color-scheme" content="light only" />
  <title>${escapeHtml(o.heading)}</title>
</head>
<body style="margin:0;padding:0;background:${COLORS.cream};-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(o.preheader)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.cream};">
    <tr>
      <td align="center" style="padding:36px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:600px;background:${COLORS.warmWhite};border-radius:18px;overflow:hidden;box-shadow:0 10px 34px rgba(11,30,58,0.14);">

          <!-- Header -->
          <tr>
            <td style="background:${COLORS.navy};padding:30px 36px 26px;">
              <div style="font-family:Georgia,'Times New Roman',serif;font-size:21px;font-weight:700;letter-spacing:0.5px;color:#ffffff;">
                Aerial Roof Measure
              </div>
              <div style="margin-top:7px;font-family:Arial,Helvetica,sans-serif;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.copperLight};">
                Professional &middot; Precise &middot; On Time
              </div>
            </td>
          </tr>
          <!-- Copper hairline -->
          <tr><td style="height:3px;line-height:3px;font-size:0;background:${COLORS.copper};">&nbsp;</td></tr>

          <!-- Body -->
          <tr>
            <td style="padding:34px 36px 30px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:${COLORS.copper};">
                ${escapeHtml(o.eyebrow)}
              </div>
              <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:25px;line-height:1.25;color:${COLORS.ink};font-weight:700;">
                ${escapeHtml(o.heading)}
              </h1>
              <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.65;color:${COLORS.body};">
                ${o.intro}
              </p>
              ${o.rows && o.rows.length ? `<div style="margin-top:22px;background:${COLORS.warmWhite};border:1px solid ${COLORS.border};border-radius:12px;padding:6px 18px;">${detailTable(o.rows)}</div>` : ""}
              ${o.cta ? ctaButton(o.cta) : ""}
              ${o.note ? `<p style="margin:24px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.6;color:${COLORS.stone};">${o.note}</p>` : ""}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:${COLORS.navy};padding:24px 36px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:rgba(255,255,255,0.55);">
                Aerial Roof Measure &middot; ${escapeHtml(siteConfig.email.support)}<br/>
                Professional roof, wall &amp; gutter measurement reports.
              </div>
            </td>
          </tr>

        </table>
        <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:${COLORS.stone};margin-top:16px;">
          &copy; ${escapeHtml(String(new Date().getFullYear()))} Aerial Roof Measure
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function rowsToText(rows: DetailRow[]): string {
  return rows.map((r) => `${r.label}: ${r.value}`).join("\n");
}

/* ============================================================
   Builders
   ============================================================ */

export interface OrderEmailData {
  customerName: string;
  customerEmail?: string;
  customerCompany?: string | null;
  ref: string;
  addressLine: string;
  serviceName: string;
  formatLabel: string;
  speedLabel: string;
  totalUsd: string;
  notes?: string | null;
}

/** Customer-facing order confirmation. */
export function orderConfirmationEmail(d: OrderEmailData): { subject: string; html: string; text: string } {
  const rows: DetailRow[] = [
    { label: "Order", value: d.ref },
    { label: "Property", value: d.addressLine },
    { label: "Report", value: d.serviceName },
    { label: "Format", value: d.formatLabel },
    { label: "Delivery", value: d.speedLabel },
    { label: "Estimated total", value: `$${d.totalUsd}`, strong: true },
  ];
  const subject = `Order ${d.ref} received — invoice coming shortly`;
  const html = baseLayout({
    preheader: `We've received order ${d.ref}. Your invoice is on the way.`,
    eyebrow: "Order received",
    heading: `Thanks, ${d.customerName.split(/\s+/)[0] || "there"} — we've got your order.`,
    intro:
      "Here's a summary of what you ordered. We'll email a payment invoice shortly; once it's settled we'll start measuring and deliver within your selected window.",
    rows,
    cta: { label: "View in your portal", url: `${siteConfig.url}/portal/orders`, tone: "copper" },
    note: "Questions? Just reply to this email — we respond within 4 business hours.",
  });
  const text =
    `Hi ${d.customerName},\n\n` +
    `Thanks for ordering with Aerial Roof Measure. Here's your order summary:\n\n` +
    rowsToText(rows) +
    `\n\nWe'll send a payment invoice to this email within a few minutes. Once settled, we'll deliver your report within the timeframe selected.\n\n` +
    `View it anytime: ${siteConfig.url}/portal/orders\n\n` +
    `Questions? Reply to this email and we'll get back within 4 business hours.\n\n— Aerial Roof Measure`;
  return { subject, html, text };
}

/** Internal new-order alert (to the orders inbox). */
export function newOrderAlertEmail(d: OrderEmailData & { manageUrl: string }): { subject: string; html: string; text: string } {
  const rows: DetailRow[] = [
    { label: "Order", value: d.ref },
    { label: "Customer", value: d.customerCompany ? `${d.customerName} · ${d.customerCompany}` : d.customerName },
    { label: "Email", value: d.customerEmail ?? "—" },
    { label: "Property", value: d.addressLine },
    { label: "Report", value: d.serviceName },
    { label: "Format", value: d.formatLabel },
    { label: "Delivery", value: d.speedLabel },
    { label: "Total", value: `$${d.totalUsd}`, strong: true },
  ];
  const subject = `New order ${d.ref} — ${d.serviceName} · $${d.totalUsd}`;
  const html = baseLayout({
    preheader: `${d.customerName} placed ${d.ref} (${d.serviceName}, $${d.totalUsd}).`,
    eyebrow: "New order",
    heading: `New order ${d.ref}`,
    intro: "A new order just came in. Mark it paid in the admin console to release it to the fulfillment queue.",
    rows,
    cta: { label: "Open in admin", url: d.manageUrl, tone: "navy" },
    note: d.notes ? `Customer notes: “${escapeHtml(d.notes)}”` : undefined,
  });
  const text =
    `New order: ${d.ref}\n\n` +
    rowsToText(rows) +
    (d.notes ? `\n\nNotes: ${d.notes}` : "") +
    `\n\nManage at ${d.manageUrl}`;
  return { subject, html, text };
}

/** Customer-facing "your report is ready" email. */
export function reportReadyEmail(d: { customerName: string; ref: string; serviceName: string }): { subject: string; html: string; text: string } {
  const subject = `Your report is ready — order ${d.ref}`;
  const html = baseLayout({
    preheader: `Your ${d.serviceName} report (${d.ref}) is ready to download.`,
    eyebrow: "Report delivered",
    heading: "Your report is ready.",
    intro: `Good news — your <strong>${escapeHtml(d.serviceName)}</strong> report for order <strong>${escapeHtml(d.ref)}</strong> has been delivered. Sign in to download your files anytime.`,
    cta: { label: "Download your report", url: `${siteConfig.url}/portal/orders`, tone: "copper" },
    note: "Files remain available in your portal. Questions? Just reply to this email.",
  });
  const text =
    `Hi ${d.customerName},\n\n` +
    `Good news — your ${d.serviceName} report (${d.ref}) is ready.\n\n` +
    `Sign in to download it any time: ${siteConfig.url}/portal/orders\n\n` +
    `Questions? Just reply to this email.\n\n— Aerial Roof Measure`;
  return { subject, html, text };
}
