import { MapPin, Link2, Mail, ExternalLink, Clock } from "lucide-react";
import { StatusPill } from "@/components/portal/status-pill";
import { formatRef, formatLabelShort, speedLabelShort, type OrderStatus } from "@/lib/orders";

export interface OrderCardData {
  order_number: number;
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

function addressLine(o: OrderCardData) {
  if (o.location_mode === "link") return null;
  return [o.street, o.city, o.state, o.zip].filter(Boolean).join(", ");
}

/**
 * Premium neumorphic order card for staff views. Accepts a `meta` line
 * (e.g. assigned/completed timestamp) and an `action` slot (claim button,
 * complete flow, download list).
 */
export function OrderCard({
  order,
  meta,
  action,
}: {
  order: OrderCardData;
  meta?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="neu-card p-6 transition-transform hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">
              {formatRef(order.order_number)}
            </span>
            <StatusPill status={order.status} />
          </div>
          <div className="mt-2 text-[15px] font-medium text-[color:var(--color-navy-900)] truncate">
            {order.customer_name}
            {order.customer_company && (
              <span className="text-[color:var(--color-stone)] font-normal"> · {order.customer_company}</span>
            )}
          </div>
          <a
            href={`mailto:${order.customer_email}`}
            className="mt-0.5 inline-flex items-center gap-1 text-xs text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)]"
          >
            <Mail className="h-3 w-3" />
            {order.customer_email}
          </a>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="font-numeric font-bold text-lg text-[color:var(--color-navy-900)]">
            ${(order.total_cents / 100).toFixed(0)}
          </div>
          <div className="mt-0.5 inline-flex items-center gap-1 rounded-full neu-inset px-2 py-0.5 text-[11px] font-semibold text-[color:var(--color-charcoal)]">
            {formatLabelShort(order.format)} · {speedLabelShort(order.speed)}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 text-sm">
        <div className="flex items-start gap-2 text-[color:var(--color-charcoal)]">
          {order.location_mode === "link" ? (
            <Link2 className="h-4 w-4 mt-0.5 text-[color:var(--color-stone)] flex-shrink-0" />
          ) : (
            <MapPin className="h-4 w-4 mt-0.5 text-[color:var(--color-stone)] flex-shrink-0" />
          )}
          <span className="min-w-0">
            {order.location_mode === "link" ? (
              <a href={order.maps_link ?? "#"} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1 text-[color:var(--color-copper-700)]">
                Open map link
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              addressLine(order)
            )}
          </span>
        </div>
        <div className="text-[color:var(--color-stone)] text-xs pl-6">{order.service_name}</div>
      </div>

      {order.notes && (
        <div className="mt-3 rounded-xl neu-inset px-3.5 py-2.5 text-xs text-[color:var(--color-charcoal)] italic">
          “{order.notes}”
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[color:var(--color-border-soft)]">
        <span className="inline-flex items-center gap-1.5 text-xs text-[color:var(--color-stone)]">
          <Clock className="h-3 w-3" />
          {meta ?? (
            <>Placed {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
          )}
        </span>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
    </div>
  );
}
