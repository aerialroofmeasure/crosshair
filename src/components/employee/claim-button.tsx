"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Hand, AlertCircle } from "lucide-react";

export function ClaimButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function claim() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/employee/claim", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Couldn't claim this order.");
        }
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't claim this order.");
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      {error && (
        <span className="inline-flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </span>
      )}
      <button
        onClick={claim}
        disabled={pending}
        className="neu-btn hover:neu-btn-hover active:neu-btn-active inline-flex items-center gap-2 rounded-full px-5 h-10 text-sm font-medium text-[color:var(--color-navy-900)] disabled:opacity-60 disabled:pointer-events-none"
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Hand className="h-4 w-4 text-[color:var(--color-copper-600)]" />}
        {pending ? "Claiming…" : "Claim order"}
      </button>
    </div>
  );
}
