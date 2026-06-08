import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface TatBadgeProps {
  tone?: "dark" | "light";
  className?: string;
  label?: string;
  /** Add a slow copper shine sweep across the badge. */
  shine?: boolean;
}

export function TatBadge({
  tone = "light",
  className,
  label = "6-hour rush available",
  shine = true,
}: TatBadgeProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-tight overflow-hidden",
        tone === "dark"
          ? "bg-white/10 text-[color:var(--color-copper-300)] border border-white/15"
          : "bg-[color:var(--color-copper-50)] text-[color:var(--color-copper-700)] border border-[color:var(--color-copper-200)]",
        shine && "shine",
        className
      )}
    >
      <Zap
        className={cn(
          "h-3.5 w-3.5 fill-current",
          tone === "dark" ? "text-[color:var(--color-copper-300)]" : "text-[color:var(--color-copper-600)]"
        )}
      />
      <span className="relative z-10">{label}</span>
    </span>
  );
}
