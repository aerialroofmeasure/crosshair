import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { ServiceArt } from "@/components/marketing/service-art";
import { ServicePrices } from "@/components/marketing/service-prices";
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
              <div
                key={s.slug}
                className="group relative rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-[color:var(--color-copper-400)] hover:shadow-[0_28px_60px_-18px_rgba(11,30,58,0.28),0_8px_22px_-8px_rgba(201,137,47,0.18)] overflow-hidden"
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
                  <Link href={`/services/${s.slug}`} className="block">
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
                  </Link>

                  <div className="mt-6 pt-5 border-t border-[color:var(--color-border-soft)]">
                    <ServicePrices
                      prices={s.prices}
                      slug={s.slug}
                      savings={Math.round(((s.compareAt - s.startsAt) / s.compareAt) * 100)}
                    />
                  </div>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)] transition-colors"
                  >
                    Explore report
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
