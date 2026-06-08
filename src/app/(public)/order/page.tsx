import { Eyebrow } from "@/components/marketing/eyebrow";
import { OrderWizard } from "@/components/order/order-wizard";

export const metadata = { title: "Place an order" };

export default function OrderPage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-20 md:pt-16 md:pb-24 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">New order</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">
            Place an order in under a minute.
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/75 max-w-2xl">
            No account needed. We&apos;ll send the invoice and report to the email you provide.
          </p>
        </div>
      </section>
      <section className="-mt-12 md:-mt-14 pb-20 relative z-10">
        <div className="container-narrow">
          <OrderWizard />
        </div>
      </section>
    </>
  );
}
