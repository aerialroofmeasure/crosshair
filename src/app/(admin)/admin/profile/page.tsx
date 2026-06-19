import { PageHeader } from "@/components/portal/page-header";
import { ProfileIdentity } from "@/components/portal/profile-identity";
import { PasswordCard } from "@/components/portal/password-card";
import { getProfile } from "@/lib/profile";
import { fetchProfilesByRole, fetchStaffOrders } from "@/lib/staff";

export const metadata = { title: "Admin · Profile" };
export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const [profile, employees, paid, ongoing] = await Promise.all([
    getProfile(),
    fetchProfilesByRole("employee"),
    fetchStaffOrders({ status: "paid", unassigned: true, limit: 500 }),
    fetchStaffOrders({ status: "in_progress", limit: 500 }),
  ]);

  const activeTeam = employees.filter((e) => e.is_active).length;

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Your account"
        description="Your identity, a quick operations summary, and your password."
      />

      <div className="mt-10 max-w-3xl space-y-6">
        <ProfileIdentity
          name={profile?.full_name || ""}
          email={profile?.email || ""}
          roleLabel="Admin"
          accent="adm"
          subtitle="Aerial Roof Measure — Operations"
          stats={[
            { label: "Active team", value: String(activeTeam) },
            { label: "To assign", value: String(paid.length) },
            { label: "Ongoing", value: String(ongoing.length) },
          ]}
        />
        <PasswordCard />
      </div>
    </div>
  );
}
