import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { TatBadge } from "@/components/marketing/tat-badge";
import { ServiceIcon } from "@/components/marketing/service-icon";
import { PriceTag } from "@/components/marketing/price-tag";
import { services } from "@/lib/site-config";

const detailCopy: Record<string, { intro: string; includes: string[]; ideal: string[]; usedBy: string[] }> = {
  residential: {
    intro:
      "Single-family roof measurement reports — every plane, edge, ridge, valley and penetration captured from rectified aerial imagery.",
    includes: [
      "Total roof area in squares",
      "Pitch by section (degrees and rise/run)",
      "Eave, ridge, hip, valley, rake and step-flashing lengths",
      "Penetration counts and locations",
      "Property diagram with measurements labeled",
      "Photo overlay on roof plan",
    ],
    ideal: [
      "Storm restoration estimates",
      "Re-roof quotes",
      "Insurance claim support",
      "Pre-purchase inspections",
    ],
    usedBy: ["Residential roofing contractors", "Restoration teams", "Insurance adjusters"],
  },
  commercial: {
    intro:
      "Low-slope, TPO, EPDM, modified bitumen, metal — commercial roof reports built for plan reviews and bid packages.",
    includes: [
      "Roof area broken out by membrane / system",
      "Parapet, curb and equipment counts",
      "Perimeter and field square footage split",
      "Drain, scupper and downspout counts",
      "Penetration plan with labeled measurements",
      "PDF + CAD-ready exports",
    ],
    ideal: [
      "Re-roof bids on commercial buildings",
      "Maintenance and warranty inspections",
      "TPO / EPDM replacements",
      "Bid packages with sub trades",
    ],
    usedBy: ["Commercial roofing GCs", "Facility managers", "Architects and PMs"],
  },
  multifamily: {
    intro:
      "Multi-building campuses, apartments and condo complexes — one report per building, or rolled-up totals across a site.",
    includes: [
      "Per-building measurements with separate sheets",
      "Site totals across all structures",
      "Plane-by-plane area and pitch",
      "Shared roof system identification",
      "Optional per-unit breakouts",
    ],
    ideal: [
      "HOA roof replacement programs",
      "Apartment portfolio re-roofs",
      "Property management capex planning",
    ],
    usedBy: ["Multifamily contractors", "Property managers", "Restoration firms"],
  },
  "wall-siding": {
    intro:
      "Elevation-by-elevation wall reports for siding, painting, stucco, brick and EIFS bids. Window and door openings deducted.",
    includes: [
      "Net wall area per elevation (openings deducted)",
      "Gross wall area for paint quoting",
      "Linear footage of trim, corners, fascia",
      "Window and door schedule with counts",
      "Per-elevation photos with measurements overlaid",
    ],
    ideal: [
      "Siding replacement bids",
      "Exterior paint quotes",
      "Stucco and EIFS estimates",
      "Insurance hail and wind claims",
    ],
    usedBy: ["Siding contractors", "Painting contractors", "Restoration teams"],
  },
  gutter: {
    intro:
      "Linear footage of gutters by elevation with downspout count and locations — built for clean, defensible gutter quotes.",
    includes: [
      "Linear footage of gutters per elevation",
      "Downspout count and locations",
      "Gutter style notes if visible (K-style, half-round, box)",
      "Fascia run total for fascia replacement quotes",
    ],
    ideal: [
      "Gutter replacement bids",
      "Gutter guard installations",
      "Storm claim gutter sections",
    ],
    usedBy: ["Gutter installers", "Roofing contractors bundling gutters", "Restoration teams"],
  },
  "insurance-esx": {
    intro:
      "Xactimate-ready ESX files for adjusters, restoration teams and insurance-side estimators. Drops straight into your sketch.",
    includes: [
      "ESX file ready to import into Xactimate Sketch",
      "PDF supporting documentation",
      "Photo overlays for claim file",
      "Pitch, area and perimeter values matched to Xactimate convention",
      "Optional XML export for other estimating platforms",
    ],
    ideal: [
      "Storm hail and wind claims",
      "Adjuster-side measurement verification",
      "Restoration estimating",
      "Carrier audits",
    ],
    usedBy: ["Independent adjusters", "Carrier-side estimators", "Restoration estimators"],
  },
};

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.blurb,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const copy = detailCopy[service.slug];
  const otherServices = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <TatBadge tone="dark" />
          <h1 className="mt-5 text-4xl md:text-5xl font-display text-white">
            {service.name}
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl leading-relaxed">
            {copy.intro}
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <ButtonLink href="/order" size="lg" variant="secondary">
              Order this report
              <ArrowRight className="h-4 w-4" />
            </ButtonLink>
            <PriceTag
              price={service.startsAt}
              compareAt={service.compareAt}
              size="md"
              tone="dark"
            />
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="section-y">
        <div className="container-page grid lg:grid-cols-3 gap-12">
          {/* Left — What's included */}
          <div className="lg:col-span-2 space-y-12">
            <div>
              <Eyebrow>What&apos;s included</Eyebrow>
              <h2 className="mt-4 text-3xl md:text-4xl font-display">In every {service.name.toLowerCase()} report</h2>
              <ul className="mt-8 space-y-4">
                {copy.includes.map((item) => (
                  <li key={item} className="flex gap-3 items-start text-[16px]">
                    <Check className="h-5 w-5 mt-0.5 text-[color:var(--color-copper-500)] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <Eyebrow>Ideal for</Eyebrow>
              <h2 className="mt-4 text-3xl md:text-4xl font-display">Where this report wins</h2>
              <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-3">
                {copy.ideal.map((item) => (
                  <li key={item} className="flex gap-3 items-start">
                    <Check className="h-5 w-5 mt-0.5 text-[color:var(--color-copper-500)] flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right — Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-28 self-start">
            <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-7">
              <ServiceIcon name={service.icon} />
              <h3 className="mt-5 text-lg font-display">Available formats</h3>
              <ul className="mt-3 space-y-2 text-sm">
                {service.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-[color:var(--color-copper-500)]" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-[color:var(--color-navy-900)] text-white p-7">
              <h3 className="text-lg font-display text-white">Used by</h3>
              <ul className="mt-3 space-y-2 text-sm text-white/75">
                {copy.usedBy.map((u) => (
                  <li key={u}>· {u}</li>
                ))}
              </ul>
              <ButtonLink href="/order" size="md" variant="secondary" className="mt-6 w-full justify-center">
                Order now
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </aside>
        </div>
      </section>

      {/* Other reports */}
      <section className="section-y border-t border-[color:var(--color-border-soft)] bg-[color:var(--color-warm-cream)]/30">
        <div className="container-page">
          <Eyebrow>Other reports</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-4xl font-display">You might also need</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {otherServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-7 hover:border-[color:var(--color-copper-300)] transition-all"
              >
                <ServiceIcon name={s.icon} />
                <h3 className="mt-5 text-xl font-display">{s.name}</h3>
                <p className="mt-2 text-[15px] text-[color:var(--color-stone)]">{s.blurb}</p>
                <div className="mt-5 inline-flex items-center gap-2 text-sm text-[color:var(--color-copper-600)] font-medium">
                  Learn more <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
