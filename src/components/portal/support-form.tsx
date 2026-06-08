"use client";

import { useState } from "react";
import { Loader2, Check, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SupportFormProps {
  prefillName: string;
  prefillEmail: string;
  prefillCompany: string;
}

const reasons = [
  "Order issue",
  "Re-issue / accuracy",
  "Volume pricing",
  "Sample report",
  "Account / billing",
  "Other",
] as const;

export function SupportForm({ prefillName, prefillEmail, prefillCompany }: SupportFormProps) {
  const [name, setName] = useState(prefillName);
  const [email, setEmail] = useState(prefillEmail);
  const [company, setCompany] = useState(prefillCompany);
  const [reason, setReason] = useState<string>(reasons[0]);
  const [orderId, setOrderId] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "submitting" | "ok" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          subject: orderId ? `[${reason}] Order ${orderId}` : `[${reason}]`,
          message,
        }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok") {
    return (
      <div className="py-10 text-center">
        <div className="mx-auto h-14 w-14 rounded-full bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-600)] flex items-center justify-center">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-5 text-2xl font-display">Message sent.</h2>
        <p className="mt-3 text-[color:var(--color-stone)] max-w-md mx-auto">
          We&apos;ll get back to you at <strong className="text-[color:var(--color-navy-900)]">{email}</strong> within 4 business hours.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-sm font-medium text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)]"
        >
          Send another →
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Your name" value={name} onChange={setName} required />
        <Field label="Email" type="email" value={email} onChange={setEmail} required />
      </div>
      <Field label="Company (optional)" value={company} onChange={setCompany} />

      <div className="grid sm:grid-cols-2 gap-4">
        <SelectField label="Reason" value={reason} onChange={setReason} options={reasons} />
        <Field label="Order ID (if relevant)" value={orderId} onChange={setOrderId} placeholder="ARM-1024" />
      </div>

      <TextareaField label="Message" value={message} onChange={setMessage} required rows={6} />

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <p className="text-xs text-[color:var(--color-stone)]">
          We reply within 4 business hours · Mon–Fri 9am–6pm ET
        </p>
        <Button type="submit" size="lg" disabled={state === "submitting" || !name || !email || !message}>
          {state === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Sending
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Send message
            </>
          )}
        </Button>
      </div>

      {state === "error" && (
        <p className="text-sm text-red-600">
          Couldn&apos;t send. Email{" "}
          <a href="mailto:support@aerialroofmeasure.com" className="underline">
            support@aerialroofmeasure.com
          </a>{" "}
          instead.
        </p>
      )}
    </form>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
        placeholder={placeholder}
        className="w-full h-11 px-4 rounded-lg border border-[color:var(--color-border-soft)] bg-white shadow-[inset_0_1px_2px_rgba(11,30,58,0.04)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-3 rounded-lg border border-[color:var(--color-border-soft)] bg-white shadow-[inset_0_1px_2px_rgba(11,30,58,0.04)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition appearance-none"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  value,
  onChange,
  required,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
        {required && <span className="text-[color:var(--color-copper-600)]"> *</span>}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        rows={rows}
        className="w-full px-4 py-3 rounded-lg border border-[color:var(--color-border-soft)] bg-white shadow-[inset_0_1px_2px_rgba(11,30,58,0.04)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition resize-none"
      />
    </label>
  );
}
