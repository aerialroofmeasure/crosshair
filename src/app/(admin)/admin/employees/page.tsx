import { PageHeader } from "@/components/portal/page-header";
import { EmployeeManager, type EmployeeRow } from "@/components/admin/employee-manager";
import { fetchProfilesByRole, fetchStaffOrders, displayName } from "@/lib/staff";

export const metadata = { title: "Admin · Employees" };
export const dynamic = "force-dynamic";

export default async function AdminEmployeesPage() {
  const [employees, ongoing, delivered] = await Promise.all([
    fetchProfilesByRole("employee"),
    fetchStaffOrders({ status: "in_progress", limit: 500 }),
    fetchStaffOrders({ status: "delivered", limit: 1000 }),
  ]);

  const ongoingBy = new Map<string, number>();
  for (const o of ongoing) if (o.assigned_to) ongoingBy.set(o.assigned_to, (ongoingBy.get(o.assigned_to) ?? 0) + 1);
  const completedBy = new Map<string, number>();
  for (const o of delivered) if (o.completed_by) completedBy.set(o.completed_by, (completedBy.get(o.completed_by) ?? 0) + 1);

  const rows: EmployeeRow[] = employees.map((e) => ({
    id: e.id,
    name: displayName(e, ""),
    email: e.email,
    is_active: e.is_active,
    created_at: e.created_at,
    ongoing: ongoingBy.get(e.id) ?? 0,
    completed: completedBy.get(e.id) ?? 0,
  }));

  const activeCount = rows.filter((r) => r.is_active).length;

  return (
    <div>
      <PageHeader
        eyebrow="Admin"
        title="Employees"
        description="Create accounts, reset passwords, and enable or disable your fulfillment team."
        action={
          <span className="inline-flex items-center gap-2 rounded-full neu-inset px-4 h-10 text-sm font-semibold text-[color:var(--color-navy-900)]">
            {activeCount} active · {rows.length} total
          </span>
        }
      />

      <div className="mt-10 max-w-4xl">
        <EmployeeManager employees={rows} />
      </div>
    </div>
  );
}
