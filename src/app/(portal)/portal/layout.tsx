import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { PortalShell } from "@/components/portal/portal-shell";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  // Defence-in-depth — middleware already protects, this is the server-side check.
  let userEmail = "you@aerialroofmeasure.com";
  let userName = "";
  let userCompany = "";

  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!data.user) {
      if (process.env.NEXT_PUBLIC_SUPABASE_URL) redirect("/login");
    } else {
      userEmail = data.user.email ?? userEmail;
      const meta = (data.user.user_metadata ?? {}) as Record<string, string>;
      userName = meta.full_name ?? "";
      userCompany = meta.company ?? "";
    }
  } catch {
    // env not configured — let dev continue with placeholder identity
  }

  return (
    <PortalShell email={userEmail} name={userName} company={userCompany}>
      {children}
    </PortalShell>
  );
}
