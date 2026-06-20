"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Inbox,
  Loader,
  CheckCircle2,
  UserCircle,
  Menu,
  X,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/employee", label: "Home", icon: LayoutDashboard, hint: "Your overview" },
  { href: "/employee/queue", label: "Queue", icon: Inbox, hint: "Unassigned work" },
  { href: "/employee/ongoing", label: "Ongoing", icon: Loader, hint: "Your active orders" },
  { href: "/employee/completed", label: "Completed", icon: CheckCircle2, hint: "Delivered by you" },
  { href: "/employee/profile", label: "Profile", icon: UserCircle, hint: "Account & stats" },
];

interface EmployeeShellProps {
  email: string;
  name?: string;
  isAdmin?: boolean;
  children: React.ReactNode;
}

export function EmployeeShell({ email, name, isAdmin, children }: EmployeeShellProps) {
  const pathname = usePathname() ?? "";
  const [drawer, setDrawer] = useState(false);

  const activeHref = nav
    .map((n) => n.href)
    .filter((h) => (h === "/employee" ? pathname === h : pathname === h || pathname.startsWith(h + "/")))
    .sort((a, b) => b.length - a.length)[0];
  const isActive = (href: string) => href === activeHref;

  const initials =
    (name || email || "U")
      .split(/[\s@]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "U";

  const navList = (onNavigate?: () => void) => (
    <div className="space-y-1.5">
      {nav.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "group relative flex items-center gap-3 px-3.5 py-3 rounded-xl text-[14px] transition-all",
              active
                ? "neu-dark-pressed text-white font-medium"
                : "text-white/65 hover:text-white hover:bg-white/[0.04]"
            )}
          >
            {active && (
              <span aria-hidden className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full rail-emp" />
            )}
            <span
              className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                active
                  ? "tile-emp"
                  : "bg-white/[0.04] text-white/60 group-hover:text-white/90"
              )}
            >
              <item.icon className="h-4 w-4" strokeWidth={active ? 2 : 1.75} />
            </span>
            <span className="flex-1">
              <span className="block leading-tight">{item.label}</span>
              <span className="block text-[11px] text-white/35 leading-tight">{item.hint}</span>
            </span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[color:var(--color-warm-white)]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-80 flex-col bg-[color:var(--color-navy-900)] text-white relative sticky top-0 h-screen self-start">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-copper-400)]/40 to-transparent" />

        <div className="px-6 py-7 border-b border-white/[0.08]">
          <Link href="/employee" aria-label="Employee home" className="inline-block transition-opacity hover:opacity-90">
            <Logo tone="white" variant="lockup" className="h-12 w-auto" noTagline />
          </Link>
          <span className="mt-3 inline-flex items-center gap-1.5 rounded-full chip-emp-dark px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase">
            Fulfillment
          </span>
        </div>

        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          {navList()}

          {isAdmin && (
            <div className="mx-1 mt-6">
              <Link
                href="/admin/orders"
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-xl bg-[color:var(--color-copper-500)]/10 border border-[color:var(--color-copper-500)]/25 text-[color:var(--color-copper-200)] hover:bg-[color:var(--color-copper-500)]/15 transition"
              >
                <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.14em] uppercase">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin view
                </span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}
        </nav>

        <div className="px-3 py-3 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[color:var(--color-emp-300)] to-[color:var(--color-emp-700)] flex items-center justify-center text-[12px] font-semibold text-white tracking-tight flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] text-white font-medium truncate">{name || "Employee"}</div>
              <div className="text-[11px] text-white/45 truncate">{email}</div>
            </div>
            <SignOutButton compact />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="lg:hidden bg-[color:var(--color-navy-900)] text-white px-5 py-4 flex items-center justify-between sticky top-0 z-30">
          <Link href="/employee" aria-label="Employee home">
            <Logo tone="white" variant="lockup" className="h-9 w-auto" noTagline />
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
          <div key={pathname} className="animate-fade-up">{children}</div>
        </main>
      </div>

      {/* Mobile drawer */}
      {drawer && (
        <div className="lg:hidden fixed inset-0 z-40 animate-fade-in">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setDrawer(false)} aria-hidden />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-[color:var(--color-navy-900)] text-white flex flex-col">
            <div className="px-5 py-4 flex items-center justify-between border-b border-white/[0.08]">
              <Logo tone="white" variant="lockup" className="h-10 w-auto" noTagline />
              <button onClick={() => setDrawer(false)} className="p-2 -mr-2 rounded-lg hover:bg-white/5 transition" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-5 overflow-y-auto">{navList(() => setDrawer(false))}</nav>
            <div className="px-3 py-3 border-t border-white/[0.08]">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[color:var(--color-emp-300)] to-[color:var(--color-emp-700)] flex items-center justify-center text-[12px] font-semibold text-white">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] text-white font-medium truncate">{name || "Employee"}</div>
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
