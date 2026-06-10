import Link from "next/link";
import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/logo";
import { SignOutButton } from "@/components/portal/sign-out-button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/admin";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let userEmail = "";
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/login?next=/admin/orders");
    } else {
      userEmail = data.user.email ?? "";
      if (!isAdminEmail(userEmail)) {
        // Logged in but not an admin → bounce to customer portal.
        redirect("/portal/dashboard");
      }
    }
  } catch {
    // env not configured → let dev through
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-warm-white)]">
      {/* Slim admin header — minimal, function-first */}
      <header className="sticky top-0 z-30 bg-[color:var(--color-navy-900)] text-white border-b border-white/[0.08]">
        <div className="container-page flex items-center justify-between gap-6 h-16">
          <div className="flex items-center gap-6">
            <Link href="/admin/orders" aria-label="Admin home" className="flex items-center">
              <Logo tone="white" variant="lockup" className="h-9 w-auto" noTagline />
            </Link>
            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] border border-[color:var(--color-copper-500)]/30 px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.18em] uppercase">
              Admin
            </span>
            <nav className="hidden md:flex items-center gap-1">
              <AdminNavLink href="/admin/orders" label="Orders" />
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
