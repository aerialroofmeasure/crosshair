import { PageHeader } from "@/components/portal/page-header";
import { ProfileIdentity } from "@/components/portal/profile-identity";
import { PasswordCard } from "@/components/portal/password-card";
import { getProfile } from "@/lib/profile";
import { fetchStaffOrders } from "@/lib/staff";

export const metadata = { title: "Profile · Fulfillment" };
export const dynamic = "force-dynamic";

export default async function EmployeeProfilePage() {
  const profile = await getProfile();

  let ongoing = 0;
  let completed = 0;
  if (profile) {
    const [ong, done] = await Promise.all([
      fetchStaffOrders({ status: "in_progress", assignedTo: profile.id }),
      fetchStaffOrders({ status: "delivered", completedBy: profile.id }),
    ]);
    ongoing = ong.length;
    completed = done.length;
  }

  const roleLabel = profile?.role === "admin" ? "Admin" : "Employee";

  return (
    <div>
      <PageHeader
        eyebrow="Profile"
        title="Your account"
        description="Your identity, fulfillment stats and password."
      />

      <div className="mt-10 max-w-3xl space-y-6">
        <ProfileIdentity
          name={profile?.full_name || ""}
          email={profile?.email || ""}
          roleLabel={roleLabel}
          accent="emp"
          subtitle="Aerial Roof Measure — Fulfillment team"
          stats={[
            { label: "Ongoing", value: String(ongoing) },
            { label: "Completed", value: String(completed) },
            { label: "Total", value: String(ongoing + completed) },
          ]}
        />
        <PasswordCard />
      </div>
    </div>
  );
}
