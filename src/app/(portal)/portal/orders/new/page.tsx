import Link from "next/link";
import { ArrowLeft, ShieldCheck, Zap, FileCheck2 } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { OrderWizard } from "@/components/order/order-wizard";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const metadata = { title: "New order" };

export default async function NewOrderPage() {
  // Pre-fill the wizard's contact step with the logged-in user's details.
  let prefill: { name?: string; email?: string; company?: string } = {};
  try {
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    const meta = (data.user?.user_metadata ?? {}) as Record<string, string>;
    prefill = {
      name: meta.full_name,
      email: data.user?.email,
      company: meta.company,
    };
  } catch {}

  return (
    <div>
      {/* Breadcrumb */}
      <Link
        href="/portal/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)] transition mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to dashboard
      </Link>

      <PageHeader
        eyebrow="New order"
        title="What are we measuring?"
        description="Five quick steps — about 60 seconds. Your contact details are already filled in."
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_300px]">
        {/* Wizard */}
        <div className="min-w-0">
          <OrderWizard prefill={prefill} />
        </div>

        {/* Sidebar — promises + reassurance */}
        <aside className="lg:sticky lg:top-8 self-start space-y-4">
          <div className="rounded-2xl bg-[color:var(--color-navy-900)] text-white p-6 relative overflow-hidden">
            <div aria-hidden className="absolute -right-12 -top-12 h-32 w-32 rounded-full border border-[color:var(--color-copper-500)]/15" />
            <div className="relative">
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-300)]">
                Our promise
              </span>
              <ul className="mt-5 space-y-4 text-sm">
                <PromiseRow
                  icon={<ShieldCheck className="h-3.5 w-3.5" />}
                  title="98%+ accuracy"
                  body="Or we re-measure free"
                />
                <PromiseRow
                  icon={<Zap className="h-3.5 w-3.5" />}
                  title="6-hour rush SLA"
                  body="Miss the window? 50% off"
                />
                <PromiseRow
                  icon={<FileCheck2 className="h-3.5 w-3.5" />}
                  title="Xactimate ready"
                  body="ESX drops into your sketch"
                />
              </ul>
            </div>
          </div>

          <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-5">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[color:var(--color-copper-600)]">
              How payment works
            </p>
            <p className="mt-2 text-[13px] text-[color:var(--color-stone)] leading-relaxed">
              You confirm the order, we email an invoice. Pay by ACH or card. Work
              begins as soon as the invoice is settled.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function PromiseRow({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <li className="flex gap-3">
      <div className="flex-shrink-0 mt-0.5 h-6 w-6 rounded-md bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-300)] flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="font-medium text-white">{title}</div>
        <div className="text-xs text-white/55">{body}</div>
      </div>
    </li>
  );
}
