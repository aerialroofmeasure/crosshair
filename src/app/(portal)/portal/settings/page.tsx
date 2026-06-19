import { PageHeader } from "@/components/portal/page-header";
import { SettingsForm } from "@/components/portal/settings-form";
import { ProfileIdentity } from "@/components/portal/profile-identity";
import { getProfile } from "@/lib/profile";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const profile = await getProfile();
  const email = profile?.email ?? "";
  const name = profile?.full_name ?? "";
  const company = profile?.company ?? "";

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Profile, password and notification preferences."
      />

      <div className="mt-10 max-w-3xl space-y-6">
        <ProfileIdentity
          name={name}
          email={email}
          roleLabel="Customer"
          subtitle={company || "Aerial Roof Measure account"}
        />
        <SettingsForm initialEmail={email} initialName={name} initialCompany={company} />
      </div>
    </div>
  );
}
