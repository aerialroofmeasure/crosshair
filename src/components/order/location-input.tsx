"use client";

import { useState } from "react";
import { MapPin, Link2, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Mode = "type" | "link";

export interface LocationValue {
  mode: Mode;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  mapsLink?: string;
}

interface LocationInputProps {
  value?: LocationValue;
  onChange?: (v: LocationValue) => void;
}

const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL",
  "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT",
  "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI",
  "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
];

const mapsLinkRegex =
  /^https?:\/\/(www\.)?(google\.[a-z.]+\/maps|maps\.google\.[a-z.]+|maps\.app\.goo\.gl|goo\.gl\/maps)\/.+/i;

export function LocationInput({ value, onChange }: LocationInputProps) {
  const [mode, setMode] = useState<Mode>(value?.mode ?? "type");
  const [address, setAddress] = useState(
    value?.address ?? { street: "", city: "", state: "", zip: "" }
  );
  const [mapsLink, setMapsLink] = useState(value?.mapsLink ?? "");

  const linkValid = mapsLink.length === 0 || mapsLinkRegex.test(mapsLink);

  function update(next: Partial<LocationValue>) {
    const combined: LocationValue = {
      mode,
      address,
      mapsLink,
      ...next,
    };
    onChange?.(combined);
  }

  function selectMode(next: Mode) {
    setMode(next);
    update({ mode: next });
  }

  function setAddressField<K extends keyof typeof address>(key: K, val: string) {
    const next = { ...address, [key]: val };
    setAddress(next);
    update({ address: next });
  }

  return (
    <div>
      {/* Mode toggle */}
      <div
        role="tablist"
        aria-label="Choose how to enter the location"
        className="grid grid-cols-2 gap-3 p-1.5 rounded-2xl bg-[color:var(--color-warm-cream)] border border-[color:var(--color-border-soft)]"
      >
        <ModeTile
          icon={<MapPin className="h-5 w-5" />}
          label="Type address"
          hint="Street, city, state, ZIP"
          active={mode === "type"}
          onClick={() => selectMode("type")}
        />
        <ModeTile
          icon={<Link2 className="h-5 w-5" />}
          label="Paste map link"
          hint="Google Maps URL"
          active={mode === "link"}
          onClick={() => selectMode("link")}
        />
      </div>

      {/* Content */}
      <div className="mt-6">
        {mode === "type" ? (
          <div className="grid gap-4 sm:grid-cols-6">
            <Field
              label="Street address"
              value={address.street}
              onChange={(v) => setAddressField("street", v)}
              required
              className="sm:col-span-6"
              placeholder="123 Main St"
            />
            <Field
              label="City"
              value={address.city}
              onChange={(v) => setAddressField("city", v)}
              required
              className="sm:col-span-3"
              placeholder="Dallas"
            />
            <SelectField
              label="State"
              value={address.state}
              onChange={(v) => setAddressField("state", v)}
              options={US_STATES}
              required
              className="sm:col-span-1"
            />
            <Field
              label="ZIP"
              value={address.zip}
              onChange={(v) => setAddressField("zip", v.replace(/\D/g, "").slice(0, 5))}
              pattern="\d{5}"
              required
              inputMode="numeric"
              className="sm:col-span-2"
              placeholder="75201"
            />
          </div>
        ) : (
          <div>
            <label className="block">
              <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
                Google Maps link
                <span className="text-[color:var(--color-copper-600)]"> *</span>
              </span>
              <div className="relative">
                <input
                  type="url"
                  required
                  value={mapsLink}
                  onChange={(e) => {
                    setMapsLink(e.target.value);
                    update({ mapsLink: e.target.value });
                  }}
                  placeholder="https://maps.app.goo.gl/..."
                  className={cn(
                    "w-full h-12 px-4 pr-11 rounded-lg border bg-white focus:outline-none focus:ring-2 transition",
                    linkValid
                      ? "border-[color:var(--color-border-soft)] focus:border-[color:var(--color-copper-500)] focus:ring-[color:var(--color-copper-500)]/20"
                      : "border-red-300 focus:border-red-500 focus:ring-red-500/20"
                  )}
                />
                {mapsLink.length > 0 && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {linkValid ? (
                      <CheckCircle2 className="h-5 w-5 text-[color:var(--color-copper-500)]" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </label>
            <p className="mt-2 text-xs text-[color:var(--color-stone)]">
              Open the property in Google Maps, tap <strong>Share</strong>, copy the link, and paste here.
              Works with <code className="text-[color:var(--color-charcoal)]">maps.app.goo.gl</code> short links too.
            </p>
            {!linkValid && (
              <p className="mt-1 text-xs text-red-600">
                That doesn&apos;t look like a Google Maps link. Make sure you&apos;ve copied the share URL.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function ModeTile({
  icon,
  label,
  hint,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl text-left transition-all",
        active
          ? "bg-white shadow-[0_4px_16px_rgba(11,30,58,0.08)] border border-[color:var(--color-copper-300)]"
          : "border border-transparent hover:bg-white/50"
      )}
    >
      <div
        className={cn(
          "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
          active
            ? "bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)]"
            : "bg-[color:var(--color-warm-white)] text-[color:var(--color-stone)]"
        )}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className={cn("font-medium", active ? "text-[color:var(--color-navy-900)]" : "text-[color:var(--color-charcoal)]")}>
          {label}
        </div>
        <div className="text-xs text-[color:var(--color-stone)] mt-0.5">{hint}</div>
      </div>
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  pattern,
  placeholder,
  className,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  pattern?: string;
  placeholder?: string;
  className?: string;
  inputMode?: "text" | "numeric" | "email" | "tel";
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
        {required && <span className="text-[color:var(--color-copper-600)]"> *</span>}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        pattern={pattern}
        placeholder={placeholder}
        inputMode={inputMode}
        className="w-full h-12 px-4 rounded-lg border border-[color:var(--color-border-soft)] bg-white focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
        {required && <span className="text-[color:var(--color-copper-600)]"> *</span>}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-12 px-3 rounded-lg border border-[color:var(--color-border-soft)] bg-white focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition appearance-none"
      >
        <option value="">—</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}
