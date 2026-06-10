import Link from "next/link";
import { ArrowRight, FolderOpen, FilePlus, MapPin, Link2 } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { StatusPill } from "@/components/portal/status-pill";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRef, type OrderStatus } from "@/lib/orders";

export const metadata = { title: "Orders" };
// Always fetch fresh — orders are inherently dynamic and per-user.
export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  order_number: number;
  service_name: string;
  format: string;
  speed: string;
  status: OrderStatus;
  location_mode: "type" | "link";
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  maps_link: string | null;
  total_cents: number;
  created_at: string;
}

export default async function OrdersPage() {
  let orders: OrderRow[] = [];

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, service_name, format, speed, status, location_mode, street, city, state, zip, maps_link, total_cents, created_at"
        )
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });
      if (!error && data) orders = data as OrderRow[];
    }
  } catch {
    // Supabase not configured — render empty state
  }

  return (
    <div>
      <PageHeader
        eyebrow="Orders"
        title="All your orders"
        description="Status, ETAs, download links and re-issue requests — all in one place."
        action={
          <ButtonLink href="/portal/orders/new" size="md">
            <FilePlus className="h-4 w-4" />
            New order
          </ButtonLink>
        }
      />

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyCard
            icon={<FolderOpen className="h-6 w-6" />}
            title="No orders yet"
            description="When you place an order it'll show up here with live status, delivery ETAs and download links the moment it ships."
            action={
              <ButtonLink href="/portal/orders/new" size="md">
                <FilePlus className="h-4 w-4" />
                Start your first order
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-[color:var(--color-border-soft)] bg-white overflow-hidden">
          <div className="hidden md:grid grid-cols-[140px_1fr_180px_160px_140px] gap-4 px-6 py-3 bg-[color:var(--color-warm-cream)]/40 text-[10px] font-semibold tracking-[0.16em] uppercase text-[color:var(--color-stone)]">
            <div>Order</div>
            <div>Property · Report</div>
            <div>Status</div>
            <div className="text-right">Total</div>
            <div className="text-right">Placed</div>
          </div>
          <ul>
            {orders.map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-1 md:grid-cols-[140px_1fr_180px_160px_140px] gap-4 px-6 py-5 border-t border-[color:var(--color-border-soft)] first:border-t-0 items-center hover:bg-[color:var(--color-warm-cream)]/20 transition"
              >
                <div className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">
                  {formatRef(o.order_number)}
                </div>
                <div>
                  <div className="text-sm font-medium text-[color:var(--color-navy-900)] flex items-center gap-1.5">
                    {o.location_mode === "link" ? (
                      <Link2 className="h-3.5 w-3.5 text-[color:var(--color-stone)]" />
                    ) : (
                      <MapPin className="h-3.5 w-3.5 text-[color:var(--color-stone)]" />
                    )}
                    {addressLine(o)}
                  </div>
                  <div className="mt-0.5 text-xs text-[color:var(--color-stone)]">
                    {o.service_name} · {formatLabel(o.format)} · {speedLabel(o.speed)}
                  </div>
                </div>
                <div>
                  <StatusPill status={o.status} />
                </div>
                <div className="text-right font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">
                  ${(o.total_cents / 100).toFixed(0)}
                </div>
                <div className="text-right text-xs text-[color:var(--color-stone)]">
                  {new Date(o.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </li>
            ))}
          </ul>
          {/* Hint while no detail page exists yet */}
          <div className="px-6 py-4 bg-[color:var(--color-warm-cream)]/30 border-t border-[color:var(--color-border-soft)] text-xs text-[color:var(--color-stone)]">
            <Link
              href="/portal/support"
              className="text-[color:var(--color-copper-600)] font-medium hover:text-[color:var(--color-copper-700)]"
            >
              Question about an order?
            </Link>{" "}
            We&apos;ll respond within 4 business hours.
          </div>
        </div>
      )}
    </div>
  );
}

function addressLine(o: OrderRow) {
  if (o.location_mode === "link") return "Pinned via map link";
  return [o.street, o.city, o.state, o.zip].filter(Boolean).join(", ");
}

function formatLabel(f: string) {
  return f === "esx" ? "ESX" : f === "xml" ? "XML" : f === "bundle" ? "Bundle" : "PDF";
}

function speedLabel(s: string) {
  return s === "rush" ? "Rush 6h" : s === "express" ? "Express 2h" : "Standard 24h";
}
