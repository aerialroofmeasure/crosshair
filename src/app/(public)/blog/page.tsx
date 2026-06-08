import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Eyebrow } from "@/components/marketing/eyebrow";
import { ButtonLink } from "@/components/ui/button";

export const metadata = {
  title: "Blog",
  description: "Notes on roof measurement, insurance claims and contractor estimating.",
};

// Empty state for now — posts ship in Phase 7
const posts: { slug: string; title: string; excerpt: string; date: string; readTime: string }[] = [];

export default function BlogPage() {
  return (
    <>
      <section className="bg-hero text-white pt-12 pb-24 md:pt-16 md:pb-32 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">Blog</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            Field notes for contractors and adjusters.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl">
            Short, useful posts on roof measurement, insurance workflows and
            estimating speed — written for people who order this stuff weekly.
          </p>
        </div>
      </section>

      {/* Pull empty-state / posts grid up into the hero so the full card
          (including the CTA button) sits within the visible viewport. */}
      <section className="-mt-16 md:-mt-20 pb-16 md:pb-20 relative z-10">
        <div className="container-page">
          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--color-border-soft)] bg-white p-10 md:p-12 text-center shadow-[0_10px_30px_-12px_rgba(11,30,58,0.18)]">
              <Eyebrow>Coming soon</Eyebrow>
              <h2 className="mt-3 text-3xl font-display">First posts shipping shortly.</h2>
              <p className="mt-4 text-[color:var(--color-stone)] max-w-md mx-auto">
                We&apos;re putting together a small library of pieces on Xactimate workflows,
                claim-side accuracy expectations, and how to spot when an aerial report is
                cutting corners. Want to be notified?
              </p>
              <ButtonLink href="/contact" size="md" className="mt-6">
                Get an email when posts go live
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/blog/${p.slug}`}
                  className="group rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-7 hover:border-[color:var(--color-copper-300)] transition-all"
                >
                  <div className="flex items-center gap-3 text-xs text-[color:var(--color-stone)]">
                    <time>{p.date}</time>
                    <span>·</span>
                    <span>{p.readTime}</span>
                  </div>
                  <h3 className="mt-4 text-xl font-display group-hover:text-[color:var(--color-copper-700)] transition-colors">
                    {p.title}
                  </h3>
                  <p className="mt-3 text-[15px] text-[color:var(--color-stone)] leading-relaxed">
                    {p.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
