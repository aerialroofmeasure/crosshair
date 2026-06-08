import { Eyebrow } from "@/components/marketing/eyebrow";

export const metadata = { title: "Terms of service" };

export default function TermsPage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-14 md:pt-16 md:pb-16 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">Legal</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">Terms of service</h1>
        </div>
      </section>
      <section className="section-y">
        <div className="container-narrow space-y-6 text-[16px] leading-relaxed">
          <p className="text-[color:var(--color-stone)]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
          <p>
            By placing an order with Aerial Roof Measure you agree to these terms.
            We&apos;ll deliver measurement reports based on the property and report type
            you select. Pricing and delivery timelines are confirmed before payment.
          </p>
          <h2 className="text-2xl font-display pt-4">Refunds and re-issues</h2>
          <p>
            If a report falls below our 98% accuracy standard, we&apos;ll re-issue at no
            charge or refund the order at our discretion. See the
            <a href="/accuracy-guarantee" className="text-[color:var(--color-copper-700)] underline ml-1">
              accuracy guarantee
            </a>{" "}
            page for details.
          </p>
          <h2 className="text-2xl font-display pt-4">Use of reports</h2>
          <p>
            Reports may be used for the purchaser&apos;s estimating, claim and project
            workflows. Redistribution of report files as a standalone product is not
            permitted.
          </p>
        </div>
      </section>
    </>
  );
}
