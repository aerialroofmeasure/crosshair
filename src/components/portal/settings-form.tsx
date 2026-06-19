"use client";

import { useState } from "react";
import { Loader2, Check, Mail, KeyRound, Bell, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface SettingsFormProps {
  initialEmail: string;
  initialName: string;
  initialCompany: string;
}

export function SettingsForm({ initialEmail, initialName, initialCompany }: SettingsFormProps) {
  return (
    <div className="space-y-8">
      <ProfileSection initialName={initialName} initialCompany={initialCompany} initialEmail={initialEmail} />
      <PasswordSection />
      <NotificationsSection />
      <DangerSection />
    </div>
  );
}

/* ---------------- Profile ---------------- */

function ProfileSection({
  initialEmail,
  initialName,
  initialCompany,
}: {
  initialEmail: string;
  initialName: string;
  initialCompany: string;
}) {
  const [name, setName] = useState(initialName);
  const [company, setCompany] = useState(initialCompany);
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setState("saving");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        data: { full_name: name, company },
      });
      if (error) throw error;
      setState("ok");
      setTimeout(() => setState("idle"), 2200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <Card icon={<Mail className="h-4 w-4" />} title="Profile" description="How your name appears on invoices and report delivery emails.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Full name" value={name} onChange={setName} />
        <Field label="Company (optional)" value={company} onChange={setCompany} />
        <Field label="Work email" value={initialEmail} disabled className="sm:col-span-2" hint="Email changes require verification — contact support." />
      </div>
      <div className="mt-6 flex items-center justify-between">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {state === "ok" && (
          <p className="text-sm text-[color:var(--color-copper-700)] flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" /> Saved
          </p>
        )}
        {state !== "ok" && !error && <span />}
        <Button onClick={save} size="md" disabled={state === "saving"}>
          {state === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Saving
            </>
          ) : (
            "Save changes"
          )}
        </Button>
      </div>
    </Card>
  );
}

/* ---------------- Password ---------------- */

function PasswordSection() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function update() {
    if (pw.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (pw !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setState("saving");
    setError(null);
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) throw error;
      setState("ok");
      setPw("");
      setConfirm("");
      setTimeout(() => setState("idle"), 2200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <Card icon={<KeyRound className="h-4 w-4" />} title="Password" description="Use 8+ characters. We'll sign you out on other devices after this change.">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="New password" type="password" value={pw} onChange={setPw} />
        <Field label="Confirm password" type="password" value={confirm} onChange={setConfirm} />
      </div>
      <div className="mt-6 flex items-center justify-between">
        {error && <p className="text-sm text-red-600">{error}</p>}
        {state === "ok" && (
          <p className="text-sm text-[color:var(--color-copper-700)] flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5" /> Password updated
          </p>
        )}
        {state !== "ok" && !error && <span />}
        <Button onClick={update} size="md" disabled={state === "saving" || !pw || !confirm}>
          {state === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Updating
            </>
          ) : (
            "Update password"
          )}
        </Button>
      </div>
    </Card>
  );
}

/* ---------------- Notifications ---------------- */

function NotificationsSection() {
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [productNews, setProductNews] = useState(false);
  const [tips, setTips] = useState(false);

  return (
    <Card icon={<Bell className="h-4 w-4" />} title="Email preferences" description="What we'll send to your inbox.">
      <div className="space-y-3">
        <Toggle
          checked={orderUpdates}
          onChange={setOrderUpdates}
          label="Order status updates"
          hint="Confirmation, ready-for-delivery, and re-issue notifications."
        />
        <Toggle
          checked={productNews}
          onChange={setProductNews}
          label="Product updates"
          hint="New report types and platform improvements. Very low volume."
        />
        <Toggle
          checked={tips}
          onChange={setTips}
          label="Tips for contractors and adjusters"
          hint="Occasional posts on Xactimate workflows and estimating speed."
        />
      </div>
    </Card>
  );
}

/* ---------------- Danger zone ---------------- */

function DangerSection() {
  return (
    <Card
      icon={<AlertTriangle className="h-4 w-4" />}
      title="Danger zone"
      description="Permanently delete your account and all associated data."
      danger
    >
      <p className="text-sm text-[color:var(--color-stone)] leading-relaxed">
        Deleting your account removes your profile, order history, and saved properties.
        Delivered report files remain available for one year per our retention policy.
        This action cannot be undone.
      </p>
      <div className="mt-5">
        <button className="inline-flex items-center px-4 py-2 rounded-lg border border-red-300 text-red-700 text-sm font-medium hover:bg-red-50 transition">
          Delete account
        </button>
      </div>
    </Card>
  );
}

/* ---------------- Primitives ---------------- */

function Card({
  icon,
  title,
  description,
  children,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <section className={cn("neu-card p-7 md:p-8", danger && "ring-1 ring-red-200")}>
      <div className="flex items-start gap-3 pb-5 border-b border-[color:var(--color-border-soft)]">
        <div
          className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0",
            danger
              ? "bg-red-50 text-red-600"
              : "bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)]"
          )}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-lg font-display">{title}</h2>
          <p className="text-sm text-[color:var(--color-stone)]">{description}</p>
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  disabled,
  className,
  hint,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
  className?: string;
  hint?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className="w-full h-11 px-4 rounded-lg neu-inset border-none text-[color:var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/30 transition disabled:text-[color:var(--color-stone)] disabled:cursor-not-allowed"
      />
      {hint && <span className="mt-1.5 block text-xs text-[color:var(--color-stone)]">{hint}</span>}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="w-full flex items-start gap-4 p-4 rounded-xl border border-[color:var(--color-border-soft)] hover:bg-[color:var(--color-warm-cream)]/30 transition text-left"
    >
      <span
        className={cn(
          "mt-0.5 relative inline-flex h-6 w-11 rounded-full transition-colors flex-shrink-0",
          checked ? "bg-[color:var(--color-copper-500)]" : "bg-[color:var(--color-warm-cream)] border border-[color:var(--color-border-soft)]"
        )}
        aria-hidden
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
            checked ? "left-[22px]" : "left-0.5"
          )}
        />
      </span>
      <span className="flex-1">
        <span className="block text-sm font-medium text-[color:var(--color-navy-900)]">{label}</span>
        <span className="block text-xs text-[color:var(--color-stone)] mt-0.5">{hint}</span>
      </span>
    </button>
  );
}
