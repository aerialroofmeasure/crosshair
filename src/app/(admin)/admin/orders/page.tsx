import Link from "next/link";
import { MapPin, Link2, Mail, ExternalLink, UserCheck } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { StatusSelect } from "@/components/admin/status-select";
import { AssignSelect, type AssignOption } from "@/components/admin/assign-select";
import {
  fetchStaffOrders,
  fetchProfilesMap,
  fetchProfilesByRole,
  displayName,
  type StaffOrder,
} from "@/lib/staff";
import { formatRef, formatLabelShort, speedLabelShort } from "@/lib/orders";
import { cn } from "@/lib/utils";

export const metadata = { title: "Admin · Orders" };
export const dynamic = "force-dynamic";

const TABS = [
  { key: "all", label: "All" },
  { key: "to_assign", label: "To assign" },
  { key: "ongoing", label: "Ongoing" },
  { key: "completed", label: "Completed" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const tab: TabKey = (TABS.find((t) => t.key === filter)?.key ?? "all") as TabKey;

  const orders = await fetchStaffOrders({ limit: 300 });
  const employees = (await fetchProfilesByRole("employee")).filter((e) => e.is_active);
  const employeeOptions: AssignOption[] = employees.map((e) => ({ id: e.id, name: displayName(e) }));

  // Resolve assignee + completer names.
  const userIds = orders.flatMap((o) => [o.assigned_to, o.completed_by].filter(Boolean) as string[]);
  const profiles = await fetchProfilesMap(userIds);

  const stats = orders.reduce(
    (acc, o) => {
      acc.total++;
      if (o.status === "paid" && !o.assigned_to) acc.toAssign++;
      if (o.status === "in_progress") acc.ongoing++;
      if (o.status === "delivered") acc.delivered++;
      return acc;
    },
    { total: 0, toAssign: 0, ongoing: 0, delivered: 0 }
  );

  const visible = orders.filter((o) => {
    if (tab === "to_assign") return o.status === "paid" && !o.assigned_to;
    if (tab === "ongoing") return o.status === "in_progress";
    if (tab === "completed") return o.status === "delivered";
    return true;
  });

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="All orders"
        description="Assign work, track who's on what, and watch orders move from paid to delivered."
      />

      {/* Stats strip */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Total orders" value={stats.total.toString()} />
        <Stat label="To assign" value={stats.toAssign.toString()} tone="amber" />
        <Stat label="Ongoing" value={stats.ongoing.toString()} tone="adm" />
        <Stat label="Delivered" value={stats.delivered.toString()} tone="navy" />
      </div>

      {/* Filter tabs */}
      <div className="mt-8 flex flex-wrap gap-2">
        {TABS.map((t) => {
          const active = t.key === tab;
          const count =
            t.key === "to_assign" ? stats.toAssign :
            t.key === "ongoing" ? stats.ongoing :
            t.key === "completed" ? stats.delivered :
            stats.total;
          return (
            <Link
              key={t.key}
              href={t.key === "all" ? "/admin/orders" : `/admin/orders?filter=${t.key}`}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-4 h-9 text-sm font-medium transition",
                active
                  ? "neu-pressed text-[color:var(--color-adm-700)]"
                  : "neu-btn hover:neu-btn-hover text-[color:var(--color-charcoal)]"
              )}
            >
              {t.label}
              <span className="text-xs text-[color:var(--color-stone)]">{count}</span>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 ? (
        <div className="mt-8">
          <EmptyCard
            icon={<Mail className="h-6 w-6" />}
            title="Nothing here"
            description="No orders match this filter yet."
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-4">
          {visible.map((o) => (
            <AdminOrderCard
              key={o.id}
              order={o}
              assigneeName={o.assigned_to ? displayName(profiles.get(o.assigned_to)) : null}
              completerName={o.completed_by ? displayName(profiles.get(o.completed_by)) : null}
              employees={employeeOptions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function AdminOrderCard({
  order: o,
  assigneeName,
  completerName,
  employees,
}: {
  order: StaffOrder;
  assigneeName: string | null;
  completerName: string | null;
  employees: AssignOption[];
}) {
  return (
    <div className="neu-card p-5 lg:p-6">
      <div className="grid gap-4 lg:grid-cols-[110px_minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
        {/* Ref + total */}
        <div>
          <div className="font-numeric font-semibold text-sm text-[color:var(--color-navy-900)]">{formatRef(o.order_number)}</div>
          <div className="mt-1 font-numeric font-bold text-base text-[color:var(--color-navy-900)]">${(o.total_cents / 100).toFixed(0)}</div>
        </div>

        {/* Customer · property */}
        <div className="min-w-0">
          <div className="text-sm font-medium text-[color:var(--color-navy-900)] truncate">
            {o.customer_name}
            {o.customer_company && <span className="text-[color:var(--color-stone)] font-normal"> · {o.customer_company}</span>}
          </div>
          <a href={`mailto:${o.customer_email}`} className="mt-0.5 inline-flex items-center gap-1 text-xs text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)]">
            <Mail className="h-3 w-3" />
            {o.customer_email}
          </a>
          <div className="mt-2 flex items-start gap-1.5 text-xs text-[color:var(--color-charcoal)]">
            {o.location_mode === "link" ? (
              <Link2 className="h-3 w-3 mt-0.5 text-[color:var(--color-stone)] flex-shrink-0" />
            ) : (
              <MapPin className="h-3 w-3 mt-0.5 text-[color:var(--color-stone)] flex-shrink-0" />
            )}
            <span className="min-w-0">
              {o.location_mode === "link" ? (
                <a href={o.maps_link ?? "#"} target="_blank" rel="noreferrer" className="hover:underline inline-flex items-center gap-1">
                  Map link <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                [o.street, o.city, o.state, o.zip].filter(Boolean).join(", ")
              )}
            </span>
          </div>
        </div>

        {/* Report + assignment meta */}
        <div className="text-sm">
          <div className="text-[color:var(--color-navy-900)]">{o.service_name}</div>
          <div className="text-xs text-[color:var(--color-stone)] mt-0.5">
            {formatLabelShort(o.format)} · {speedLabelShort(o.speed)}
          </div>
          <div className="mt-2 text-xs">
            {o.status === "delivered" && completerName ? (
              <span className="inline-flex items-center gap-1.5 text-[color:var(--color-copper-700)]">
                <UserCheck className="h-3.5 w-3.5" />
                Delivered by {completerName}
              </span>
            ) : assigneeName ? (
              <span className="inline-flex items-center gap-1.5 text-[color:var(--color-charcoal)]">
                <UserCheck className="h-3.5 w-3.5 text-[color:var(--color-stone)]" />
                {assigneeName}
              </span>
            ) : (
              <span className="text-[color:var(--color-stone)]">Unassigned</span>
            )}
          </div>
          <div className="mt-1 text-[11px] text-[color:var(--color-stone)]">
            {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-2 lg:items-end">
          {o.status !== "delivered" && o.status !== "cancelled" && (
            <AssignSelect orderId={o.id} current={o.assigned_to} employees={employees} />
          )}
          <StatusSelect orderId={o.id} current={o.status} />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, tone = "navy" }: { label: string; value: string; tone?: "navy" | "amber" | "copper" | "adm" }) {
  const toneClass = {
    navy: "text-[color:var(--color-navy-900)]",
    amber: "text-amber-700",
    copper: "text-[color:var(--color-copper-700)]",
    adm: "text-[color:var(--color-adm-700)]",
  }[tone];
  return (
    <div className="neu-card p-5">
      <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)]">{label}</div>
      <div className={`mt-2 font-numeric font-bold text-3xl tracking-tight ${toneClass}`}>{value}</div>
    </div>
  );
}
