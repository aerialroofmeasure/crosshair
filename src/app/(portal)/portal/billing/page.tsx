import Link from "next/link";
import { CreditCard, Receipt, Download, ArrowRight, Building2 } from "lucide-react";
import { PageHeader } from "@/components/portal/page-header";

export const metadata = { title: "Billing" };

export default function BillingPage() {
  const invoices: { id: string; date: string; amount: number; status: string }[] = [];

  return (
    <div>
      <PageHeader
        eyebrow="Billing"
        title="Invoices & payment methods"
        description="Pay by ACH or card. Invoices are emailed when each order is confirmed."
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Invoices section */}
        <div>
          <div className="flex items-end justify-between mb-4">
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
              Invoices
            </h2>
            <span className="text-xs text-[color:var(--color-stone)]">
              {invoices.length} total
            </span>
          </div>

          {invoices.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[color:var(--color-border-soft)] bg-white p-10 text-center">
              <div className="mx-auto h-12 w-12 rounded-xl bg-[color:var(--color-warm-cream)] text-[color:var(--color-copper-700)] flex items-center justify-center">
                <Receipt className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-display">No invoices yet</h3>
              <p className="mt-2 text-sm text-[color:var(--color-stone)] max-w-xs mx-auto">
                Your invoices and receipts will appear here after your first order.
              </p>
              <Link
                href="/portal/orders/new"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)] transition"
              >
                Place an order
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white overflow-hidden">
              <table className="w-full">
                <thead className="bg-[color:var(--color-warm-cream)]/40 text-xs uppercase tracking-[0.12em] text-[color:var(--color-stone)]">
                  <tr>
                    <th className="text-left px-5 py-3 font-semibold">Invoice</th>
                    <th className="text-left px-5 py-3 font-semibold">Date</th>
                    <th className="text-right px-5 py-3 font-semibold">Amount</th>
                    <th className="text-right px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="border-t border-[color:var(--color-border-soft)] text-sm">
                      <td className="px-5 py-4 font-numeric text-[color:var(--color-navy-900)]">{inv.id}</td>
                      <td className="px-5 py-4 text-[color:var(--color-stone)]">{inv.date}</td>
                      <td className="px-5 py-4 text-right font-numeric font-semibold">${inv.amount}</td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center text-xs font-semibold text-[color:var(--color-copper-700)]">{inv.status}</span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button className="inline-flex items-center gap-1 text-xs text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)] transition">
                          <Download className="h-3.5 w-3.5" />
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Payment methods sidebar */}
        <aside className="space-y-4">
          <div>
            <h2 className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)] mb-4">
              Payment methods
            </h2>

            <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center">
                  <Building2 className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[color:var(--color-navy-900)]">ACH transfer</div>
                  <div className="text-xs text-[color:var(--color-stone)]">Free · 1–2 business days</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-[color:var(--color-stone)] leading-relaxed">
                US contractors can pay by ACH directly from any business bank account.
                Details included on every invoice.
              </p>
            </div>

            <div className="mt-3 rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[color:var(--color-warm-cream)] text-[color:var(--color-copper-700)] flex items-center justify-center">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-[color:var(--color-navy-900)]">Credit / debit card</div>
                  <div className="text-xs text-[color:var(--color-stone)]">Instant · 2.9% fee</div>
                </div>
              </div>
              <p className="mt-3 text-xs text-[color:var(--color-stone)] leading-relaxed">
                Pay any invoice instantly via the secure link in the email.
              </p>
            </div>
          </div>

          <div className="rounded-2xl bg-[color:var(--color-warm-cream)]/40 border border-[color:var(--color-border-soft)] p-5">
            <p className="text-xs font-semibold tracking-[0.12em] uppercase text-[color:var(--color-copper-600)]">
              Volume pricing?
            </p>
            <p className="mt-2 text-[13px] text-[color:var(--color-charcoal)] leading-relaxed">
              5+ orders per week qualifies for a volume rate.
            </p>
            <Link
              href="/contact"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[color:var(--color-copper-700)] hover:text-[color:var(--color-copper-600)]"
            >
              Talk to us
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
