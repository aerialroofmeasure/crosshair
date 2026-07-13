import { FORMAT_LABELS } from "@/lib/orders";
import { cn } from "@/lib/utils";

/**
 * Per-format price breakdown for a service — "type and price" for every
 * variant, so there's no "From $X" ambiguity. Compact by design.
 */
export function ServicePrices({
  prices,
  savings,
  className,
}: {
  prices: Record<string, number>;
  /** Optional "save up to X%" vs the industry-average comparison. */
  savings?: number;
  className?: string;
}) {
  const rows = Object.entries(prices);
  const multi = rows.length > 1;

  return (
    <div className={cn("", className)}>
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[color:var(--color-stone)]">
          {multi ? "Pricing by format" : "Price"}
        </span>
        {savings && savings > 0 ? (
          <span className="inline-flex items-center rounded-full bg-[color:var(--color-copper-500)]/12 text-[color:var(--color-copper-700)] border border-[color:var(--color-copper-500)]/25 px-2 py-0.5 text-[10px] font-bold tracking-tight whitespace-nowrap">
            Save up to {savings}%
          </span>
        ) : null}
      </div>

      <div className="divide-y divide-[color:var(--color-border-soft)]/70">
        {rows.map(([fmt, price]) => (
          <div key={fmt} className="flex items-baseline justify-between gap-3 py-[7px]">
            <span className="text-sm text-[color:var(--color-charcoal)]">{FORMAT_LABELS[fmt] ?? fmt}</span>
            <span className="font-numeric font-semibold text-[15px] text-[color:var(--color-navy-900)] whitespace-nowrap">
              ${price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
