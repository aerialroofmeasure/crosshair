import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { getProfile } from "@/lib/profile";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  if (!profile) {
    // No session. In a configured environment, send them to login; otherwise
    // (no Supabase env in local dev) let them through to preview the UI.
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/login?next=/admin/orders");
  } else if (profile.role !== "admin") {
    // Logged in but not an admin → bounce to the right home.
    redirect(profile.role === "employee" ? "/employee" : "/portal/dashboard");
  }

  const userEmail = profile?.email ?? "";

  return (
    <div className="min-h-screen bg-[color:var(--color-warm-white)]">
      {/* Slim admin header — minimal, function-first */}
      <header className="sticky top-0 z-30 bg-[color:var(--color-navy-900)] text-white border-b border-white/[0.08] relative">
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-adm-400)]/70 to-transparent" />
        <div aria-hidden className="absolute left-1/2 -translate-x-1/2 top-0 h-12 w-72 bg-[color:var(--color-adm-500)]/20 blur-2xl pointer-events-none" />
        <div className="container-page flex items-center justify-between gap-6 h-16 relative">
          <div className="flex items-center gap-6">
            <Link href="/admin" aria-label="Admin home" className="flex items-center">
              <Logo tone="white" variant="lockup" className="h-9 w-auto" noTagline />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full chip-adm-dark px-2.5 py-1 text-[10px] font-semibold tracking-[0.18em] uppercase">
              Admin
            </span>
            <nav className="hidden md:flex items-center gap-1">
              <AdminNavLink href="/admin" label="Overview" />
              <AdminNavLink href="/admin/orders" label="Orders" />
              <AdminNavLink href="/admin/employees" label="Employees" />
              <AdminNavLink href="/admin/customers" label="Customers" />
              <AdminNavLink href="/admin/profile" label="Profile" />
              <AdminNavLink href="/portal/dashboard" label="Customer portal" external />
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {userEmail && (
              <span className="hidden sm:inline text-xs text-white/55 truncate max-w-[200px]">{userEmail}</span>
            )}
            <SignOutButton compact />
          </div>
        </div>
      </header>

      <main className="container-page py-10 max-w-[1400px]">
        {children}
      </main>
    </div>
  );
}

function AdminNavLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <Link
      href={href}
      className="px-3 py-1.5 rounded-md text-sm text-white/70 hover:text-white hover:bg-white/[0.05] transition-colors"
    >
      {label}
      {external && " ↗"}
    </Link>
  );
}
