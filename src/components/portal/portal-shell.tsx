"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FilePlus,
  FolderOpen,
  Receipt,
  Settings,
  Menu,
  X,
  LifeBuoy,
  ArrowRight,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Workspace",
    items: [
      { href: "/portal/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/portal/orders/new", label: "New order", icon: FilePlus, accent: true },
      { href: "/portal/orders", label: "Orders", icon: FolderOpen },
    ],
  },
  {
    label: "Account",
    items: [
      { href: "/portal/billing", label: "Billing", icon: Receipt },
      { href: "/portal/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface PortalShellProps {
  email: string;
  name?: string;
  company?: string;
  children: React.ReactNode;
}

export function PortalShell({ email, name, company, children }: PortalShellProps) {
  const pathname = usePathname() ?? "";
  const [drawer, setDrawer] = useState(false);

  // Longest matching nav href wins — prevents /portal/orders from lighting up
  // when we're actually on /portal/orders/new.
  const allHrefs = sections.flatMap((s) => s.items.map((i) => i.href));
  const activeHref = allHrefs
    .filter((h) => pathname === h || pathname.startsWith(h + "/"))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;

  const initials =
    (name || email || "U")
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

  return (
    <div className="min-h-screen flex bg-[color:var(--color-warm-white)]">
      {/* =========================================
          DESKTOP SIDEBAR
          ========================================= */}
      <aside className="hidden lg:flex w-80 flex-col bg-[color:var(--color-navy-900)] text-white relative">
        {/* Subtle copper top accent */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-copper-400)]/40 to-transparent" />

        {/* Brand */}
        <div className="px-6 py-7 border-b border-white/[0.08]">
          <Link href="/portal/dashboard" aria-label="Portal home" className="inline-block transition-opacity hover:opacity-90">
            <Logo tone="white" variant="lockup" className="h-14 w-auto" />
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.label}>
              <div className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/35">
                {section.label}
              </div>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] transition-colors",
                        active
                          ? "bg-white/[0.07] text-white font-medium"
                          : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                      )}
                    >
                      {/* Active copper bar on the left */}
                      {active && (
                        <span aria-hidden className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[color:var(--color-copper-500)]" />
                      )}
                      <item.icon className="h-4 w-4 flex-shrink-0" strokeWidth={active ? 2 : 1.75} />
                      <span className="flex-1">{item.label}</span>
                      {item.accent && !active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-copper-400)]" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Support card */}
          <div className="mt-8 mx-3 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-lg bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] flex items-center justify-center">
                <LifeBuoy className="h-3.5 w-3.5" />
              </div>
              <span className="text-sm font-medium text-white">Need a hand?</span>
            </div>
            <p className="mt-2 text-xs text-white/55 leading-relaxed">
              Reply within 4 business hours.
            </p>
            <Link
              href="/portal/support"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-[color:var(--color-copper-300)] hover:text-[color:var(--color-copper-200)] transition"
            >
              Contact support
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </nav>

        {/* User identity */}
        <div className="px-3 py-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[color:var(--color-copper-400)] to-[color:var(--color-copper-700)] flex items-center justify-center text-[12px] font-semibold text-white tracking-tight flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-white font-medium truncate">{name || "Account"}</div>
              <div className="text-[11px] text-white/45 truncate">{email}</div>
            </div>
            <SignOutButton compact />
          </div>
        </div>
      </aside>

      {/* =========================================
          MAIN AREA
          ========================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <header className="lg:hidden bg-[color:var(--color-navy-900)] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <Link href="/portal/dashboard" aria-label="Portal home">
            <Logo tone="white" variant="lockup" className="h-10 w-auto" />
          </Link>
          <button
            onClick={() => setDrawer(true)}
            className="p-2 -mr-2 rounded-lg hover:bg-white/5 transition"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </header>

        <main className="flex-1 p-6 md:p-10 lg:p-12 max-w-[1400px] w-full mx-auto">
          {/* Keyed wrapper — re-mounts on route change, triggering the
              fade-up animation so transitions feel intentional. */}
          <div key={pathname} className="animate-fade-up">
            {children}
          </div>
        </main>
      </div>

      {/* =========================================
          MOBILE DRAWER
          ========================================= */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawer(false)}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[color:var(--color-navy-900)] text-white flex flex-col">
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.08]">
              <Logo tone="white" variant="lockup" className="h-12 w-auto" />
              <button
                onClick={() => setDrawer(false)}
                className="p-2 -mr-2 rounded-lg hover:bg-white/5 transition"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-5 space-y-6 overflow-y-auto">
              {sections.map((section) => (
                <div key={section.label}>
                  <div className="px-3 mb-2 text-[10px] font-semibold tracking-[0.18em] uppercase text-white/35">
                    {section.label}
                  </div>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setDrawer(false)}
                          className={cn(
                            "flex items-center gap-3 px-3 py-3 rounded-lg text-[14px] transition-colors",
                            active
                              ? "bg-white/[0.07] text-white font-medium"
                              : "text-white/65 hover:text-white hover:bg-white/[0.04]"
                          )}
                        >
                          <item.icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="px-3 py-3 border-t border-white/[0.08]">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[color:var(--color-copper-400)] to-[color:var(--color-copper-700)] flex items-center justify-center text-[12px] font-semibold text-white">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-white font-medium truncate">{name || "Account"}</div>
                  <div className="text-[11px] text-white/45 truncate">{email}</div>
                </div>
                <SignOutButton compact />
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
