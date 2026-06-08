import { ArrowRight, MapPin, FileText, Send, Mailbox } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { Reveal } from "@/components/marketing/reveal";

export const metadata = {
  title: "How it works",
  description: "How an Aerial Roof Measure order moves from address to delivered report in hours, not days.",
};

const steps = [
  {
    icon: MapPin,
    title: "Tell us the property",
    body: "Enter the street address, or paste a Google Maps link if you've already pulled it up. Pick the report type — residential, commercial, multifamily, wall, gutter or insurance / ESX.",
    detail: "We confirm the exact rooftop within minutes so there's no ambiguity over which structure to measure.",
  },
  {
    icon: FileText,
    title: "Pick the format",
    body: "PDF for review, ESX for Xactimate, XML for other estimating tools, or a bundle of all three. Add notes if there's something specific the report needs to capture.",
    detail: "You can change formats anytime before delivery — we only finalise after measurement is complete.",
  },
  {
    icon: Send,
    title: "Choose your turnaround",
    body: "Standard 24 hours, rush 6 hours, or express 2 hours. Rush and express are subject to a small premium — you'll see the exact total before you confirm.",
    detail: "Rush orders placed before 11am ET ship same business day. Miss the window? 50% off, our policy.",
  },
  {
    icon: Mailbox,
    title: "Receive and estimate",
    body: "Files arrive in your inbox and in your portal. ESX drops straight into Xactimate Sketch. PDF is ready to share with the customer or insurance.",
    detail: "Every report is logged in your account history with notes, download links and re-issue support for one year.",
  },
];

export default function HowItWorksPage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">How it works</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            Four steps,<br />about sixty seconds.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl">
            The whole order flow is designed around contractors who don&apos;t have ten free
            minutes between site visits. Less typing, more shipping.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page max-w-4xl">
          <ol className="space-y-16">
            {steps.map((s, i) => (
              <Reveal key={s.title} delay={i * 80}>
                <li className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-start">
                  <div className="flex md:flex-col items-center md:items-start gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center">
                      <s.icon className="h-6 w-6" strokeWidth={1.75} />
                    </div>
                    <span className="font-numeric text-lg font-semibold text-[color:var(--color-copper-600)]">
                      Step 0{i + 1}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-display">{s.title}</h2>
                    <p className="mt-4 text-lg text-[color:var(--color-charcoal)] leading-relaxed">
                      {s.body}
                    </p>
                    <p className="mt-3 text-sm text-[color:var(--color-stone)] italic">
                      {s.detail}
                    </p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal>
            <div className="mt-20 rounded-2xl bg-[color:var(--color-warm-cream)] border border-[color:var(--color-border-soft)] p-10 text-center">
              <h3 className="text-3xl font-display">Ready to order?</h3>
              <p className="mt-3 text-[color:var(--color-stone)]">
                Have an address and a report type in mind? You&apos;re 60 seconds away.
              </p>
              <ButtonLink href="/order" size="lg" className="mt-7">
                Start an order
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
