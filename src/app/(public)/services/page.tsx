import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { ServiceArt } from "@/components/marketing/service-art";
import { PriceTag } from "@/components/marketing/price-tag";
import { services } from "@/lib/site-config";

export const metadata = {
  title: "Services",
  description: "Aerial measurement reports: residential, commercial, multifamily, wall and gutter — built for contractors and adjusters.",
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-16 md:pt-16 md:pb-20 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">Reports we deliver</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            Every measurement report,<br />on one delivery standard.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl">
            Whatever the structure or format, every report ships with the same accuracy
            guarantee and turnaround promise.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-page">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group relative rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-8 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.025] hover:border-[color:var(--color-copper-400)] hover:shadow-[0_28px_60px_-18px_rgba(11,30,58,0.28),0_8px_22px_-8px_rgba(201,137,47,0.18)] hover:bg-gradient-to-b hover:from-white hover:to-[color:var(--color-copper-50)]/40 overflow-hidden"
              >
                {/* Copper glow that pulses out from top-right on hover */}
                <span
                  aria-hidden
                  className="absolute -top-16 -right-16 h-44 w-44 rounded-full bg-[color:var(--color-copper-400)]/0 group-hover:bg-[color:var(--color-copper-400)]/15 blur-2xl transition-all duration-700"
                />
                {/* Copper top edge accent revealed on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-copper-500)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />

                <div className="relative">
                  <ServiceArt
                    slug={s.slug}
                    name={s.name}
                    className="transition-transform duration-500 ease-out group-hover:-translate-y-1"
                  />
                  <h2 className="mt-6 text-2xl font-display transition-colors group-hover:text-[color:var(--color-copper-700)]">
                    {s.name}
                  </h2>
                  <p className="mt-2 text-[15px] text-[color:var(--color-stone)] leading-relaxed">
                    {s.blurb}
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {s.deliverables.map((d) => (
                      <li
                        key={d}
                        className="text-xs font-medium px-2.5 py-1 rounded-full bg-[color:var(--color-warm-cream)] text-[color:var(--color-charcoal)] transition-colors group-hover:bg-white group-hover:border group-hover:border-[color:var(--color-copper-300)]"
                      >
                        {d}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-7 pt-6 border-t border-[color:var(--color-border-soft)]">
                    <PriceTag price={s.startsAt} compareAt={s.compareAt} size="md" />
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-copper-600)] group-hover:text-[color:var(--color-copper-700)] transition-colors">
                    Explore report
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
