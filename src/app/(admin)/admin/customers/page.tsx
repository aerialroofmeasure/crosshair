import { Mail, Users } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { fetchProfilesByRole, fetchStaffOrders, displayName } from "@/lib/staff";

export const metadata = { title: "Admin · Customers" };
export const dynamic = "force-dynamic";

interface CustomerAgg {
  total: number;
  ongoing: number;
  completed: number;
  spendCents: number;
}

export default async function AdminCustomersPage() {
  const [customers, orders] = await Promise.all([
    fetchProfilesByRole("customer"),
    fetchStaffOrders({ limit: 1000 }),
  ]);

  const byUser = new Map<string, CustomerAgg>();
  for (const o of orders) {
    if (!o.user_id) continue;
    const agg = byUser.get(o.user_id) ?? { total: 0, ongoing: 0, completed: 0, spendCents: 0 };
    agg.total++;
    if (o.status === "paid" || o.status === "in_progress") agg.ongoing++;
    if (o.status === "delivered") agg.completed++;
    if (o.status !== "cancelled" && o.status !== "pending_payment") agg.spendCents += o.total_cents;
    byUser.set(o.user_id, agg);
  }

  const rows = customers
    .map((c) => ({ profile: c, agg: byUser.get(c.id) ?? { total: 0, ongoing: 0, completed: 0, spendCents: 0 } }))
    .sort((a, b) => b.agg.total - a.agg.total);

  const totalCustomers = rows.length;
  const withOrders = rows.filter((r) => r.agg.total > 0).length;

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Customers"
        description="Everyone who's signed up, with their order activity at a glance."
        action={
          <span className="inline-flex items-center gap-2 rounded-full neu-inset px-4 h-10 text-sm font-semibold text-[color:var(--color-navy-900)]">
            {withOrders} ordering · {totalCustomers} total
          </span>
        }
      />

      {rows.length === 0 ? (
        <div className="mt-10">
          <EmptyCard
            icon={<Users className="h-6 w-6" />}
            title="No customers yet"
            description="When someone signs up, they'll appear here with their order counts."
          />
        </div>
      ) : (
        <div className="mt-10 neu-card overflow-hidden">
          <div className="hidden md:grid grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] gap-4 px-6 py-3 text-[10px] font-semibold tracking-[0.16em] uppercase text-[color:var(--color-stone)] border-b border-[color:var(--color-border-soft)]">
            <div>Customer</div>
            <div className="text-right">Total</div>
            <div className="text-right">Ongoing</div>
            <div className="text-right">Completed</div>
            <div className="text-right">Spend</div>
          </div>
          <ul>
            {rows.map(({ profile: c, agg }) => (
              <li
                key={c.id}
                className="grid grid-cols-2 md:grid-cols-[minmax(0,1.6fr)_repeat(4,minmax(0,1fr))] gap-4 px-6 py-4 border-b border-[color:var(--color-border-soft)] last:border-b-0 items-center"
              >
                <div className="col-span-2 md:col-span-1 min-w-0">
                  <div className="text-sm font-medium text-[color:var(--color-navy-900)] truncate">
                    {displayName(c)}
                    {c.company && <span className="text-[color:var(--color-stone)] font-normal"> · {c.company}</span>}
                  </div>
                  <a href={`mailto:${c.email}`} className="inline-flex items-center gap-1 text-xs text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)]">
                    <Mail className="h-3 w-3" />
                    {c.email}
                  </a>
                </div>
                <Cell label="Total" value={agg.total} />
                <Cell label="Ongoing" value={agg.ongoing} tone={agg.ongoing > 0 ? "copper" : undefined} />
                <Cell label="Completed" value={agg.completed} />
                <Cell label="Spend" value={`$${(agg.spendCents / 100).toFixed(0)}`} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Cell({ label, value, tone }: { label: string; value: number | string; tone?: "copper" }) {
  return (
    <div className="md:text-right">
      <span className="md:hidden text-[10px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-stone)] mr-2">{label}</span>
      <span className={`font-numeric font-semibold text-sm ${tone === "copper" ? "text-[color:var(--color-copper-700)]" : "text-[color:var(--color-navy-900)]"}`}>
        {value}
      </span>
    </div>
  );
}
