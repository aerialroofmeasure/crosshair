import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/portal-shell";
import { getProfile } from "@/lib/profile";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  // Defence-in-depth — middleware already protects, this is the server-side check.
  const profile = await getProfile();

  if (!profile) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/login");
    // env not configured — let dev continue with a placeholder identity.
    return (
      <PortalShell email="you@aerialroofmeasure.com" name="" company="">
        {children}
      </PortalShell>
    );
  }

  // Employees belong in the fulfillment portal, not the customer one.
  // (Admins may use either.)
  if (profile.role === "employee") redirect("/employee");

  return (
    <PortalShell email={profile.email} name={profile.full_name} company={profile.company}>
      {children}
    </PortalShell>
  );
}
