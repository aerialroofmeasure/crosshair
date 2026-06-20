import { Inbox, Loader, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";
import { StatTile, ActionCard } from "@/components/portal/overview-cards";
import { getProfile } from "@/lib/profile";
import { fetchStaffOrders } from "@/lib/staff";

export const metadata = { title: "Home · Fulfillment" };
export const dynamic = "force-dynamic";

export default async function EmployeeHomePage() {
  const profile = await getProfile();

  const [queue, ongoing, completed] = await Promise.all([
    fetchStaffOrders({ status: "paid", unassigned: true }),
    profile ? fetchStaffOrders({ status: "in_progress", assignedTo: profile.id }) : Promise.resolve([]),
    profile ? fetchStaffOrders({ status: "delivered", completedBy: profile.id }) : Promise.resolve([]),
  ]);

  const first = (profile?.full_name ?? "").split(/\s+/)[0] || "";

  return (
    <div>
      <PageHeader
        eyebrow="Fulfillment · Home"
        title={first ? `Welcome back, ${first}.` : "Your fulfillment home"}
        description="Pick up new work, finish what you've claimed, and download anything you've delivered."
      />

      {/* My numbers */}
      <div className="mt-10 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatTile label="Waiting in queue" value={String(queue.length)} hint="Available to claim" icon={<Inbox className="h-4 w-4" />} accent="emp" />
        <StatTile label="My ongoing" value={String(ongoing.length)} hint="Claimed by you" icon={<Loader className="h-4 w-4" />} accent="emp" />
        <StatTile label="My completed" value={String(completed.length)} hint="Delivered by you" icon={<CheckCircle2 className="h-4 w-4" />} />
      </div>

      {/* Quick actions */}
      <div className="mt-12">
        <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-emp-600)]">Get to work</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <ActionCard
            href="/employee/queue"
            icon={<Inbox className="h-5 w-5" />}
            title="Queue"
            body={queue.length > 0 ? `${queue.length} unassigned order${queue.length === 1 ? "" : "s"} ready to claim.` : "No unassigned orders right now."}
            cta="Pick up work"
            accent="emp"
          />
          <ActionCard
            href="/employee/ongoing"
            icon={<Loader className="h-5 w-5" />}
            title="Ongoing"
            body={ongoing.length > 0 ? `${ongoing.length} order${ongoing.length === 1 ? "" : "s"} in progress. Upload & complete.` : "Nothing in progress yet."}
            cta="Continue"
            accent="emp"
          />
          <ActionCard
            href="/employee/completed"
            icon={<CheckCircle2 className="h-5 w-5" />}
            title="Completed"
            body="Your delivered reports — re-download files anytime."
            cta="View completed"
            accent="emp"
          />
        </div>
      </div>
    </div>
  );
}
