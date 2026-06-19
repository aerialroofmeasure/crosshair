"use client";

import { useState } from "react";
import { Loader2, Check, KeyRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

/**
 * Self-service password change card (neumorphic). Used on every role's
 * profile page. Updates the password via the browser Supabase client.
 */
export function PasswordCard() {
  const [pw, setPw] = useState("");
  const [confirm, setConfirm] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function update() {
    if (pw.length < 8) {
      setError("Password must be at least 8 characters.");
      setState("error");
      return;
    }
    if (pw !== confirm) {
      setError("Passwords don't match.");
      setState("error");
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
      setTimeout(() => setState("idle"), 2400);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setState("error");
    }
  }

  return (
    <section className="neu-card p-7 md:p-8">
      <div className="flex items-start gap-3 pb-5 border-b border-[color:var(--color-border-soft)]">
        <div className="h-9 w-9 rounded-lg bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center flex-shrink-0">
          <KeyRound className="h-4 w-4" />
        </div>
        <div>
          <h2 className="text-lg font-display">Password</h2>
          <p className="text-sm text-[color:var(--color-stone)]">Use 8+ characters. You&apos;ll stay signed in on this device.</p>
        </div>
      </div>

      <div className="mt-6 grid sm:grid-cols-2 gap-4">
        <Field label="New password" value={pw} onChange={setPw} />
        <Field label="Confirm password" value={confirm} onChange={setConfirm} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <div className="min-h-[20px]">
          {error && <p className="text-sm text-red-600">{error}</p>}
          {state === "ok" && (
            <p className="text-sm text-[color:var(--color-copper-700)] flex items-center gap-1.5">
              <Check className="h-3.5 w-3.5" /> Password updated
            </p>
          )}
        </div>
        <button
          onClick={update}
          disabled={state === "saving" || !pw || !confirm}
          className="neu-btn hover:neu-btn-hover active:neu-btn-active inline-flex items-center gap-2 rounded-full px-5 h-11 text-sm font-medium text-[color:var(--color-navy-900)] disabled:opacity-50 disabled:pointer-events-none"
        >
          {state === "saving" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Updating
            </>
          ) : (
            "Update password"
          )}
        </button>
      </div>
    </section>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-[color:var(--color-navy-900)] mb-2">{label}</span>
      <input
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-11 px-4 rounded-lg neu-inset border-none text-[color:var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/30 transition"
      />
    </label>
  );
}
