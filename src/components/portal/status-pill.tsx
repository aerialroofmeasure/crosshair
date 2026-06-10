import { STATUS_LABELS, STATUS_TONES, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

const toneStyles: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  blue: "bg-sky-50 text-sky-700 border-sky-200",
  copper: "bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-700)] border-[color:var(--color-copper-500)]/30",
  navy: "bg-[color:var(--color-navy-900)]/10 text-[color:var(--color-navy-900)] border-[color:var(--color-navy-900)]/15",
  red: "bg-red-50 text-red-700 border-red-200",
};

export function StatusPill({ status, className }: { status: OrderStatus; className?: string }) {
  const tone = STATUS_TONES[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold tracking-tight",
        toneStyles[tone],
        className
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {STATUS_LABELS[status]}
    </span>
  );
}
