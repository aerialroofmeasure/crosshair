import Link from "next/link";
import {
  ArrowRight,
  FilePlus,
  FolderOpen,
  Receipt,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Dashboard" };

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Greeting name + live stats from the user's own orders.
  let firstName = "";
  const stats = { active: 0, delivered: 0, spend30Cents: 0 };
  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    const meta = (userData.user?.user_metadata ?? {}) as Record<string, string>;
    firstName = (meta.full_name ?? "").split(/\s+/)[0] ?? "";

    if (userData.user) {
      const { data } = await supabase
        .from("orders")
        .select("status, total_cents, created_at")
        .eq("user_id", userData.user.id);
      const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
      for (const o of (data ?? []) as { status: string; total_cents: number; created_at: string }[]) {
        if (o.status === "paid" || o.status === "in_progress") stats.active++;
        if (o.status === "delivered") stats.delivered++;
        if (o.status !== "cancelled" && o.status !== "pending_payment" && new Date(o.created_at).getTime() >= cutoff) {
          stats.spend30Cents += o.total_cents;
        }
      }
    }
  } catch {}

  return (
    <div>
      <PageHeader
        eyebrow="Dashboard"
        title={firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
        description="Place an order, check report status, or re-download past files."
        action={
          <ButtonLink href="/portal/orders/new" size="md">
            New order
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        }
      />

      {/* Quick stats — premium card style */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <StatCard
          label="Active orders"
          value={String(stats.active)}
          hint="Live reports in progress"
          icon={<FolderOpen className="h-4 w-4" />}
        />
        <StatCard
          label="Reports delivered"
          value={String(stats.delivered)}
          hint="Lifetime total"
          icon={<ShieldCheck className="h-4 w-4" />}
        />
        <StatCard
          label="Spend · last 30 days"
          value={`$${(stats.spend30Cents / 100).toFixed(0)}`}
          hint="Across all report types"
          icon={<Receipt className="h-4 w-4" />}
        />
      </div>

      {/* Quick actions row */}
      <div className="mt-10">
        <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
          Quick actions
        </h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/portal/orders/new"
            icon={<FilePlus className="h-5 w-5" />}
            title="Start a new order"
            body="Address, report type, format, speed — about 60 seconds."
            cta="Place order"
            featured
          />
          <ActionCard
            href="/portal/orders"
            icon={<FolderOpen className="h-5 w-5" />}
            title="Your orders"
            body="Status, ETAs, download links, re-issue requests."
            cta="View orders"
          />
          <ActionCard
            href="/services"
            icon={<Sparkles className="h-5 w-5" />}
            title="Browse report types"
            body="Residential, commercial, multifamily, wall, gutter, ESX."
            cta="See report types"
            external
          />
        </div>
      </div>

      {/* Recent orders — empty premium state */}
      <div className="mt-12">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
              Recent activity
            </h2>
            <p className="mt-1.5 text-[15px] text-[color:var(--color-charcoal)]">
              Your latest orders and report deliveries appear here.
            </p>
          </div>
          <Link
            href="/portal/orders"
            className="text-sm font-medium text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)] inline-flex items-center gap-1"
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <EmptyCard
          icon={<FolderOpen className="h-6 w-6" />}
          title="No orders yet"
          description="Place your first order and we'll have it ready in 24 hours — or rush it in 6."
          action={
            <>
              <ButtonLink href="/portal/orders/new" size="md">
                <FilePlus className="h-4 w-4" />
                Start your first order
              </ButtonLink>
              <Link
                href="/services"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-[color:var(--color-navy-900)] hover:text-[color:var(--color-copper-600)] transition"
              >
                Or browse report types →
              </Link>
            </>
          }
        />
      </div>

      {/* Pro tips strip */}
      <div className="mt-12 rounded-2xl bg-[color:var(--color-navy-900)] text-white p-8 md:p-10 relative overflow-hidden">
        <div aria-hidden className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-[color:var(--color-copper-500)]/15" />
        <div aria-hidden className="absolute right-4 top-4 h-40 w-40 rounded-full border border-[color:var(--color-copper-500)]/10" />

        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 text-[color:var(--color-copper-300)] border border-white/15 px-3 py-1 text-xs font-semibold">
              <Zap className="h-3 w-3 fill-current" />
              Pro tip
            </span>
            <h3 className="mt-4 text-2xl md:text-3xl font-display text-white">
              Bundle PDF + ESX and save on every order.
            </h3>
            <p className="mt-3 text-white/70 max-w-xl">
              Ordering both formats together is cheaper than ordering each separately —
              and it&apos;s what most adjusters expect anyway.
            </p>
          </div>
          <ButtonLink href="/portal/orders/new" size="lg" variant="secondary" className="flex-shrink-0">
            Try it
            <ArrowRight className="h-4 w-4" />
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="group neu-card p-6 transition-transform hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)]">
          {label}
        </span>
        <span className="h-8 w-8 rounded-lg neu-inset text-[color:var(--color-copper-700)] flex items-center justify-center">
          {icon}
        </span>
      </div>
      <div className="mt-4 font-numeric font-bold text-4xl text-[color:var(--color-navy-900)] tracking-tight">
        {value}
      </div>
      <div className="mt-1 text-xs text-[color:var(--color-stone)]">{hint}</div>
    </div>
  );
}

function ActionCard({
  href,
  icon,
  title,
  body,
  cta,
  featured = false,
  external = false,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  body: string;
  cta: string;
  featured?: boolean;
  external?: boolean;
}) {
  const Arrow = external ? ArrowUpRight : ArrowRight;
  return (
    <Link
      href={href}
      className={
        featured
          ? "group relative rounded-2xl bg-gradient-to-br from-[color:var(--color-navy-900)] to-[color:var(--color-navy-800)] text-white p-6 overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_40px_-12px_rgba(11,30,58,0.35)]"
          : "group relative rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-6 overflow-hidden transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-copper-300)] hover:shadow-[0_12px_30px_-12px_rgba(11,30,58,0.12)]"
      }
    >
      {featured && (
        <div aria-hidden className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-[color:var(--color-copper-500)]/15 blur-2xl" />
      )}
      <div className="relative">
        <span
          className={
            featured
              ? "inline-flex h-10 w-10 rounded-xl bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] items-center justify-center"
              : "inline-flex h-10 w-10 rounded-xl bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] items-center justify-center"
          }
        >
          {icon}
        </span>
        <h3 className={featured ? "mt-4 font-display text-xl text-white" : "mt-4 font-display text-xl text-[color:var(--color-navy-900)]"}>
          {title}
        </h3>
        <p className={featured ? "mt-1.5 text-[14px] text-white/75 leading-relaxed" : "mt-1.5 text-[14px] text-[color:var(--color-stone)] leading-relaxed"}>
          {body}
        </p>
        <span className={
          featured
            ? "mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-copper-300)] group-hover:text-[color:var(--color-copper-200)] transition-colors"
            : "mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-copper-600)] group-hover:text-[color:var(--color-copper-700)] transition-colors"
        }>
          {cta}
          <Arrow className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
