import { PageHeader } from "@/components/portal/page-header";
import { SettingsForm } from "@/components/portal/settings-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  let email = "";
  let name = "";
  let company = "";
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? "";
    const meta = (data.user?.user_metadata ?? {}) as Record<string, string>;
    name = meta.full_name ?? "";
    company = meta.company ?? "";
  } catch {}

  return (
    <div>
      <PageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Profile, password and notification preferences."
      />

      <div className="mt-10 max-w-3xl">
        <SettingsForm initialEmail={email} initialName={name} initialCompany={company} />
      </div>
    </div>
  );
}
