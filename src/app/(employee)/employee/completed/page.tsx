import { CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";
import { OrderCard } from "@/components/employee/order-card";
import { ReportDownloads } from "@/components/portal/report-downloads";
import { fetchStaffOrders, fetchOrderFilesMap } from "@/lib/staff";
import { getProfile } from "@/lib/profile";

export const metadata = { title: "Completed · Fulfillment" };
export const dynamic = "force-dynamic";

export default async function EmployeeCompletedPage() {
  const profile = await getProfile();
  const orders = profile
    ? await fetchStaffOrders({ status: "delivered", completedBy: profile.id })
    : [];
  const filesMap = await fetchOrderFilesMap(orders.map((o) => o.id));

  return (
    <div>
      <PageHeader
        eyebrow="Completed"
        title="Delivered by you"
        description="Orders you've finished. Re-download any report you published here."
        action={
          <span className="inline-flex items-center gap-2 rounded-full neu-inset px-4 h-10 text-sm font-semibold text-[color:var(--color-emp-700)]">
            <span className="h-2 w-2 rounded-full bg-[color:var(--color-emp-500)]" />
            {orders.length} delivered
          </span>
        }
      />

      {orders.length === 0 ? (
        <div className="mt-10">
          <EmptyCard
            icon={<CheckCircle2 className="h-6 w-6" />}
            title="No completed orders yet"
            description="When you publish a report and mark an order complete, it'll appear here with its downloadable files."
          />
        </div>
      ) : (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {orders.map((o) => (
            <OrderCard
              key={o.id}
              order={o}
              meta={
                o.completed_at ? (
                  <>Delivered {new Date(o.completed_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</>
                ) : undefined
              }
              action={
                <div className="w-full pt-1">
                  <ReportDownloads files={filesMap.get(o.id) ?? []} compact />
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
