import { ArrowRight, ShieldCheck, Gauge, Eye } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { Reveal } from "@/components/marketing/reveal";

export const metadata = {
  title: "About",
  description: "Aerial Roof Measure is a focused measurement service built by people who've actually quoted roofs.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">About</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            Built by people who&apos;ve actually quoted roofs.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl">
            Aerial Roof Measure is a focused, no-fluff measurement service for the
            contractors and adjusters who treat accuracy and turnaround as table stakes.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-narrow">
          <Reveal>
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-[color:var(--color-charcoal)] leading-relaxed">
                We started because most aerial measurement services are either expensive
                and slow, or cheap and inconsistent. Neither works when you have a customer
                standing in their front yard waiting for a quote.
              </p>

              <p className="mt-6 text-[17px] text-[color:var(--color-charcoal)] leading-relaxed">
                Our team has been on the contractor and adjuster side. We&apos;ve sent reports
                back for errors. We&apos;ve waited 48 hours for a measurement on a job that
                needed to be quoted that afternoon. We&apos;ve paid premium prices for reports
                that didn&apos;t include the wall measurements we actually needed.
              </p>

              <p className="mt-6 text-[17px] text-[color:var(--color-charcoal)] leading-relaxed">
                Aerial Roof Measure exists to ship reports that don&apos;t waste your time. Every
                report goes through the same QA pass. Every turnaround commitment has a
                real SLA behind it. If we miss, we make it right.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-[color:var(--color-warm-cream)]/30 border-y border-[color:var(--color-border-soft)]">
        <div className="container-page max-w-5xl">
          <Reveal>
            <Eyebrow>What we stand for</Eyebrow>
            <h2 className="mt-4 text-4xl md:text-5xl font-display">Three things, non-negotiable.</h2>
          </Reveal>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: <ShieldCheck className="h-5 w-5" />, title: "Accuracy you can quote against", body: "98%+ on every report. If we miss the bar, we re-measure free." },
              { icon: <Gauge className="h-5 w-5" />, title: "Turnaround that matches your day", body: "Rush in 6 hours. Express in 2. Standard in 24. You know exactly when files land." },
              { icon: <Eye className="h-5 w-5" />, title: "Transparency, not theatre", body: "No hidden fees, no membership tier, no buy-one-get-one promos. You see the price, you get the report." },
            ].map((p, i) => (
              <Reveal key={p.title} delay={i * 120}>
                <Pillar icon={p.icon} title={p.title} body={p.body} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page text-center max-w-2xl mx-auto">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-display">Want to see a sample first?</h2>
            <p className="mt-5 text-lg text-[color:var(--color-stone)]">
              Reach out and we&apos;ll send a real, recent example of the report type you&apos;re
              considering — no obligation.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact" size="lg">
                Request a sample
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/order" size="lg" variant="ghost">
                Or jump straight to ordering
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div>
      <div className="h-11 w-11 rounded-xl bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-700)] flex items-center justify-center">
        {icon}
      </div>
      <h3 className="mt-5 text-xl font-display">{title}</h3>
      <p className="mt-3 text-[color:var(--color-stone)] leading-relaxed">{body}</p>
    </div>
  );
}
