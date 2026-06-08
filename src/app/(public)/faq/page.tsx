"use client";

import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How accurate are the reports?",
    a: "Every report is guaranteed to 98% accuracy or better. If a measurement is off and you can verify it (on-site, drone or surveyor), we re-measure for free and refund the difference if a refund is appropriate.",
  },
  {
    q: "What's the standard turnaround?",
    a: "Standard delivery is within 24 hours of order confirmation. Rush is 6 hours (orders placed before 11am ET ship same business day). Express is 2 hours, subject to availability — usually available Mon–Fri, 9a–4p ET.",
  },
  {
    q: "Do you support Xactimate (ESX)?",
    a: "Yes. ESX files are first-class outputs and are formatted to import directly into Xactimate Sketch with pitch, area, perimeter and slope values matched to Xactimate convention. We also support XML for other estimating tools.",
  },
  {
    q: "What if I need a report for a property that isn't well covered by satellite imagery?",
    a: "We use multiple imagery providers and pull the most recent high-resolution capture available. If imagery quality is too poor for an accurate report, we'll let you know within 2 hours of ordering and refund in full — you'll never get an inaccurate report because of bad imagery.",
  },
  {
    q: "Do I need an account to order?",
    a: "No. Guest checkout is supported — you'll just need to provide an email so we can send the report. If you create an account, you also get an order history, the ability to re-download past reports, and saved properties for fast re-ordering.",
  },
  {
    q: "How do I pay?",
    a: "While we're operating in early-access mode we use Wise invoicing — you'll receive an invoice with secure payment details (ACH for US customers, or pay by card). Self-serve checkout via Stripe is coming in the next few weeks.",
  },
  {
    q: "Can I get a sample report before ordering?",
    a: "Yes — reach out via the contact form and tell us which report type you'd like a sample of. We'll send a real, recent example with the customer details redacted.",
  },
  {
    q: "Do you measure commercial buildings, multifamily complexes, churches and warehouses?",
    a: "Yes — commercial, multifamily, churches, warehouses and other large or complex structures are all in scope. Pricing scales with complexity but we'll always confirm before charging anything beyond the base.",
  },
  {
    q: "Can I add wall measurements to a roof order?",
    a: "Absolutely. Add a wall or siding report at checkout and we'll deliver both reports as a bundle. Saves a few dollars vs ordering separately.",
  },
  {
    q: "What if I need a revision?",
    a: "If you spot an error or need a section re-measured, send the report back with notes and we'll re-issue within 24 hours at no charge. Revisions are unlimited for the first 30 days after delivery.",
  },
  {
    q: "Do you work with insurance adjusters specifically?",
    a: "Yes — adjusters and restoration teams make up a large share of our orders. The ESX-ready insurance report type is purpose-built for storm claim workflows and integrates with the documentation adjusters typically attach to claim files.",
  },
  {
    q: "What does the 6-hour rush guarantee actually mean?",
    a: "If you order a rush report before 11am ET on a business day and we don't deliver within 6 hours of the confirmation timestamp, the rush fee is refunded and the report is 50% off. The clock starts when we confirm imagery availability, not when you click order.",
  },
];

export default function FAQPage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">FAQ</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            Questions we hear a lot.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl">
            Don&apos;t see your question? Reach out — we usually reply within a few hours.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-narrow">
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-[color:var(--color-warm-cream)] border border-[color:var(--color-border-soft)] p-8 text-center">
            <h3 className="text-2xl font-display">Still have a question?</h3>
            <p className="mt-2 text-[color:var(--color-stone)]">
              Email us directly or use the contact form.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/contact" size="md">
                Contact us
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
              <Link
                href="mailto:support@aerialroofmeasure.com"
                className="inline-flex items-center px-5 py-2.5 text-sm font-medium text-[color:var(--color-navy-900)] hover:text-[color:var(--color-copper-600)]"
              >
                support@aerialroofmeasure.com
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-xl border border-[color:var(--color-border-soft)] bg-white overflow-hidden">
      <button
        className="w-full text-left px-6 py-5 flex items-start gap-4 hover:bg-[color:var(--color-warm-cream)]/30 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Plus
          className={cn(
            "h-5 w-5 flex-shrink-0 mt-1 text-[color:var(--color-copper-500)] transition-transform duration-300",
            open && "rotate-45"
          )}
        />
        <span className="text-[17px] font-medium text-[color:var(--color-navy-900)] flex-1">
          {q}
        </span>
      </button>
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-6 pl-15 text-[color:var(--color-charcoal)] leading-relaxed">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}
