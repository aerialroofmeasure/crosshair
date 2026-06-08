import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { TatBadge } from "@/components/marketing/tat-badge";
import { Stat } from "@/components/marketing/stat";
import { ShieldCheck, Clock, FileCheck2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1fr_1.05fr]">
      {/* =========================================
          LEFT — Form column
          ========================================= */}
      <div className="flex flex-col bg-[color:var(--color-warm-white)]">
        <header className="px-6 md:px-12 py-6 animate-fade-in">
          <Link href="/" aria-label="Aerial Roof Measure home" className="inline-block hover:opacity-90 transition-opacity">
            <Logo variant="lockup" className="h-14 md:h-16 w-auto" />
          </Link>
        </header>

        <main className="flex-1 flex items-center justify-center px-6 md:px-12 py-12">
          <div className="w-full max-w-md animate-fade-up">{children}</div>
        </main>

        <footer className="px-6 md:px-12 py-6 flex items-center justify-between text-xs text-[color:var(--color-stone)]">
          <span>© {new Date().getFullYear()} Aerial Roof Measure</span>
          <div className="hidden sm:flex items-center gap-5">
            <Link href="/privacy" className="hover:text-[color:var(--color-navy-900)] transition">Privacy</Link>
            <Link href="/terms" className="hover:text-[color:var(--color-navy-900)] transition">Terms</Link>
            <Link href="/contact" className="hover:text-[color:var(--color-navy-900)] transition">Contact</Link>
          </div>
        </footer>
      </div>

      {/* =========================================
          RIGHT — Brand panel (mini hero)
          ========================================= */}
      <aside className="hidden lg:flex bg-hero text-white relative overflow-hidden">
        {/* Decorative concentric reticle rings — match the home hero */}
        <div aria-hidden className="absolute -right-48 top-1/2 -translate-y-1/2 h-[720px] w-[720px] rounded-full border border-white/[0.07] animate-reticle-spin" style={{ animationDirection: "reverse" }} />
        <div aria-hidden className="absolute -right-24 top-1/2 -translate-y-1/2 h-[520px] w-[520px] rounded-full border border-[color:var(--color-copper-500)]/[0.13]" />
        <div aria-hidden className="absolute -right-8 top-1/2 -translate-y-1/2 h-[360px] w-[360px] rounded-full border border-white/[0.05] border-dashed" />

        {/* Soft copper glow at top — like the home hero */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-[420px] bg-gradient-radial-copper pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,137,47,0.18), transparent 70%)"
          }}
        />

        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full max-w-2xl mx-auto">
          {/* Top — eyebrow + TAT badge */}
          <div className="flex items-center justify-between gap-4 animate-fade-up">
            <Eyebrow tone="white">Aerial Roof Measure</Eyebrow>
            <TatBadge tone="dark" />
          </div>

          {/* Middle — quote/headline + promises */}
          <div className="my-12">
            <blockquote
              className="font-display text-3xl xl:text-4xl text-white leading-[1.18] tracking-tight animate-fade-up"
              style={{ animationDelay: "0.15s" }}
            >
              <span className="text-[color:var(--color-copper-300)]">“</span>
              The fastest, most accurate way to put real measurements behind an estimate.
              <span className="text-[color:var(--color-copper-300)]">”</span>
            </blockquote>
            <div className="mt-5 text-sm text-white/55 animate-fade-up" style={{ animationDelay: "0.25s" }}>
              Cassie R. — Residential Roofing GM
            </div>

            {/* Three promise rows */}
            <ul className="mt-12 space-y-5">
              <Promise
                delay="0.4s"
                icon={<ShieldCheck className="h-4 w-4" />}
                title="98%+ accuracy guarantee"
                body="If a report misses the bar, we re-measure free."
              />
              <Promise
                delay="0.5s"
                icon={<Clock className="h-4 w-4" />}
                title="6-hour rush SLA"
                body="Order by 11am ET, delivered before close of business."
              />
              <Promise
                delay="0.6s"
                icon={<FileCheck2 className="h-4 w-4" />}
                title="Xactimate / ESX ready"
                body="ESX drops straight into your sketch every time."
              />
            </ul>
          </div>

          {/* Bottom — animated stats */}
          <div
            className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10 animate-fade-up"
            style={{ animationDelay: "0.75s" }}
          >
            <Stat value={98.4} decimals={1} suffix="%" label="Avg accuracy" tone="dark" centered compact />
            <Stat value={18} suffix="hrs" label="Avg TAT" tone="dark" centered compact />
            <Stat value={87} suffix="%" label="Repeat clients" tone="dark" centered compact />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Promise({
  icon,
  title,
  body,
  delay,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  delay: string;
}) {
  return (
    <li className="flex gap-4 animate-fade-up" style={{ animationDelay: delay }}>
      <div className="flex-shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-white font-medium text-sm">{title}</div>
        <div className="mt-0.5 text-xs text-white/60">{body}</div>
      </div>
    </li>
  );
}
