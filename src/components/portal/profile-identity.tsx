import { cn } from "@/lib/utils";

export interface ProfileStat {
  label: string;
  value: string;
}

export type ProfileAccent = "copper" | "emp" | "adm";

const ACCENTS: Record<ProfileAccent, { avatar: string; badge: string; glow: string }> = {
  copper: {
    avatar: "from-[color:var(--color-copper-400)] to-[color:var(--color-copper-700)]",
    badge: "bg-gradient-to-r from-[color:var(--color-copper-600)] to-[color:var(--color-copper-400)] text-white shadow-[0_4px_14px_-6px_rgba(201,137,47,0.7)]",
    glow: "bg-[color:var(--color-copper-400)]/12",
  },
  emp: {
    avatar: "from-[color:var(--color-emp-400)] to-[color:var(--color-emp-700)]",
    badge: "bg-gradient-to-r from-[color:var(--color-emp-600)] to-[color:var(--color-emp-400)] text-white shadow-[0_4px_14px_-6px_rgba(47,111,199,0.7)]",
    glow: "bg-[color:var(--color-emp-500)]/14",
  },
  adm: {
    avatar: "from-[color:var(--color-adm-400)] to-[color:var(--color-adm-700)]",
    badge: "bg-gradient-to-r from-[color:var(--color-adm-600)] to-[color:var(--color-adm-400)] text-white shadow-[0_4px_14px_-6px_rgba(143,47,67,0.75)]",
    glow: "bg-[color:var(--color-adm-500)]/14",
  },
};

/**
 * Premium neumorphic identity hero shared across the customer, employee and
 * admin profile pages. Shows a copper avatar, name/email, a role badge and an
 * optional row of stat chips.
 */
export function ProfileIdentity({
  name,
  email,
  roleLabel,
  subtitle,
  stats,
  accent = "copper",
}: {
  name: string;
  email: string;
  roleLabel: string;
  subtitle?: string;
  stats?: ProfileStat[];
  accent?: ProfileAccent;
}) {
  const a = ACCENTS[accent];
  const initials =
    (name || email || "U")
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

  return (
    <div className="neu-card p-7 md:p-8 relative overflow-hidden">
      <div aria-hidden className={cn("absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl pointer-events-none", a.glow)} />
      <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
        <div className={cn("h-20 w-20 rounded-2xl bg-gradient-to-br flex items-center justify-center text-2xl font-semibold text-white tracking-tight flex-shrink-0 shadow-[0_10px_28px_-10px_rgba(11,30,58,0.45)]", a.avatar)}>
          {initials}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-display truncate">{name || "Your account"}</h2>
            <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase", a.badge)}>
              {roleLabel}
            </span>
          </div>
          <p className="mt-1 text-[color:var(--color-stone)] text-sm truncate">{email}</p>
          {subtitle && <p className="mt-0.5 text-xs text-[color:var(--color-stone)]">{subtitle}</p>}
        </div>
      </div>

      {stats && stats.length > 0 && (
        <div className={cn("relative mt-7 grid gap-3", stats.length >= 3 ? "grid-cols-3" : "grid-cols-2")}>
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl neu-inset px-4 py-3 text-center">
              <div className="font-numeric font-bold text-2xl text-[color:var(--color-navy-900)]">{s.value}</div>
              <div className="mt-0.5 text-[11px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-stone)]">{s.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
