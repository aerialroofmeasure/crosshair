"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  UserPlus,
  Loader2,
  Check,
  AlertCircle,
  KeyRound,
  Pencil,
  Power,
  Copy,
  RefreshCw,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface EmployeeRow {
  id: string;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  ongoing: number;
  completed: number;
}

function randomPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export function EmployeeManager({ employees }: { employees: EmployeeRow[] }) {
  return (
    <div className="space-y-6">
      <CreateEmployee />
      {employees.length === 0 ? (
        <div className="neu-inset rounded-2xl px-6 py-10 text-center text-sm text-[color:var(--color-stone)]">
          No employees yet. Add your first one above — they can sign in right away with the temporary password.
        </div>
      ) : (
        <div className="grid gap-4">
          {employees.map((e) => (
            <EmployeeCard key={e.id} employee={e} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Create ---------------- */

function CreateEmployee() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState(randomPassword());
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  function reset() {
    setEmail("");
    setName("");
    setPassword(randomPassword());
    setError(null);
  }

  function submit() {
    setError(null);
    setDone(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/employees", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, full_name: name, password }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Couldn't create the employee.");
        }
        setDone(`${email} created. Share the temporary password: ${password}`);
        reset();
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't create the employee.");
      }
    });
  }

  if (!open) {
    return (
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-[color:var(--color-stone)]">
          {done ? (
            <span className="inline-flex items-center gap-1.5 text-[color:var(--color-copper-700)]">
              <Check className="h-4 w-4" /> {done}
            </span>
          ) : (
            "Create accounts for your fulfillment team."
          )}
        </p>
        <button
          onClick={() => { setOpen(true); setDone(null); }}
          className="neu-btn hover:neu-btn-hover active:neu-btn-active inline-flex items-center gap-2 rounded-full px-5 h-11 text-sm font-medium text-[color:var(--color-navy-900)]"
        >
          <UserPlus className="h-4 w-4 text-[color:var(--color-copper-600)]" />
          Add employee
        </button>
      </div>
    );
  }

  return (
    <div className="neu-card p-6 md:p-7">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-display">New employee</h2>
        <button onClick={() => { setOpen(false); reset(); }} className="p-1.5 rounded-lg text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)]" aria-label="Close">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-5 grid sm:grid-cols-2 gap-4">
        <Labeled label="Full name">
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Jordan Vega" />
        </Labeled>
        <Labeled label="Work email">
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" className={inputCls} placeholder="jordan@aerialroofmeasure.com" />
        </Labeled>
      </div>

      <Labeled label="Temporary password" className="mt-4">
        <div className="flex items-center gap-2">
          <input value={password} onChange={(e) => setPassword(e.target.value)} className={cn(inputCls, "font-numeric")} />
          <IconBtn title="Regenerate" onClick={() => setPassword(randomPassword())}>
            <RefreshCw className="h-4 w-4" />
          </IconBtn>
          <IconBtn title="Copy" onClick={() => navigator.clipboard?.writeText(password)}>
            <Copy className="h-4 w-4" />
          </IconBtn>
        </div>
        <span className="mt-1.5 block text-xs text-[color:var(--color-stone)]">Share this with the employee — they can change it after signing in.</span>
      </Labeled>

      {error && (
        <p className="mt-4 inline-flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" /> {error}
        </p>
      )}

      <div className="mt-5 flex items-center justify-end gap-2">
        <button onClick={() => { setOpen(false); reset(); }} className="px-4 h-11 rounded-full text-sm font-medium text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)]">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={pending || !email || password.length < 8}
          className="inline-flex items-center gap-2 rounded-full px-5 h-11 text-sm font-medium text-white bg-[color:var(--color-copper-500)] hover:bg-[color:var(--color-copper-600)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          {pending ? "Creating…" : "Create employee"}
        </button>
      </div>
    </div>
  );
}

/* ---------------- Row ---------------- */

function EmployeeCard({ employee: e }: { employee: EmployeeRow }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [panel, setPanel] = useState<null | "rename" | "password">(null);
  const [renameValue, setRenameValue] = useState(e.name);
  const [pwValue, setPwValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function act(payload: Record<string, unknown>) {
    setError(null);
    setOk(false);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/employees", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: e.id, ...payload }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Couldn't update.");
        }
        setOk(true);
        setPanel(null);
        setPwValue("");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Couldn't update.");
      }
    });
  }

  return (
    <div className={cn("neu-card p-5", !e.is_active && "opacity-75")}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[color:var(--color-copper-400)] to-[color:var(--color-copper-700)] flex items-center justify-center text-sm font-semibold text-white flex-shrink-0">
            {(e.name || e.email).slice(0, 2).toUpperCase()}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-medium text-[color:var(--color-navy-900)] truncate">{e.name || "—"}</span>
              <StatusDot active={e.is_active} />
            </div>
            <div className="text-xs text-[color:var(--color-stone)] truncate">{e.email}</div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Metric label="Ongoing" value={e.ongoing} />
          <Metric label="Completed" value={e.completed} />
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-[color:var(--color-border-soft)] flex flex-wrap items-center gap-2">
        <RowBtn onClick={() => setPanel(panel === "rename" ? null : "rename")} icon={<Pencil className="h-3.5 w-3.5" />}>Rename</RowBtn>
        <RowBtn onClick={() => setPanel(panel === "password" ? null : "password")} icon={<KeyRound className="h-3.5 w-3.5" />}>Reset password</RowBtn>
        <RowBtn
          onClick={() => act({ action: e.is_active ? "disable" : "enable" })}
          icon={<Power className="h-3.5 w-3.5" />}
          tone={e.is_active ? "danger" : "ok"}
        >
          {e.is_active ? "Disable" : "Enable"}
        </RowBtn>
        {pending && <Loader2 className="h-4 w-4 animate-spin text-[color:var(--color-stone)]" />}
        {ok && !panel && <Check className="h-4 w-4 text-[color:var(--color-copper-600)]" />}
      </div>

      {panel === "rename" && (
        <InlinePanel
          value={renameValue}
          onChange={setRenameValue}
          placeholder="Full name"
          onSubmit={() => act({ action: "rename", full_name: renameValue })}
          submitLabel="Save name"
          pending={pending}
        />
      )}
      {panel === "password" && (
        <InlinePanel
          value={pwValue}
          onChange={setPwValue}
          placeholder="New temporary password (8+ chars)"
          onSubmit={() => act({ action: "reset_password", password: pwValue })}
          submitLabel="Set password"
          pending={pending}
          mono
        />
      )}

      {error && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

/* ---------------- Primitives ---------------- */

const inputCls =
  "w-full h-11 px-4 rounded-lg neu-inset border-none text-[color:var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/30 transition";

function Labeled({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={cn("block", className)}>
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">{label}</span>
      {children}
    </label>
  );
}

function IconBtn({ children, onClick, title }: { children: React.ReactNode; onClick: () => void; title: string }) {
  return (
    <button type="button" onClick={onClick} title={title} className="neu-btn hover:neu-btn-hover active:neu-btn-active h-11 w-11 rounded-lg flex items-center justify-center text-[color:var(--color-copper-700)] flex-shrink-0">
      {children}
    </button>
  );
}

function RowBtn({
  children,
  onClick,
  icon,
  tone = "neutral",
}: {
  children: React.ReactNode;
  onClick: () => void;
  icon: React.ReactNode;
  tone?: "neutral" | "danger" | "ok";
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3.5 h-9 text-xs font-medium neu-btn hover:neu-btn-hover active:neu-btn-active",
        tone === "danger" && "text-red-600",
        tone === "ok" && "text-[color:var(--color-copper-700)]",
        tone === "neutral" && "text-[color:var(--color-charcoal)]"
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function InlinePanel({
  value,
  onChange,
  onSubmit,
  placeholder,
  submitLabel,
  pending,
  mono,
}: {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  placeholder: string;
  submitLabel: string;
  pending: boolean;
  mono?: boolean;
}) {
  return (
    <div className="mt-3 flex flex-col sm:flex-row gap-2">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputCls, mono && "font-numeric")}
      />
      <button
        onClick={onSubmit}
        disabled={pending || !value}
        className="inline-flex items-center justify-center gap-2 rounded-lg px-5 h-11 text-sm font-medium text-white bg-[color:var(--color-navy-900)] hover:bg-[color:var(--color-navy-800)] disabled:opacity-50 disabled:pointer-events-none flex-shrink-0"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {submitLabel}
      </button>
    </div>
  );
}

function StatusDot({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
        active ? "bg-[color:var(--color-copper-500)]/15 text-[color:var(--color-copper-700)]" : "bg-red-50 text-red-600"
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", active ? "bg-[color:var(--color-copper-500)]" : "bg-red-500")} />
      {active ? "Active" : "Disabled"}
    </span>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <div className="font-numeric font-bold text-xl text-[color:var(--color-navy-900)]">{value}</div>
      <div className="text-[10px] font-semibold tracking-[0.12em] uppercase text-[color:var(--color-stone)]">{label}</div>
    </div>
  );
}
