import { MapPin, Link2, Mail, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { StatusSelect } from "@/components/admin/status-select";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { formatRef, type OrderStatus } from "@/lib/orders";

export const metadata = { title: "Admin · Orders" };
export const dynamic = "force-dynamic";

interface AdminOrderRow {
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
  service_name: string;
  format: string;
  speed: string;
  total_cents: number;
  status: OrderStatus;
  created_at: string;
}

export default async function AdminOrdersPage() {
  let orders: AdminOrderRow[] = [];
  let stats = { total: 0, pending: 0, active: 0, delivered: 0, mtdRevenueCents: 0 };

  try {
    // Use service-role client — admin layout already verified the caller.
    const admin = createSupabaseAdminClient();
    const { data, error } = await admin
      .from("orders")
      .select(
        "id, order_number, user_id, customer_name, customer_email, customer_company, notes, location_mode, street, city, state, zip, maps_link, service_name, format, speed, total_cents, status, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(200);
    if (!error && data) orders = data as AdminOrderRow[];

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    stats = orders.reduce(
      (acc, o) => {
        acc.total++;
        if (o.status === "pending_payment") acc.pending++;
        if (o.status === "paid" || o.status === "in_progress") acc.active++;
        if (o.status === "delivered") acc.delivered++;
        if (o.created_at >= monthStart && (o.status === "paid" || o.status === "in_progress" || o.status === "delivered")) {
          acc.mtdRevenueCents += o.total_cents;
        }
        return acc;
      },
      { total: 0, pending: 0, active: 0, delivered: 0, mtdRevenueCents: 0 }
    );
  } catch {
    // Supabase not configured — empty state
  }

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="All orders"
        description="Live view across every customer. Update status inline to trigger downstream actions."
      />

      {/* Stats strip */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total orders" value={stats.total.toString()} />
        <Stat label="Pending payment" value={stats.pending.toString()} tone="amber" />
        <Stat label="Active (paid + in progress)" value={stats.active.toString()} tone="copper" />
        <Stat label="MTD revenue" value={`$${(stats.mtdRevenueCents / 100).toFixed(0)}`} tone="navy" />
      </div>

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyCard
            icon={<Mail className="h-6 w-6" />}
            title="No orders yet"
            description="When your first customer places an order, it'll show up here. You'll also get an email at orders@aerialroofmeasure.com."
          />
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-[color:var(--color-border-soft)] bg-white overflow-hidden">
          <div className="hidden lg:grid grid-cols-[110px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_100px_220px] gap-4 px-6 py-3 bg-[color:var(--color-warm-cream)]/40 text-[10px] font-semibold tracking-[0.16em] uppercase text-[color:var(--color-stone)]">
            <div>Order</div>
            <div>Customer · Property</div>
            <div>Report</div>
            <div>Placed</div>
            <div className="text-right">Total</div>
            <div>Status</div>
          </div>
          <ul>
            {orders.map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-1 lg:grid-cols-[110px_minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)_100px_220px] gap-4 px-6 py-5 border-t border-[color:var(--color-border-soft)] first:border-t-0 items-start"
              >
                <div className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)] pt-1.5">
                  {formatRef(o.order_number)}
                </div>

                <div className="min-w-0">
                  <div className="text-sm font-medium text-[color:var(--color-navy-900)] truncate">
                    {o.customer_name}
                    {o.customer_company && (
                      <span className="text-[color:var(--color-stone)] font-normal"> · {o.customer_company}</span>
                    )}
                  </div>
                  <a
                    href={`mailto:${o.customer_email}`}
                    className="mt-0.5 inline-flex items-center gap-1 text-xs text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)]"
                  >
                    <Mail className="h-3 w-3" />
                    {o.customer_email}
                  </a>
                  <div className="mt-2 flex items-start gap-1.5 text-xs text-[color:var(--color-charcoal)]">
                    {o.location_mode === "link" ? (
                      <Link2 className="h-3 w-3 mt-0.5 text-[color:var(--color-stone)] flex-shrink-0" />
                    ) : (
                      <MapPin className="h-3 w-3 mt-0.5 text-[color:var(--color-stone)] flex-shrink-0" />
                    )}
                    <span className="min-w-0">
                      {o.location_mode === "link" ? (
                        <a href={o.maps_link ?? "#"} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                          Map link
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        [o.street, o.city, o.state, o.zip].filter(Boolean).join(", ")
                      )}
                    </span>
                  </div>
                  {o.notes && (
                    <div className="mt-2 text-xs text-[color:var(--color-stone)] italic line-clamp-2">
                      “{o.notes}”
                    </div>
                  )}
                </div>

                <div className="text-sm">
                  <div className="text-[color:var(--color-navy-900)]">{o.service_name}</div>
                  <div className="text-xs text-[color:var(--color-stone)] mt-0.5">
                    {formatLabel(o.format)} · {speedLabel(o.speed)}
                  </div>
                </div>

                <div className="text-xs text-[color:var(--color-stone)]">
                  {new Date(o.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>

                <div className="text-right font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">
                  ${(o.total_cents / 100).toFixed(0)}
                </div>

                <div>
                  <StatusSelect orderId={o.id} current={o.status} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, tone = "navy" }: { label: string; value: string; tone?: "navy" | "amber" | "copper" }) {
  const toneClass = {
    navy: "text-[color:var(--color-navy-900)]",
    amber: "text-amber-700",
    copper: "text-[color:var(--color-copper-700)]",
  }[tone];
  return (
    <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-5">
      <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)]">{label}</div>
      <div className={`mt-2 font-numeric font-bold text-3xl tracking-tight ${toneClass}`}>{value}</div>
    </div>
  );
}

function formatLabel(f: string) {
  return f === "esx" ? "ESX" : f === "xml" ? "XML" : f === "bundle" ? "Bundle" : "PDF";
}

function speedLabel(s: string) {
  return s === "rush" ? "Rush 6h" : s === "express" ? "Express 2h" : "Standard 24h";
}
