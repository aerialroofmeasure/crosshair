import { Inbox } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { OrderCard } from "@/components/employee/order-card";
import { ClaimButton } from "@/components/employee/claim-button";
import { fetchStaffOrders } from "@/lib/staff";

export const metadata = { title: "Queue · Fulfillment" };
export const dynamic = "force-dynamic";

export default async function EmployeeQueuePage() {
  // Claimable pool = paid orders nobody has picked up yet.
  const orders = await fetchStaffOrders({ status: "paid", unassigned: true });

  return (
    <div>
      <PageHeader
        eyebrow="Queue"
        title="Unassigned orders"
        description="Paid orders waiting to be picked up. Claim one to move it into your ongoing work."
        action={
          <span className="inline-flex items-center gap-2 rounded-full neu-inset px-4 h-10 text-sm font-semibold text-[color:var(--color-emp-700)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-emp-500)]" />
            {orders.length} waiting
          </span>
        }
      />

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyCard
            icon={<Inbox className="h-6 w-6" />}
            title="Queue is clear"
            description="There are no unassigned orders right now. New paid orders will appear here the moment an admin marks them paid."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} action={<ClaimButton orderId={o.id} />} />
          ))}
        </div>
      )}
    </div>
  );
}
