import { PageHeader } from "@/components/portal/page-header";
import { SupportForm } from "@/components/portal/support-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Mail, Clock, MessageSquare, ShieldCheck } from "lucide-react";

export const metadata = { title: "Support" };

export default async function SupportPage() {
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
        eyebrow="Support"
        title="We're a few hours away."
        description="Send us a note — sample reports, custom volume pricing, order issues, or anything else."
      />

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Form */}
        <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-7 md:p-9">
          <SupportForm prefillName={name} prefillEmail={email} prefillCompany={company} />
        </div>

        {/* Sidebar — channels + SLA */}
        <aside className="space-y-4">
          <Channel
            icon={<Mail className="h-4 w-4" />}
            label="Email"
            value="support@aerialroofmeasure.com"
            href="mailto:support@aerialroofmeasure.com"
          />
          <Channel
            icon={<MessageSquare className="h-4 w-4" />}
            label="Orders"
            value="orders@aerialroofmeasure.com"
            href="mailto:orders@aerialroofmeasure.com"
          />
          <Channel
            icon={<Clock className="h-4 w-4" />}
            label="Hours"
            value="Mon–Fri · 9am–6pm ET"
            hint="Replies within 4 business hours"
          />
          <div className="rounded-2xl bg-[color:var(--color-navy-900)] text-white p-5 relative overflow-hidden">
            <div aria-hidden className="absolute -right-10 -top-10 h-32 w-32 rounded-full border border-[color:var(--color-copper-500)]/15" />
            <div className="relative flex items-start gap-3">
              <div className="h-9 w-9 rounded-lg bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Got a measurement issue?</p>
                <p className="mt-1 text-xs text-white/65 leading-relaxed">
                  Include the order ID and a screenshot of what looks off. We&apos;ll re-issue within 24 hours under our accuracy guarantee.
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Channel({
  icon,
  label,
  value,
  hint,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-5 transition-all hover:border-[color:var(--color-copper-300)] hover:shadow-[0_8px_24px_-12px_rgba(11,30,58,0.12)]">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-lg bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] uppercase tracking-[0.16em] text-[color:var(--color-stone)] font-semibold">{label}</div>
          <div className="mt-0.5 text-sm font-medium text-[color:var(--color-navy-900)] truncate">{value}</div>
          {hint && <div className="mt-1 text-xs text-[color:var(--color-stone)]">{hint}</div>}
        </div>
      </div>
    </div>
  );
  return href ? (
    <a href={href} className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}
