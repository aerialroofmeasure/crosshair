import { ClipboardList, Loader, CheckCircle2, Users, UserCog, Inbox } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { StatTile, ActionCard } from "@/components/portal/overview-cards";
import { getProfile } from "@/lib/profile";
import { fetchStaffOrders, fetchProfilesByRole } from "@/lib/staff";

export const metadata = { title: "Admin · Overview" };
export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [profile, orders, employees, customers] = await Promise.all([
    getProfile(),
    fetchStaffOrders({ limit: 1000 }),
    fetchProfilesByRole("employee"),
    fetchProfilesByRole("customer"),
  ]);

  const first = (profile?.full_name ?? "").split(/\s+/)[0] || "";
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
  const activeEmployees = employees.filter((e) => e.is_active).length;

  return (
    <div>
      <PageHeader
        eyebrow="Admin · Overview"
        title={first ? `Welcome back, ${first}.` : "Operations overview"}
        description="Assign work, manage your team, and keep an eye on the whole order pipeline."
      />

      {/* KPIs */}
      <div className="mt-10 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatTile label="To assign" value={String(stats.toAssign)} hint="Paid · unclaimed" icon={<Inbox className="h-4 w-4" />} accent="adm" />
        <StatTile label="Ongoing" value={String(stats.ongoing)} hint="Being worked now" icon={<Loader className="h-4 w-4" />} accent="adm" />
        <StatTile label="Delivered" value={String(stats.delivered)} hint="Lifetime reports" icon={<CheckCircle2 className="h-4 w-4" />} />
        <StatTile label="Total orders" value={String(stats.total)} hint="All time" icon={<ClipboardList className="h-4 w-4" />} />
      </div>

      <div className="mt-4 grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatTile label="Active team" value={String(activeEmployees)} hint={`${employees.length} total`} icon={<UserCog className="h-4 w-4" />} accent="adm" />
        <StatTile label="Customers" value={String(customers.length)} hint="Registered" icon={<Users className="h-4 w-4" />} />
      </div>

      {/* Quick actions */}
      <div className="mt-12">
        <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-adm-700)]">Manage</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/admin/orders"
            icon={<ClipboardList className="h-5 w-5" />}
            title="Orders"
            body="Mark orders paid, assign them to employees, and track delivery."
            cta="Open orders"
            accent="adm"
          />
          <ActionCard
            href="/admin/employees"
            icon={<UserCog className="h-5 w-5" />}
            title="Employees"
            body="Create accounts, reset passwords, enable or disable your team."
            cta="Manage team"
            accent="adm"
          />
          <ActionCard
            href="/admin/customers"
            icon={<Users className="h-5 w-5" />}
            title="Customers"
            body="See everyone who's signed up and their order activity."
            cta="View customers"
            accent="adm"
          />
        </div>
      </div>
    </div>
  );
}
