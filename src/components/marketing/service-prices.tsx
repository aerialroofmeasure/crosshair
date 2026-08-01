import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FORMAT_LABELS } from "@/lib/orders";
import { cn } from "@/lib/utils";

/**
 * Per-format price breakdown for a service — "type and price" for every
 * variant. When `slug` is provided each format is a tappable row-card that
 * deep-links into the order flow with that service + format preselected.
 * A persistent chevron signals it's clickable (works on touch, no hover).
 */
export function ServicePrices({
  prices,
  slug,
  savings,
  className,
}: {
  prices: Record<string, number>;
  /** Service slug — makes each format row a link into /order. */
  slug?: string;
  /** Optional "save up to X%" vs the industry-average comparison. */
  savings?: number;
  className?: string;
}) {
  const rows = Object.entries(prices);
  const multi = rows.length > 1;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[color:var(--color-stone)]">
          {slug ? (multi ? "Tap a format to order" : "Tap to order") : multi ? "Pricing by format" : "Price"}
        </span>
        {savings && savings > 0 ? (
          <span className="inline-flex items-center rounded-full bg-[color:var(--color-copper-500)]/12 text-[color:var(--color-copper-700)] border border-[color:var(--color-copper-500)]/25 px-2 py-0.5 text-[10px] font-bold tracking-tight whitespace-nowrap">
            Save up to {savings}%
          </span>
        ) : null}
      </div>

      {slug ? (
        <div className="space-y-2">
          {rows.map(([fmt, price]) => (
            <Link
              key={fmt}
              href={`/order?service=${slug}&format=${fmt}`}
              className="group/row flex items-center justify-between gap-3 rounded-lg border border-[color:var(--color-border-soft)] bg-white px-3.5 py-2.5 transition-colors hover:border-[color:var(--color-copper-300)] hover:bg-[color:var(--color-copper-50)]/50 active:bg-[color:var(--color-copper-50)]/70"
            >
              <span className="text-sm font-medium text-[color:var(--color-navy-900)]">{FORMAT_LABELS[fmt] ?? fmt}</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="font-numeric font-semibold text-[15px] text-[color:var(--color-navy-900)]">${price}</span>
                <ChevronRight className="h-4 w-4 text-[color:var(--color-copper-500)] transition-transform group-hover/row:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="divide-y divide-[color:var(--color-border-soft)]/70">
          {rows.map(([fmt, price]) => (
            <div key={fmt} className="flex items-baseline justify-between gap-3 py-[7px]">
              <span className="text-sm text-[color:var(--color-charcoal)]">{FORMAT_LABELS[fmt] ?? fmt}</span>
              <span className="font-numeric font-semibold text-[15px] text-[color:var(--color-navy-900)] whitespace-nowrap">${price}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
