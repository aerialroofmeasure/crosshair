import { ArrowRight, FolderOpen, Search, FilePlus, Filter } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHeader } from "@/components/portal/page-header";
import { EmptyCard } from "@/components/portal/empty-card";

export const metadata = { title: "Orders" };

export default function OrdersPage() {
  // No orders yet — will become a real list when DB is wired.
  const orders: { id: string; address: string; type: string; status: string; date: string }[] = [];

  return (
    <div>
      <PageHeader
        eyebrow="Orders"
        title="All your orders"
        description="Status, ETAs, download links and re-issue requests — all in one place."
        action={
          <ButtonLink href="/portal/orders/new" size="md">
            <FilePlus className="h-4 w-4" />
            New order
          </ButtonLink>
        }
      />

      {/* Filter / search bar — visually present even when empty so the
          shape of the page is set for when orders arrive. */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-xl">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[color:var(--color-stone)]" />
          <input
            type="text"
            placeholder="Search by address, order ID, or report type"
            disabled
            className="w-full h-11 pl-10 pr-4 rounded-lg border border-[color:var(--color-border-soft)] bg-white text-sm shadow-[inset_0_1px_2px_rgba(11,30,58,0.04)] disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>
        <button
          disabled
          className="inline-flex items-center gap-2 h-11 px-4 rounded-lg border border-[color:var(--color-border-soft)] bg-white text-sm font-medium text-[color:var(--color-charcoal)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Filter className="h-4 w-4" />
          All statuses
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-8">
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
        <div className="mt-8 rounded-2xl border border-[color:var(--color-border-soft)] bg-white overflow-hidden">
          {/* Future: order rows */}
        </div>
      )}
    </div>
  );
}
