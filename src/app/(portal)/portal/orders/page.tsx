import { ArrowRight, FolderOpen, FilePlus, MapPin, Link2, CheckCircle2, Clock } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { StatusPill } from "@/components/portal/status-pill";
import { ReportDownloads, type DownloadableFile } from "@/components/portal/report-downloads";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { formatRef, formatLabelShort, speedLabelShort, type OrderStatus, type FileKind } from "@/lib/orders";

export const metadata = { title: "Orders" };
export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  order_number: number;
  service_name: string;
  format: string;
  speed: string;
  status: OrderStatus;
  location_mode: "type" | "link";
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  maps_link: string | null;
  total_cents: number;
  created_at: string;
  completed_at: string | null;
}

export default async function OrdersPage() {
  let orders: OrderRow[] = [];
  const filesByOrder = new Map<string, DownloadableFile[]>();

  try {
    const supabase = await createSupabaseServerClient();
    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data, error } = await supabase
        .from("orders")
        .select(
          "id, order_number, service_name, format, speed, status, location_mode, street, city, state, zip, maps_link, total_cents, created_at, completed_at"
        )
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });
      if (!error && data) orders = data as OrderRow[];

      // Pull the delivered files (RLS lets a customer read their own).
      const deliveredIds = orders.filter((o) => o.status === "delivered").map((o) => o.id);
      if (deliveredIds.length > 0) {
        const { data: files } = await supabase
          .from("order_files")
          .select("id, order_id, kind, file_name, size_bytes")
          .in("order_id", deliveredIds);
        for (const f of (files ?? []) as (DownloadableFile & { order_id: string; kind: FileKind })[]) {
          const arr = filesByOrder.get(f.order_id) ?? [];
          arr.push(f);
          filesByOrder.set(f.order_id, arr);
        }
      }
    }
  } catch {
    // Supabase not configured — render empty state
  }

  const pending = orders.filter((o) => o.status !== "delivered" && o.status !== "cancelled");
  const completed = orders.filter((o) => o.status === "delivered");
  const cancelled = orders.filter((o) => o.status === "cancelled");

  return (
    <div>
      <PageHeader
        eyebrow="Orders"
        title="All your orders"
        description="Track what's in progress and download your finished reports."
        action={
          <ButtonLink href="/portal/orders/new" size="md">
            <FilePlus className="h-4 w-4" />
            New order
          </ButtonLink>
        }
      />

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyCard
            icon={<FolderOpen className="h-6 w-6" />}
            title="No orders yet"
            description="When you place an order it'll show up here with live status, delivery ETAs and download links the moment it ships."
            action={
              <ButtonLink href="/portal/orders/new" size="md">
                <FilePlus className="h-4 w-4" />
                Start your first order
                <ArrowRight className="h-4 w-4" />
              </ButtonLink>
            }
          />
        </div>
      ) : (
        <div className="mt-10 space-y-12">
          <Section icon={<Clock className="h-4 w-4" />} title="Pending & in progress" count={pending.length}>
            {pending.length === 0 ? (
              <Muted>Nothing in progress right now.</Muted>
            ) : (
              <div className="grid gap-4">
                {pending.map((o) => (
                  <PendingRow key={o.id} order={o} />
                ))}
              </div>
            )}
          </Section>

          <Section icon={<CheckCircle2 className="h-4 w-4" />} title="Completed" count={completed.length}>
            {completed.length === 0 ? (
              <Muted>Your delivered reports and downloads will appear here.</Muted>
            ) : (
              <div className="grid gap-4">
                {completed.map((o) => (
                  <CompletedCard key={o.id} order={o} files={filesByOrder.get(o.id) ?? []} />
                ))}
              </div>
            )}
          </Section>

          {cancelled.length > 0 && (
            <Section title="Cancelled" count={cancelled.length}>
              <div className="grid gap-4">
                {cancelled.map((o) => (
                  <PendingRow key={o.id} order={o} />
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  count,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        {icon && (
          <span className="h-7 w-7 rounded-lg bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center">
            {icon}
          </span>
        )}
        <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">{title}</h2>
        <span className="text-xs text-[color:var(--color-stone)]">· {count}</span>
      </div>
      {children}
    </section>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl neu-inset px-6 py-8 text-center text-sm text-[color:var(--color-stone)]">{children}</div>
  );
}

function PendingRow({ order: o }: { order: OrderRow }) {
  return (
    <div className="neu-card p-5 flex flex-wrap items-center justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2.5">
          <span className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">{formatRef(o.order_number)}</span>
          <StatusPill status={o.status} />
        </div>
        <div className="mt-1.5 text-sm font-medium text-[color:var(--color-navy-900)] flex items-center gap-1.5">
          {o.location_mode === "link" ? (
            <Link2 className="h-3.5 w-3.5 text-[color:var(--color-stone)]" />
          ) : (
            <MapPin className="h-3.5 w-3.5 text-[color:var(--color-stone)]" />
          )}
          {addressLine(o)}
        </div>
        <div className="mt-0.5 text-xs text-[color:var(--color-stone)]">
          {o.service_name} · {formatLabelShort(o.format)} · {speedLabelShort(o.speed)}
        </div>
      </div>
      <div className="text-right">
        <div className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">${(o.total_cents / 100).toFixed(0)}</div>
        <div className="text-xs text-[color:var(--color-stone)]">
          {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>
    </div>
  );
}

function CompletedCard({ order: o, files }: { order: OrderRow; files: DownloadableFile[] }) {
  return (
    <div className="neu-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">{formatRef(o.order_number)}</span>
            <StatusPill status={o.status} />
          </div>
          <div className="mt-1.5 text-sm font-medium text-[color:var(--color-navy-900)] flex items-center gap-1.5">
            {o.location_mode === "link" ? (
              <Link2 className="h-3.5 w-3.5 text-[color:var(--color-stone)]" />
            ) : (
              <MapPin className="h-3.5 w-3.5 text-[color:var(--color-stone)]" />
            )}
            {addressLine(o)}
          </div>
          <div className="mt-0.5 text-xs text-[color:var(--color-stone)]">
            {o.service_name} · {formatLabelShort(o.format)}
            {o.completed_at && (
              <> · delivered {new Date(o.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
            )}
          </div>
        </div>
        <div className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">${(o.total_cents / 100).toFixed(0)}</div>
      </div>
      <div className="mt-4 pt-4 border-t border-[color:var(--color-border-soft)]">
        <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)] mb-2.5">Your report files</div>
        <ReportDownloads files={files} />
      </div>
    </div>
  );
}

function addressLine(o: OrderRow) {
  if (o.location_mode === "link") return "Pinned via map link";
  return [o.street, o.city, o.state, o.zip].filter(Boolean).join(", ");
}
