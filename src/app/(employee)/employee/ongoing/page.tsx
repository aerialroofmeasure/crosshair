import { Loader } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { OrderCard } from "@/components/employee/order-card";
import { CompleteOrder } from "@/components/employee/complete-order";
import { fetchStaffOrders } from "@/lib/staff";
import { getProfile } from "@/lib/profile";

export const metadata = { title: "Ongoing · Fulfillment" };
export const dynamic = "force-dynamic";

export default async function EmployeeOngoingPage() {
  const profile = await getProfile();
  const orders = profile
    ? await fetchStaffOrders({ status: "in_progress", assignedTo: profile.id })
    : [];

  return (
    <div>
      <PageHeader
        eyebrow="Ongoing"
        title="Your active orders"
        description="Orders you've claimed. Upload the requested report files, then mark each one complete."
        action={
          <span className="inline-flex items-center gap-2 rounded-full neu-inset px-4 h-10 text-sm font-semibold text-[color:var(--color-emp-700)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-emp-500)]" />
            {orders.length} in progress
          </span>
        }
      />

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyCard
            icon={<Loader className="h-6 w-6" />}
            title="Nothing in progress"
            description="Head to the Queue and claim an unassigned order to start working on it."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              meta={
                o.assigned_at ? (
                  <>Claimed {new Date(o.assigned_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</>
                ) : undefined
              }
              action={<CompleteOrder orderId={o.id} format={o.format} />}
            />
          ))}
        </div>
      )}
    </div>
  );
}
