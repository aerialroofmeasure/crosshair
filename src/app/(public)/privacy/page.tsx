import { Eyebrow } from "@/components/marketing/eyebrow";

export const metadata = { title: "Privacy policy" };

export default function PrivacyPage() {
  return (
    <>
      <section className="relative bg-hero text-white pt-12 pb-14 md:pt-16 md:pb-16 overflow-hidden">
        <div className="container-page max-w-3xl relative z-10">
          <Eyebrow tone="white">Legal</Eyebrow>
          <h1 className="mt-4 text-4xl md:text-5xl font-display text-white">Privacy policy</h1>
        </div>
      </section>
      <section className="section-y">
        <div className="container-narrow space-y-6 text-[16px] leading-relaxed">
          <p className="text-[color:var(--color-stone)]">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })}</p>
          <p>
            Aerial Roof Measure (&ldquo;we&rdquo;, &ldquo;us&rdquo;) collects the minimum information needed to
            deliver your report: the property address, your name, your email address,
            and any notes you provide with the order. We don&apos;t sell personal data and
            we don&apos;t share it with third parties beyond the providers we use to operate
            the service (Supabase for account storage, Resend for email, and our payment
            processor when you pay).
          </p>
          <h2 className="text-2xl font-display pt-4">What we store</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account email and password hash (Supabase Auth).</li>
            <li>Order details, including property address and notes.</li>
            <li>Delivered report files for as long as your account is active.</li>
          </ul>
          <h2 className="text-2xl font-display pt-4">Your rights</h2>
          <p>
            You can request a copy or deletion of your data at any time by emailing
            <a href="mailto:support@aerialroofmeasure.com" className="text-[color:var(--color-copper-700)] underline ml-1">
              support@aerialroofmeasure.com
            </a>.
          </p>
        </div>
      </section>
    </>
  );
}
