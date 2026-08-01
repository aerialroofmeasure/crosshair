"use client";

import { useState } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationInput, type LocationValue } from "@/components/order/location-input";
import { services } from "@/lib/site-config";
import { FORMAT_LABELS } from "@/lib/orders";
import { cn } from "@/lib/utils";

const speeds = [
  { id: "standard", label: "Standard", detail: "Within 24 hours", multiplier: 1 },
  { id: "rush", label: "Rush", detail: "Within 2–4 hours", multiplier: 1.5 },
] as const;

interface OrderWizardProps {
  /** Pre-filled contact info when the user is already logged in. */
  prefill?: {
    name?: string;
    email?: string;
    company?: string;
  };
  /** Deep-link pre-selection from the services pages (?service=&format=). */
  initialService?: string;
  initialFormat?: string;
}

export function OrderWizard({ prefill, initialService, initialFormat }: OrderWizardProps = {}) {
  const presetService = initialService && services.some((s) => s.slug === initialService) ? initialService : "";
  const presetFormat = (() => {
    if (!presetService || !initialFormat) return "";
    const svc = services.find((s) => s.slug === presetService);
    return svc && svc.prices[initialFormat] != null ? initialFormat : "";
  })();

  const [step, setStep] = useState(1);
  const [location, setLocation] = useState<LocationValue>({
    mode: "type",
    address: { street: "", city: "", state: "", zip: "" },
    mapsLink: "",
  });
  const [serviceSlug, setServiceSlug] = useState<string>(presetService);
  const [format, setFormat] = useState<string>(presetFormat);
  const [speed, setSpeed] = useState<string>("standard");
  const [contact, setContact] = useState({
    name: prefill?.name ?? "",
    email: prefill?.email ?? "",
    company: prefill?.company ?? "",
    notes: "",
  });
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState<string | null>(null);

  const service = services.find((s) => s.slug === serviceSlug);
  const speedDef = speeds.find((s) => s.id === speed);
  // Unit price = the chosen format's price (falls back to the service's lowest).
  const unit = service
    ? format && service.prices[format] != null
      ? service.prices[format]
      : service.startsAt
    : 0;
  const total = service && speedDef ? Math.round(unit * speedDef.multiplier) : 0;

  // Per-step completeness — derived purely from state so navigation can never
  // land on a step whose prerequisites aren't satisfied.
  const step1Valid = !!serviceSlug && !!format && !!speed;
  const step2Valid = isLocationValid(location);

  // A step is reachable only when every step before it is complete. Jumping
  // backwards is therefore always allowed; jumping forward requires the
  // in-between steps to be valid.
  function canReach(target: number) {
    if (target === 1) return true;
    if (target === 2) return step1Valid;
    if (target === 3) return step1Valid && step2Valid;
    return false;
  }

  function goTo(target: number) {
    if (target !== step && canReach(target)) setStep(target);
  }

  function next() {
    setStep((s) => Math.min(3, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function submit() {
    setState("submitting");
    setErrorMsg(null);
    try {
      const payload = {
        customer_name: contact.name,
        customer_email: contact.email,
        customer_company: contact.company || undefined,
        notes: contact.notes || undefined,
        location_mode: location.mode,
        street: location.address?.street,
        city: location.address?.city,
        state: location.address?.state,
        zip: location.address?.zip,
        maps_link: location.mapsLink,
        service_slug: serviceSlug,
        format,
        speed,
      };
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Couldn't place your order.");
      setOrderRef(data.ref);
      setState("ok");
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "Something went wrong. Try again.");
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-12 text-center relative overflow-hidden">
        <div aria-hidden className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[color:var(--color-copper-400)]/10 blur-3xl pointer-events-none" />
        <div className="relative">
          <div className="mx-auto h-16 w-16 rounded-full bg-[color:var(--color-copper-500)] text-white flex items-center justify-center shadow-[0_10px_24px_-6px_rgba(201,137,47,0.45)]">
            <Check className="h-7 w-7" strokeWidth={3} />
          </div>
          {orderRef && (
            <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-warm-cream)] border border-[color:var(--color-border-soft)] px-3 py-1 text-xs font-numeric font-semibold text-[color:var(--color-navy-900)]">
              Order {orderRef}
            </div>
          )}
          <h2 className="mt-4 text-3xl md:text-4xl font-display">Order received.</h2>
          <p className="mt-3 text-[color:var(--color-stone)] max-w-md mx-auto leading-relaxed">
            We&apos;ll send an invoice to{" "}
            <strong className="text-[color:var(--color-navy-900)]">{contact.email}</strong>{" "}
            within a few minutes and start work as soon as it&apos;s paid.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Stepper current={step} canReach={canReach} onNavigate={goTo} />

      <div className="mt-10">
        {step === 1 && (
          <StepCard title="Your report" description="Choose the report type, format and turnaround — all in one step.">
            {/* Report type */}
            <div>
              <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)] mb-3">Report type</div>
              <div className="grid sm:grid-cols-2 gap-3">
                {services.map((s) => (
                  <button
                    key={s.slug}
                    type="button"
                    onClick={() => {
                      setServiceSlug(s.slug);
                      setFormat("");
                    }}
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
            </div>

            {/* Format — revealed once a report type is chosen */}
            {service && (
              <div className="mt-8">
                <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)] mb-3">Format</div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {Object.entries(service.prices).map(([id, price]) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setFormat(id)}
                      className={cn(
                        "p-5 rounded-xl border transition-all text-left flex items-center justify-between gap-3",
                        format === id
                          ? "border-[color:var(--color-copper-500)] bg-[color:var(--color-copper-50)]/40"
                          : "border-[color:var(--color-border-soft)] bg-white hover:border-[color:var(--color-copper-300)]"
                      )}
                    >
                      <span className="font-medium text-[color:var(--color-navy-900)]">{FORMAT_LABELS[id] ?? id}</span>
                      <span className="font-numeric font-semibold text-[color:var(--color-copper-700)]">${price}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Turnaround — revealed once a format is chosen */}
            {service && format && (
              <div className="mt-8">
                <div className="text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-stone)] mb-3">Turnaround</div>
                <div className="grid sm:grid-cols-2 gap-3">
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
              </div>
            )}

            {/* Running total */}
            {service && format && (
              <div className="mt-6 flex items-center justify-between rounded-xl bg-[color:var(--color-warm-cream)] border border-[color:var(--color-border-soft)] px-5 py-3">
                <span className="text-sm text-[color:var(--color-stone)]">Estimated total</span>
                <span className="font-numeric font-bold text-lg text-[color:var(--color-navy-900)]">${total}</span>
              </div>
            )}

            <Nav onNext={next} canNext={!!serviceSlug && !!format && !!speed} />
          </StepCard>
        )}

        {step === 2 && (
          <StepCard title="Where's the property?" description="Type the address, or paste a Google or Apple Maps link.">
            <LocationInput value={location} onChange={setLocation} />
            <Nav onBack={back} onNext={next} canNext={isLocationValid(location)} />
          </StepCard>
        )}

        {step === 3 && (
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
              <SummaryRow label="Format" value={format ? (FORMAT_LABELS[format] ?? format) : "—"} />
              <SummaryRow label="Delivery" value={speedDef?.detail ?? "—"} />
              <SummaryRow label="Total (estimate)" value={`$${total}`} highlight />
              <p className="mt-3 text-xs text-[color:var(--color-stone)]">
                Final price is confirmed on invoice. Complex structures may carry a small premium —
                we&apos;ll confirm before charging.
              </p>
            </div>

            {state === "error" && errorMsg && (
              <div className="mt-4 text-sm rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
                {errorMsg}
              </div>
            )}

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

function Stepper({
  current,
  canReach,
  onNavigate,
}: {
  current: number;
  canReach: (n: number) => boolean;
  onNavigate: (n: number) => void;
}) {
  // Sits over the dark hero, so everything is styled for a dark background.
  const labels = ["Report", "Property", "Confirm"];
  return (
    <ol className="grid grid-cols-3 gap-3">
      {labels.map((l, i) => {
        const n = i + 1;
        const active = n === current;
        const done = n < current;
        // Reachable and not the current step → let the user jump straight to it.
        const clickable = !active && canReach(n);
        return (
          <li key={l}>
            <button
              type="button"
              onClick={() => clickable && onNavigate(n)}
              disabled={!clickable}
              aria-current={active ? "step" : undefined}
              aria-label={`Step ${n}: ${l}${clickable ? " — edit" : ""}`}
              className={cn(
                "group/step flex w-full items-center gap-2 rounded-lg -mx-1.5 px-1.5 py-1 transition-colors",
                clickable
                  ? "cursor-pointer hover:bg-white/10"
                  : "cursor-default"
              )}
            >
              <span
                className={cn(
                  "h-7 w-7 rounded-full text-xs font-numeric font-semibold flex items-center justify-center flex-shrink-0 transition-colors",
                  done
                    ? "bg-[color:var(--color-copper-500)] text-white group-hover/step:bg-[color:var(--color-copper-400)]"
                    : active
                    ? "bg-white text-[color:var(--color-navy-900)] shadow-[0_2px_10px_rgba(0,0,0,0.25)]"
                    : "bg-white/12 text-white/80 ring-1 ring-white/20"
                )}
              >
                {done ? <Check className="h-3.5 w-3.5" /> : n}
              </span>
              <span
                className={cn(
                  "text-xs font-medium hidden sm:block transition-colors",
                  active
                    ? "text-white"
                    : done
                    ? "text-[color:var(--color-copper-300)] group-hover/step:text-[color:var(--color-copper-200)]"
                    : "text-white/55"
                )}
              >
                {l}
              </span>
            </button>
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
