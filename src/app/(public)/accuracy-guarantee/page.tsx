import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/marketing/eyebrow";

export const metadata = {
  title: "Accuracy guarantee",
  description: "Our 98%+ accuracy promise and how we make it right when we miss.",
};

export default function AccuracyGuaranteePage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">Accuracy guarantee</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            98%+ or we redo it free.
          </h1>
        </div>
      </section>

      <section className="section-y">
        <div className="container-narrow space-y-8 text-[17px] leading-relaxed">
          <p>
            Every report we ship is measured to within 2% of true field measurements. If
            a measurement comes back wrong and you can verify it on-site, with a drone, or
            via a licensed surveyor, we&apos;ll re-measure the affected sections at no charge
            and reissue the report within 24 hours.
          </p>
          <h2 className="text-3xl font-display pt-4">How verification works</h2>
          <ul className="space-y-3 list-disc pl-6">
            <li>Send back the report with the disputed measurements highlighted.</li>
            <li>Attach the source of your verification (photo, drone scan, surveyor sheet).</li>
            <li>We re-measure those sections, reissue the report, and credit any rush fee paid.</li>
          </ul>
          <h2 className="text-3xl font-display pt-4">What&apos;s not covered</h2>
          <ul className="space-y-3 list-disc pl-6">
            <li>Imagery limitations beyond our control — if no recent high-resolution imagery exists, we&apos;ll tell you before charging.</li>
            <li>Structures that have changed since the most recent available imagery.</li>
            <li>Subjective preference (e.g. wanting a different roof slope notation).</li>
          </ul>
        </div>

        <div className="container-narrow mt-14">
          <ButtonLink href="/order" size="lg">Start an order</ButtonLink>
        </div>
      </section>
    </>
  );
}
