"use client";

import { useState, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type Mode = "login" | "signup" | "forgot";

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/portal/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();
    const password = String(fd.get("password") || "");
    const name = String(fd.get("name") || "").trim();
    const company = String(fd.get("company") || "").trim();

    const supabase = createSupabaseBrowserClient();

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, company },
            emailRedirectTo: `${window.location.origin}/portal/dashboard`,
          },
        });
        if (error) throw error;
        router.push("/portal/dashboard");
        router.refresh();
      } else if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push(nextPath);
        router.refresh();
      } else if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setSuccess("Check your email for a reset link.");
      }
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Something went wrong. Try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <Heading mode={mode} />

      <form onSubmit={onSubmit} className="mt-10 space-y-5">
        {mode === "signup" && (
          <div className="grid gap-4">
            <Field label="Full name" name="name" required />
            <Field label="Company (optional)" name="company" />
          </div>
        )}

        <Field
          label="Work email"
          name="email"
          type="email"
          required
          autoComplete="email"
        />

        {mode !== "forgot" && (
          <div>
            <label className="block">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-[color:var(--color-navy-900)]">
                  Password
                </span>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[color:var(--color-copper-600)] hover:text-[color:var(--color-copper-700)] font-medium"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  className="w-full h-12 px-4 pr-12 rounded-lg border border-[color:var(--color-border-soft)] bg-white focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)]"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </label>
            {mode === "signup" && (
              <p className="mt-2 text-xs text-[color:var(--color-stone)]">
                Minimum 8 characters.
              </p>
            )}
          </div>
        )}

        {error && (
          <div className="text-sm rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm rounded-lg bg-[color:var(--color-copper-50)] border border-[color:var(--color-copper-200)] text-[color:var(--color-copper-700)] px-4 py-3">
            {success}
          </div>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading}
          className="w-full justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Please wait
            </>
          ) : (
            <PrimaryLabel mode={mode} />
          )}
        </Button>
      </form>

      <Switcher mode={mode} />
    </div>
  );
}

function Heading({ mode }: { mode: Mode }) {
  if (mode === "signup") {
    return (
      <div>
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
          Create account
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-display">Start ordering reports.</h1>
        <p className="mt-3 text-[color:var(--color-stone)]">
          Order history, fast re-orders and ESX archive — all in one place.
        </p>
      </div>
    );
  }
  if (mode === "forgot") {
    return (
      <div>
        <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
          Reset password
        </span>
        <h1 className="mt-3 text-3xl md:text-4xl font-display">Let&apos;s get you back in.</h1>
        <p className="mt-3 text-[color:var(--color-stone)]">
          Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>
    );
  }
  return (
    <div>
      <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
        Welcome back
      </span>
      <h1 className="mt-3 text-3xl md:text-4xl font-display">Sign in to your account.</h1>
      <p className="mt-3 text-[color:var(--color-stone)]">
        Track orders, re-download past reports, and reorder in two clicks.
      </p>
    </div>
  );
}

function PrimaryLabel({ mode }: { mode: Mode }) {
  if (mode === "signup") return <>Create account</>;
  if (mode === "forgot") return <>Send reset link</>;
  return <>Sign in</>;
}

function Switcher({ mode }: { mode: Mode }) {
  return (
    <div className="mt-8 text-sm text-center text-[color:var(--color-stone)]">
      {mode === "signup" && (
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-[color:var(--color-copper-600)] font-medium hover:underline">
            Sign in
          </Link>
        </>
      )}
      {mode === "login" && (
        <>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-[color:var(--color-copper-600)] font-medium hover:underline">
            Create one
          </Link>
        </>
      )}
      {mode === "forgot" && (
        <>
          Remembered it?{" "}
          <Link href="/login" className="text-[color:var(--color-copper-600)] font-medium hover:underline">
            Back to sign in
          </Link>
        </>
      )}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className={cn("block text-sm font-medium text-[color:var(--color-navy-900)] mb-2")}>
        {label}
      </span>
      <input
        type={type}
        name={name}
        required={required}
        autoComplete={autoComplete}
        className="w-full h-12 px-4 rounded-lg border border-[color:var(--color-border-soft)] bg-white shadow-[inset_0_1px_2px_rgba(11,30,58,0.04)] focus:border-[color:var(--color-copper-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition"
      />
    </label>
  );
}
