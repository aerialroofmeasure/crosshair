import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { siteConfig, services } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-[color:var(--color-navy-900)] text-white">
      <div className="container-page py-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2 max-w-sm">
            <Logo tone="white" variant="lockup" className="h-12 md:h-14 w-auto" />
            <p className="mt-6 text-sm text-white/70 leading-relaxed">
              Professional roof, wall, gutter and insurance-grade measurement reports.
              Built for contractors and adjusters who can&apos;t afford to guess.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-300)]">
              Reports
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-white transition">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-300)]">
              Company
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li><Link href="/how-it-works" className="hover:text-white transition">How it works</Link></li>
              <li><Link href="/about" className="hover:text-white transition">About</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ</Link></li>
              <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-300)]">
              Get in touch
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <a href={`mailto:${siteConfig.email.orders}`} className="hover:text-white transition">
                  {siteConfig.email.orders}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email.support}`} className="hover:text-white transition">
                  {siteConfig.email.support}
                </a>
              </li>
              <li className="pt-2 text-white/55">
                Responses within 4 business hours · Mon–Fri, 9am–6pm ET
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between text-xs text-white/55">
          <p>© {new Date().getFullYear()} Aerial Roof Measure. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition">Terms</Link>
            <Link href="/accuracy-guarantee" className="hover:text-white transition">Accuracy guarantee</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
