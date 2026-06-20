import { redirect } from "next/navigation";

// /portal has no page of its own — send people to their dashboard.
// The (portal) layout already handles auth + the employee->/employee redirect.
export default function PortalIndexPage() {
  redirect("/portal/dashboard");
}
