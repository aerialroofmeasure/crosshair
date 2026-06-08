"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationInput, type LocationValue } from "@/components/order/location-input";
import { services } from "@/lib/site-config";
import { cn } from "@/lib/utils";

const speeds = [
  { id: "standard", label: "Standard", detail: "Within 24 hours", multiplier: 1 },
  { id: "rush", label: "Rush", detail: "Within 6 hours", multiplier: 1.5 },
  { id: "express", label: "Express", detail: "Within 2 hours", multiplier: 2 },
] as const;

const formats = [
  { id: "pdf", label: "PDF" },
  { id: "esx", label: "ESX (Xactimate)" },
  { id: "xml", label: "XML" },
  { id: "bundle", label: "Bundle (all)" },
] as const;

interface OrderWizardProps {
  /** Pre-filled contact info when the user is already logged in. */
  prefill?: {
    name?: string;
    email?: string;
    company?: string;
  };
}

export function OrderWizard({ prefill }: OrderWizardProps = {}) {
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<LocationValue>({
    mode: "type",
    address: { street: "", city: "", state: "", zip: "" },
    mapsLink: "",
  });
  const [serviceSlug, setServiceSlug] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [speed, setSpeed] = useState<string>("standard");
  const [contact, setContact] = useState({
    name: prefill?.name ?? "",
    email: prefill?.email ?? "",
    company: prefill?.company ?? "",
    notes: "",
  });
  const [state, setState] = useState<"idle" | "submitting" | "ok">("idle");

  const service = services.find((s) => s.slug === serviceSlug);
  const speedDef = speeds.find((s) => s.id === speed);
  const basePrice = service?.startsAt ?? 0;
  const total = service && speedDef ? Math.round(basePrice * speedDef.multiplier) : 0;

  function next() {
    setStep((s) => Math.min(5, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    setState("submitting");
    // TODO: persist to Supabase + send invoice via Resend.
    await new Promise((r) => setTimeout(r, 700));
    setState("ok");
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-12 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-600)] flex items-center justify-center">
          <Check className="h-7 w-7" />
        </div>
        <h2 className="mt-5 text-3xl font-display">Order received.</h2>
        <p className="mt-3 text-[color:var(--color-stone)] max-w-md mx-auto">
          We&apos;ll send an invoice to <strong className="text-[color:var(--color-navy-900)]">{contact.email}</strong> within a few
          minutes and start work as soon as it&apos;s paid. Standard delivery: within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <>
      <Stepper current={step} />

      <div className="mt-10">
        {step === 1 && (
          <StepCard title="Where's the property?" description="Type the address, or paste a Google Maps link.">
            <LocationInput value={location} onChange={setLocation} />
            <Nav onNext={next} canNext={isLocationValid(location)} />
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="What kind of report?" description="Pick the structure type.">
            <div className="grid sm:grid-cols-2 gap-3">
              {services.map((s) => (
                <button
                  key={s.slug}
                  type="button"
                  onClick={() => setServiceSlug(s.slug)}
                  className={cn(
                    "text-left p-5 rounded-xl border transition-all",
                    serviceSlug === s.slug
                      ? "border-[color:var(--color-copper-500)] bg-[color:var(--color-copper-50)]/40 shadow-[0_4px_16px_rgba(11,30,58,0.06)]"
                      : "border-[color:var(--color-border-soft)] bg-white hover:border-[color:var(--color-copper-300)]"
                  )}
                >
                  <div className="font-medium text-[color:var(--color-navy-900)]">{s.name}</div>
                  <div className="mt-1 text-sm text-[color:var(--color-stone)]">{s.blurb}</div>
                  <div className="mt-3 text-xs font-numeric font-semibold text-[color:var(--color-copper-700)]">
                    From ${s.startsAt}
                  </div>
                </button>
              ))}
            </div>
            <Nav onBack={back} onNext={next} canNext={!!serviceSlug} />
          </StepCard>
        )}

        {step === 3 && (
          <StepCard title="Which format?" description="Choose how you want the report delivered.">
            <div className="grid sm:grid-cols-2 gap-3">
              {formats
                .filter((f) =>
                  service
                    ? service.deliverables.some((d) => d.toLowerCase().includes(f.id)) || f.id === "bundle"
                    : true
                )
                .map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id)}
                    className={cn(
                      "p-5 rounded-xl border transition-all text-left",
                      format === f.id
                        ? "border-[color:var(--color-copper-500)] bg-[color:var(--color-copper-50)]/40"
                        : "border-[color:var(--color-border-soft)] bg-white hover:border-[color:var(--color-copper-300)]"
                    )}
                  >
                    <div className="font-medium text-[color:var(--color-navy-900)]">{f.label}</div>
                  </button>
                ))}
            </div>
            <Nav onBack={back} onNext={next} canNext={!!format} />
          </StepCard>
        )}

        {step === 4 && (
          <StepCard title="How fast?" description="Standard, rush or express.">
            <div className="grid sm:grid-cols-3 gap-3">
              {speeds.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSpeed(s.id)}
                  className={cn(
                    "p-5 rounded-xl border text-left transition-all",
                    speed === s.id
                      ? "border-[color:var(--color-copper-500)] bg-[color:var(--color-copper-50)]/40"
                      : "border-[color:var(--color-border-soft)] bg-white hover:border-[color:var(--color-copper-300)]"
                  )}
                >
                  <div className="font-medium text-[color:var(--color-navy-900)]">{s.label}</div>
                  <div className="mt-1 text-sm text-[color:var(--color-stone)]">{s.detail}</div>
                  <div className="mt-3 text-xs font-numeric font-semibold text-[color:var(--color-copper-700)]">
                    {s.multiplier === 1 ? "Base price" : `+${Math.round((s.multiplier - 1) * 100)}%`}
                  </div>
                </button>
              ))}
            </div>
            <Nav onBack={back} onNext={next} canNext={!!speed} />
          </StepCard>
        )}

        {step === 5 && (
          <StepCard title="Review & confirm" description="Where should we send the invoice and the report?">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Your name"
                value={contact.name}
                onChange={(v) => setContact({ ...contact, name: v })}
                required
              />
              <Field
                label="Email"
                type="email"
                value={contact.email}
                onChange={(v) => setContact({ ...contact, email: v })}
                required
              />
              <Field
                label="Company (optional)"
                value={contact.company}
                onChange={(v) => setContact({ ...contact, company: v })}
                className="sm:col-span-2"
              />
              <TextareaField
                label="Notes for our team (optional)"
                value={contact.notes}
                onChange={(v) => setContact({ ...contact, notes: v })}
                className="sm:col-span-2"
              />
            </div>

            <div className="mt-6 rounded-xl bg-[color:var(--color-warm-cream)] border border-[color:var(--color-border-soft)] p-5">
              <SummaryRow label="Report" value={service?.name ?? "—"} />
              <SummaryRow label="Format" value={formats.find((f) => f.id === format)?.label ?? "—"} />
              <SummaryRow label="Delivery" value={speedDef?.detail ?? "—"} />
              <SummaryRow label="Total (estimate)" value={`$${total}`} highlight />
              <p className="mt-3 text-xs text-[color:var(--color-stone)]">
                Final price is confirmed on invoice. Complex structures may carry a small premium —
                we&apos;ll confirm before charging.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={back}
                className="text-sm font-medium text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)] transition"
              >
                ← Back
              </button>
              <Button
                onClick={submit}
                size="lg"
                disabled={state === "submitting" || !contact.name || !contact.email}
              >
                {state === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Submitting
                  </>
                ) : (
                  <>
                    Confirm order
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </StepCard>
        )}
      </div>
    </>
  );
}

function isLocationValid(loc: LocationValue) {
  if (loc.mode === "type") {
    const a = loc.address!;
    return Boolean(a.street && a.city && a.state && /^\d{5}$/.test(a.zip));
  }
  return Boolean(loc.mapsLink && loc.mapsLink.startsWith("http"));
}

function Stepper({ current }: { current: number }) {
  const labels = ["Property", "Report", "Format", "Speed", "Confirm"];
  return (
    <ol className="grid grid-cols-5 gap-3">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        return (
          <li key={l} className="flex items-center gap-2">
            <span
              className={cn(
                "h-7 w-7 rounded-full text-xs font-numeric font-semibold flex items-center justify-center flex-shrink-0",
                done
                  ? "bg-[color:var(--color-copper-500)] text-white"
                  : active
                  ? "bg-[color:var(--color-navy-900)] text-white"
                  : "bg-[color:var(--color-warm-cream)] text-[color:var(--color-stone)]"
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : n}
            </span>
            <span
              className={cn(
                "text-xs font-medium hidden sm:block",
                active
                  ? "text-[color:var(--color-navy-900)]"
                  : done
                  ? "text-[color:var(--color-copper-600)]"
                  : "text-[color:var(--color-stone)]"
              )}
            >
              {l}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function StepCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-7 md:p-10">
      <h2 className="text-2xl md:text-3xl font-display">{title}</h2>
      <p className="mt-2 text-[color:var(--color-stone)]">{description}</p>
      <div className="mt-7">{children}</div>
    </div>
  );
}

function Nav({
  onBack,
  onNext,
  canNext,
}: {
  onBack?: () => void;
  onNext: () => void;
  canNext: boolean;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      {onBack ? (
        <button
          onClick={onBack}
          className="text-sm font-medium text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)] transition"
        >
          ← Back
        </button>
      ) : (
        <span />
      )}
      <Button onClick={onNext} disabled={!canNext} size="md">
        Continue
        <ArrowRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex justify-between py-2 border-b border-[color:var(--color-border-soft)] last:border-0",
        highlight && "pt-3 mt-1 border-t border-[color:var(--color-border-soft)]"
      )}
    >
      <span className="text-sm text-[color:var(--color-stone)]">{label}</span>
      <span
        className={cn(
          "text-sm font-medium",
          highlight
            ? "font-numeric text-lg text-[color:var(--color-navy-900)]"
            : "text-[color:var(--color-charcoal)]"
        )}
      >
        {value}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
        {required && <span className="text-[color:var(--color-copper-600)]"> *</span>}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-12 px-4 rounded-lg border border-[color:var(--color-border-soft)] bg-white shadow-[inset_0_1px_2px_rgba(11,30,58,0.04)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition"
      />
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 rounded-lg border border-[color:var(--color-border-soft)] bg-white shadow-[inset_0_1px_2px_rgba(11,30,58,0.04)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition resize-none"
      />
    </label>
  );
}
