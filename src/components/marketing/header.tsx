"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { ButtonLink } from "@/components/ui/button";
import { mainNav } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active route — top-level pathname match. /services or /services/anything → /services
  const topLevel = "/" + (pathname?.split("/")[1] ?? "");
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : topLevel === href;

  return (
    <header
      className={cn(
        // Same properties in both states — only the VALUES change, so everything
        // interpolates smoothly. Top: solid, full-width, flush. Scrolled: inset glass bar.
        "sticky top-0 z-50 transition-[padding,background-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
        scrolled
          ? "px-3 sm:px-5 pt-3 bg-transparent"
          : "px-0 pt-0 bg-[color:var(--color-warm-white)]"
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between gap-6 relative overflow-hidden border backdrop-blur-xl",
          "transition-[max-width,height,padding,border-radius,border-color,background-color,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
          scrolled
            ? "max-w-[78rem] h-16 md:h-[68px] px-5 md:px-7 rounded-2xl border-white/55 bg-[color:var(--color-warm-white)]/55 shadow-[0_14px_40px_-14px_rgba(11,30,58,0.28)]"
            : "max-w-[80rem] h-20 md:h-24 px-6 rounded-none border-transparent bg-[color:var(--color-warm-white)]/0 shadow-[0_0_0_0_rgba(11,30,58,0)]"
        )}
      >
        {/* Copper sheen along the top edge — fades in with the glass */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-copper-400)]/55 to-transparent transition-opacity duration-500",
            scrolled ? "opacity-100" : "opacity-0"
          )}
        />
        {/* Logo */}
        <Link
          href="/"
          aria-label="Aerial Roof Measure home"
          className="flex items-center flex-shrink-0 transition-opacity hover:opacity-90"
          style={{ minWidth: "256px" }}
        >
          <Logo
            variant="lockup"
            className={cn(
              "w-auto origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
              scrolled ? "h-14 md:h-16 scale-[0.72]" : "h-14 md:h-16 scale-100"
            )}
          />
        </Link>

        {/* Primary nav */}
        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {mainNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group relative px-4 py-2 rounded-md text-[14.5px] font-medium tracking-tight transition-colors duration-200",
                  active
                    ? "text-[color:var(--color-navy-900)]"
                    : "text-[color:var(--color-charcoal)]/85 hover:text-[color:var(--color-navy-900)]"
                )}
              >
                {item.label}
                {/* Animated copper underline — visible when active, slides in on hover */}
                <span
                  aria-hidden
                  className={cn(
                    "absolute left-4 right-4 -bottom-0.5 h-[2px] bg-[color:var(--color-copper-500)] rounded-full origin-left transition-transform duration-300 ease-out",
                    active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )}
                />
              </Link>
            );
          })}
        </nav>

        {/* Right cluster — sign in + CTA */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Vertical divider */}
          <span aria-hidden className="h-6 w-px bg-[color:var(--color-border-soft)]" />

          <Link
            href="/login"
            className={cn(
              "text-sm font-medium px-3 py-2 rounded-md transition-all",
              isActive("/login")
                ? "text-[color:var(--color-navy-900)] bg-[color:var(--color-copper-500)]/8"
                : "text-[color:var(--color-charcoal)] hover:text-[color:var(--color-navy-900)] hover:bg-black/[0.035]"
            )}
          >
            Sign in
          </Link>

          {/* Premium CTA — gradient bg + copper sheen on hover */}
          <Link
            href="/order"
            className={cn(
              "group relative inline-flex items-center gap-1.5 rounded-full overflow-hidden",
              "bg-[linear-gradient(135deg,_var(--color-navy-900)_0%,_var(--color-navy-800)_100%)]",
              "text-white text-sm font-medium px-5 h-10",
              "shadow-[0_4px_14px_-4px_rgba(11,30,58,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]",
              "transition-all duration-300 ease-out",
              "hover:shadow-[0_8px_24px_-6px_rgba(11,30,58,0.45),inset_0_1px_0_rgba(255,255,255,0.12)]",
              "hover:-translate-y-0.5"
            )}
          >
            {/* Copper sheen sweep on hover */}
            <span
              aria-hidden
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[color:var(--color-copper-400)]/30 to-transparent group-hover:translate-x-full transition-transform duration-700 ease-out"
            />
            <span className="relative">Start an order</span>
            <ArrowRight className="relative h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <button
          className="lg:hidden p-2 -mr-2 text-[color:var(--color-navy-900)] rounded-md hover:bg-black/5 transition"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className={cn(
            "lg:hidden animate-fade-in",
            scrolled
              ? "mt-2 rounded-2xl border border-white/55 bg-[color:var(--color-warm-white)]/85 backdrop-blur-xl shadow-[0_14px_40px_-14px_rgba(11,30,58,0.28)]"
              : "bg-[color:var(--color-warm-white)] border-t border-[color:var(--color-border-soft)]"
          )}
        >
          <nav className={cn("flex flex-col gap-1", scrolled ? "px-5 py-5" : "container-page py-6")} aria-label="Mobile">
            {mainNav.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "py-3 font-medium border-b border-[color:var(--color-border-soft)] last:border-0 transition-colors flex items-center justify-between",
                    active
                      ? "text-[color:var(--color-copper-700)]"
                      : "text-[color:var(--color-navy-900)]"
                  )}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                  {active && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-copper-500)]" />
                  )}
                </Link>
              );
            })}
            <div className="flex flex-col gap-3 pt-5">
              <Link
                href="/login"
                className="py-3 text-[color:var(--color-charcoal)] font-medium"
                onClick={() => setOpen(false)}
              >
                Sign in
              </Link>
              <ButtonLink href="/order" size="md" className="w-full justify-center">
                Start an order
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
