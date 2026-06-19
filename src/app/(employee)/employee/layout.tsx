import { redirect } from "next/navigation";
import { EmployeeShell } from "@/components/employee/employee-shell";
import { getProfile, isStaffRole } from "@/lib/profile";

export const metadata = { title: "Fulfillment" };

export default async function EmployeeLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();

  // No Supabase configured → let dev through with a placeholder identity.
  if (!profile) {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/login?next=/employee");
    return (
      <EmployeeShell email="employee@aerialroofmeasure.com" name="Employee">
        {children}
      </EmployeeShell>
    );
  }

  // Disabled accounts are bounced even if they still hold a session.
  if (!profile.is_active) redirect("/login?next=/employee");

  // Customers don't belong here.
  if (!isStaffRole(profile.role)) redirect("/portal/dashboard");

  return (
    <EmployeeShell email={profile.email} name={profile.full_name} isAdmin={profile.role === "admin"}>
      {children}
    </EmployeeShell>
  );
}
