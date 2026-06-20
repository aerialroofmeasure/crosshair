import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, Shield, Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { TatBadge } from "@/components/marketing/tat-badge";
import { Stat } from "@/components/marketing/stat";
import { ServiceArt } from "@/components/marketing/service-art";
import { RoofScan } from "@/components/marketing/roof-scan";
import { Reveal } from "@/components/marketing/reveal";
import { PriceTag } from "@/components/marketing/price-tag";
import { services, siteConfig } from "@/lib/site-config";

export default function HomePage() {
  return (
    <>
      {/* =========================================
          HERO — 2-column layout (copy + roof scan)
          ========================================= */}
      <section className="relative bg-hero text-white pt-16 pb-12 md:pt-24 md:pb-16 overflow-hidden">
        {/* Decorative reticle circles */}
        <div aria-hidden className="absolute -right-40 top-12 h-[640px] w-[640px] rounded-full border border-white/[0.07] hidden lg:block animate-reticle-spin" style={{ animationDirection: "reverse" }} />
        <div aria-hidden className="absolute -right-16 top-32 h-[420px] w-[420px] rounded-full border border-[color:var(--color-copper-500)]/[0.12] hidden lg:block" />

        <div className="container-page relative z-10">
          <div className="grid lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-8 items-center">
            {/* Left — copy */}
            <div className="animate-fade-up">
              <div className="flex flex-wrap items-center gap-2">
                <TatBadge tone="dark" />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] border border-[color:var(--color-copper-500)]/30 px-3 py-1.5 text-xs font-semibold tracking-tight">
                  <span className="font-numeric font-bold">9+ years</span>
                  <span className="text-white/55">of measurement experience</span>
                </span>
              </div>

              <h1 className="mt-5 font-display text-[40px] sm:text-[50px] md:text-[58px] lg:text-[62px] leading-[1.02] tracking-tight text-white">
                Roof measurements
                <br />
                <span className="text-[color:var(--color-copper-300)]">contractors trust.</span>
              </h1>

              <p className="mt-5 text-base md:text-lg text-white/80 max-w-xl leading-relaxed">
                Aerial roof, wall and gutter reports — PDF, ESX and XML — built for
                accurate estimates and insurance claims. 24-hour standard delivery,
                6-hour rush.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/order" size="lg" variant="secondary">
                  Start an order
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink
                  href="/services"
                  size="lg"
                  className="bg-white/10 text-white hover:bg-white/15 border border-white/15"
                >
                  See report types
                </ButtonLink>
              </div>

              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2.5 text-sm text-white/75 stagger">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--color-copper-300)]" />
                  {siteConfig.accuracy} accuracy guarantee
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--color-copper-300)]" />
                  Xactimate / ESX ready
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[color:var(--color-copper-300)]" />
                  No subscriptions · pay per report
                </div>
              </div>
            </div>

            {/* Right — animated roof scan (slightly smaller to compress hero) */}
            <div className="relative flex justify-center lg:justify-end animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <RoofScan className="max-w-[440px] lg:max-w-[480px]" />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          TRUST STRIP — animated stats (compact so it peeks above the fold)
          ========================================= */}
      <section className="border-y border-[color:var(--color-border-soft)] bg-[color:var(--color-warm-cream)]/40">
        <div className="container-page py-10 md:py-12">
          <Reveal>
            <div className="neu-card p-4 md:p-5">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Stat value={1240} suffix="+" label="Reports delivered" centered inset />
                <Stat value={98.4} decimals={1} suffix="%" label="Average accuracy" centered inset />
                <Stat value={18} suffix="hrs" label="Average turnaround" centered inset />
                <Stat value={87} suffix="%" label="Repeat clients" centered inset />
              </div>
            </div>
            <div className="mt-10 pt-8 border-t border-[color:var(--color-border-soft)] text-center max-w-2xl mx-auto">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
                Built by veterans · 9+ years measuring roofs
              </p>
              <p className="mt-3 text-[15px] md:text-base text-[color:var(--color-stone)] leading-relaxed">
                The team behind every report has nine-plus years of aerial measurement
                experience — across residential, commercial, multifamily, insurance and
                Xactimate workflows. You get veteran judgement on every order.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================
          SERVICES
          ========================================= */}
      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>Report types</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-5xl font-display">
                Every report you actually order, in one place.
              </h2>
              <p className="mt-5 text-lg text-[color:var(--color-stone)] leading-relaxed">
                From single-family residential to complex commercial — the same accuracy
                standard, the same delivery SLA, every time.
              </p>
            </div>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <Reveal key={s.slug} delay={i * 60}>
                <Link
                  href={`/services/${s.slug}`}
                  className="group relative block h-full neu-card p-7 overflow-hidden transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.025] hover:shadow-[0_28px_60px_-18px_rgba(11,30,58,0.28),0_8px_22px_-8px_rgba(201,137,47,0.18)]"
                >
                  <span aria-hidden className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[color:var(--color-copper-400)]/0 group-hover:bg-[color:var(--color-copper-400)]/15 blur-2xl transition-all duration-700" />
                  <span aria-hidden className="absolute inset-x-7 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-copper-500)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative">
                    <ServiceArt
                      slug={s.slug}
                      name={s.name}
                      className="mb-1 transition-transform duration-500 ease-out group-hover:-translate-y-1"
                    />
                    <h3 className="mt-6 text-xl font-display transition-colors group-hover:text-[color:var(--color-copper-700)]">{s.name}</h3>
                    <p className="mt-2 text-[15px] text-[color:var(--color-stone)] leading-relaxed">
                      {s.blurb}
                    </p>
                    <div className="mt-6 pt-5 border-t border-[color:var(--color-border-soft)]">
                      <PriceTag price={s.startsAt} compareAt={s.compareAt} size="md" />
                    </div>
                    <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-copper-600)] group-hover:text-[color:var(--color-copper-700)] transition-colors">
                      View report
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          HOW IT WORKS
          ========================================= */}
      <section className="section-y bg-[color:var(--color-warm-cream)]/30 border-y border-[color:var(--color-border-soft)]">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>How it works</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-5xl font-display">
                Order in under a minute. Receive within hours.
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 120}>
                <div className="relative h-full neu-card p-7 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-numeric text-sm font-semibold text-[color:var(--color-copper-600)] h-8 w-8 rounded-lg neu-inset flex items-center justify-center">
                      0{i + 1}
                    </span>
                    <span className="h-px flex-1 bg-[color:var(--color-border-soft)]" />
                  </div>
                  <h3 className="mt-5 text-xl font-display">{s.title}</h3>
                  <p className="mt-3 text-[15px] text-[color:var(--color-stone)] leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={400}>
            <div className="mt-14">
              <ButtonLink href="/how-it-works" variant="outline">
                See the full process
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================
          GUARANTEE
          ========================================= */}
      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <div className="rounded-3xl bg-[color:var(--color-navy-900)] text-white p-10 md:p-16 relative overflow-hidden neu-dark-card">
              <div aria-hidden className="absolute -right-20 -top-20 h-80 w-80 rounded-full border border-[color:var(--color-copper-500)]/15" />
              <div aria-hidden className="absolute right-8 top-8 h-40 w-40 rounded-full border border-[color:var(--color-copper-500)]/10" />
              <div className="relative grid md:grid-cols-2 gap-10 md:gap-16 items-center">
                <div>
                  <Eyebrow tone="white">The promises</Eyebrow>
                  <h2 className="mt-5 text-3xl md:text-4xl font-display text-white">
                    Accuracy you can put in your quote. Speed you can build a day around.
                  </h2>
                </div>
                <div className="space-y-7">
                  <Promise
                    icon={<Shield className="h-5 w-5" />}
                    title="98%+ accuracy guarantee"
                    body="If a report falls short of the accuracy standard, we re-measure free."
                  />
                  <Promise
                    icon={<Clock className="h-5 w-5" />}
                    title="6-hour rush SLA"
                    body="Order rush by 11am ET and have your report before close of business. Miss the window? 50% off."
                  />
                  <Promise
                    icon={<FileCheck2 className="h-5 w-5" />}
                    title="Xactimate / ESX ready"
                    body="ESX files drop straight into your sketch. PDF and XML included on every report."
                  />
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* =========================================
          TESTIMONIALS
          ========================================= */}
      <section className="section-y bg-[color:var(--color-warm-cream)]/30 border-t border-[color:var(--color-border-soft)]">
        <div className="container-page">
          <Reveal>
            <div className="max-w-2xl">
              <Eyebrow>What clients say</Eyebrow>
              <h2 className="mt-4 text-4xl md:text-5xl font-display">
                Built for the people who order roofs every day.
              </h2>
            </div>
          </Reveal>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.author} delay={i * 100}>
                <figure className="neu-card p-8 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
                  <blockquote className="text-[17px] text-[color:var(--color-charcoal)] leading-relaxed flex-1">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-6 pt-6 border-t border-[color:var(--color-border-soft)]">
                    <div className="font-medium text-[color:var(--color-navy-900)]">{t.author}</div>
                    <div className="text-sm text-[color:var(--color-stone)]">{t.role}</div>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================
          FINAL CTA
          ========================================= */}
      <section className="section-y">
        <div className="container-page">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto">
              <Eyebrow>Ready when you are</Eyebrow>
              <h2 className="mt-5 text-4xl md:text-6xl font-display">
                Your next report is 60 seconds away.
              </h2>
              <p className="mt-6 text-lg text-[color:var(--color-stone)]">
                No subscription. No setup fee. Order what you need, get it delivered.
              </p>
              <div className="mt-10 flex flex-wrap justify-center gap-3">
                <ButtonLink href="/order" size="lg">
                  Start an order
                  <ArrowRight className="h-4 w-4" />
                </ButtonLink>
                <ButtonLink href="/contact" size="lg" variant="ghost">
                  Talk to us first
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Promise({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="flex gap-5">
      <div className="flex-shrink-0 mt-1 h-11 w-11 rounded-xl bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <h4 className="text-lg font-medium text-white">{title}</h4>
        <p className="mt-1.5 text-[15px] text-white/75 leading-relaxed">{body}</p>
      </div>
    </div>
  );
}

const steps = [
  {
    title: "Tell us the property",
    body: "Enter the address or paste a Google Maps link. Choose the report type — residential, commercial, wall, gutter or insurance.",
  },
  {
    title: "Pick format & speed",
    body: "PDF, ESX, XML or a bundle. Standard delivery within 24 hours, rush in 6, or express in 2 — your choice.",
  },
  {
    title: "Receive & estimate",
    body: "Files arrive in your inbox and in the portal. Plug them straight into Xactimate or your estimate workflow.",
  },
];

const testimonials = [
  {
    quote:
      "The ESX files drop right into our Xactimate workflow. Adjusters stopped questioning our measurements within a month.",
    author: "Aaron M.",
    role: "Restoration Operations Lead",
  },
  {
    quote:
      "Rush turnaround is the real deal. I've sent in orders at 9am and quoted the homeowner the same afternoon.",
    author: "Cassie R.",
    role: "Residential Roofing GM",
  },
  {
    quote:
      "The reports are clean, the wall measurements are accurate, and they answer the phone. That's most of the battle.",
    author: "Devin J.",
    role: "Siding Contractor",
  },
];
