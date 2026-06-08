import { cn } from "@/lib/utils";

interface PriceTagProps {
  /** What the customer pays (the "deal" price). */
  price: number;
  /** Industry-average / list price — shown struck through above the deal price. */
  compareAt?: number;
  /** Size variant. */
  size?: "sm" | "md" | "lg";
  /** Layout — `inline` is for tight slots, `stacked` is for cards. */
  layout?: "inline" | "stacked";
  /** Show "From" prefix on the price. */
  showFrom?: boolean;
  className?: string;
  /** Dark backgrounds (e.g. on the navy hero). */
  tone?: "light" | "dark";
}

/**
 * Premium price display with a strike-through "industry average" comparison.
 * Communicates value at a glance:
 *
 *   INDUSTRY AVG ~~$32~~
 *   From $18 · save 44%
 */
export function PriceTag({
  price,
  compareAt,
  size = "md",
  layout = "stacked",
  showFrom = true,
  className,
  tone = "light",
}: PriceTagProps) {
  const savings =
    compareAt && compareAt > price
      ? Math.round(((compareAt - price) / compareAt) * 100)
      : 0;

  const priceSize = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-4xl md:text-5xl",
  }[size];

  const compareSize = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  }[size];

  const labelMuted = tone === "dark" ? "text-white/55" : "text-[color:var(--color-stone)]";
  const priceColor = tone === "dark" ? "text-white" : "text-[color:var(--color-navy-900)]";
  const compareColor = tone === "dark" ? "text-white/45" : "text-[color:var(--color-stone)]/80";

  if (layout === "inline") {
    return (
      <span className={cn("inline-flex items-baseline gap-2", className)}>
        {compareAt && (
          <span className={cn(compareSize, "font-numeric line-through", compareColor)}>
            ${compareAt}
          </span>
        )}
        <span className={cn("font-numeric font-bold", priceSize, priceColor)}>
          ${price}
        </span>
        {savings > 0 && (
          <span className="inline-flex items-center rounded-full bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-700)] px-2 py-0.5 text-[11px] font-semibold tracking-tight">
            Save {savings}%
          </span>
        )}
      </span>
    );
  }

  // stacked layout
  return (
    <div className={cn("flex items-end justify-between gap-3", className)}>
      <div>
        {compareAt && (
          <div className={cn("flex items-baseline gap-2", labelMuted)}>
            <span className="text-[10px] font-semibold tracking-[0.16em] uppercase">
              Industry avg
            </span>
            <span className={cn(compareSize, "font-numeric line-through", compareColor)}>
              ${compareAt}
            </span>
          </div>
        )}
        <div className="mt-1 flex items-baseline gap-2">
          {showFrom && (
            <span className={cn("text-xs font-medium", labelMuted)}>From</span>
          )}
          <span className={cn("font-numeric font-bold tracking-tight leading-none", priceSize, priceColor)}>
            ${price}
          </span>
        </div>
      </div>

      {savings > 0 && (
        <span className="inline-flex items-center rounded-full bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-700)] border border-[color:var(--color-copper-500)]/25 px-2.5 py-1 text-[11px] font-bold tracking-tight whitespace-nowrap">
          Save {savings}%
        </span>
      )}
    </div>
  );
}
