import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type OverviewAccent = "navy" | "copper" | "emp" | "adm";

const NUMBER_COLOR: Record<OverviewAccent, string> = {
  navy: "text-[color:var(--color-navy-900)]",
  copper: "text-[color:var(--color-copper-700)]",
  emp: "text-[color:var(--color-emp-600)]",
  adm: "text-[color:var(--color-adm-700)]",
};

const ICON_COLOR: Record<OverviewAccent, string> = {
  navy: "text-[color:var(--color-navy-900)]",
  copper: "text-[color:var(--color-copper-700)]",
  emp: "text-[color:var(--color-emp-600)]",
  adm: "text-[color:var(--color-adm-700)]",
};

/** Neumorphic KPI tile with the catchy stat font and an optional role accent. */
export function StatTile({
  label,
  value,
  hint,
  icon,
  accent = "navy",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ReactNode;
  accent?: OverviewAccent;
}) {
  return (
    <div className="neu-card p-5 md:p-6">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)]">{label}</span>
        <span className={cn("h-8 w-8 rounded-lg neu-inset flex items-center justify-center", ICON_COLOR[accent])}>{icon}</span>
      </div>
      <div className={cn("mt-4 font-stat font-bold text-4xl tracking-tight", NUMBER_COLOR[accent])}>{value}</div>
      {hint && <div className="mt-1 text-xs text-[color:var(--color-stone)]">{hint}</div>}
    </div>
  );
}

/** Neumorphic quick-action card that links somewhere. */
export function ActionCard({
  href,
  icon,
  title,
  body,
  cta,
  accent = "copper",
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  accent?: OverviewAccent;
  external?: boolean;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <Link href={href} className="group neu-card p-6 transition-transform hover:-translate-y-0.5">
      <span className={cn("inline-flex h-11 w-11 rounded-xl neu-inset items-center justify-center", ICON_COLOR[accent])}>{icon}</span>
      <h3 className="mt-4 font-display text-xl text-[color:var(--color-navy-900)]">{title}</h3>
      <p className="mt-1.5 text-[14px] text-[color:var(--color-stone)] leading-relaxed">{body}</p>
      <span className={cn("mt-5 inline-flex items-center gap-1.5 text-sm font-medium", NUMBER_COLOR[accent])}>
        {cta}
        <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
