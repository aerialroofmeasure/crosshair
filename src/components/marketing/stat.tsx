import { AnimatedNumber } from "@/components/marketing/animated-number";
import { cn } from "@/lib/utils";

interface StatProps {
  /** Numeric value (will animate up). */
  value: number;
  /** Decimal places (e.g. 1 for 98.4). */
  decimals?: number;
  /** Optional suffix shown in copper (e.g. "+", "%"). */
  suffix?: string;
  /** Optional prefix (e.g. "$"). */
  prefix?: string;
  label: string;
  className?: string;
  tone?: "dark" | "light";
  /** Center-align the value + label. */
  centered?: boolean;
  /** Smaller, denser sizing — for tight strips. */
  compact?: boolean;
  /** Seat the number inside a pressed-in neumorphic well. */
  inset?: boolean;
}

export function Stat({
  value,
  decimals = 0,
  prefix,
  suffix,
  label,
  className,
  tone = "light",
  centered = false,
  compact = false,
  inset = false,
}: StatProps) {
  const numberSize = compact
    ? "text-3xl md:text-4xl"
    : "text-4xl md:text-5xl";
  const labelSize = compact ? "text-xs md:text-sm" : "text-sm md:text-[15px]";

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        inset
          ? cn("rounded-2xl px-4 py-4 md:py-5", tone === "dark" ? "neu-dark-inset" : "neu-pressed")
          : "py-4 md:py-2 px-4",
        centered && "items-center text-center",
        className
      )}
    >
      <span
        className={cn(
          "font-stat font-semibold tracking-tight",
          numberSize,
          tone === "dark" ? "text-white" : "text-[color:var(--color-navy-900)]"
        )}
      >
        {prefix && <span>{prefix}</span>}
        <AnimatedNumber value={value} decimals={decimals} />
        {suffix && <span className="text-[color:var(--color-copper-500)] ml-0.5">{suffix}</span>}
      </span>
      <span
        className={cn(
          labelSize,
          tone === "dark" ? "text-white/65" : "text-[color:var(--color-stone)]"
        )}
      >
        {label}
      </span>
    </div>
  );
}
