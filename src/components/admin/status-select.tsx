"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { STATUS_LABELS, type OrderStatus } from "@/lib/orders";
import { cn } from "@/lib/utils";

const OPTIONS: OrderStatus[] = ["pending_payment", "paid", "in_progress", "delivered", "cancelled"];

export function StatusSelect({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const router = useRouter();
  const [value, setValue] = useState<OrderStatus>(current);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);

  async function save(next: OrderStatus) {
    setValue(next);
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/order-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: orderId, status: next }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Couldn't update.");
        }
        setSavedAt(Date.now());
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't update.");
        setValue(current); // revert
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => save(e.target.value as OrderStatus)}
        disabled={pending}
        className={cn(
          "h-9 px-3 rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/20 transition",
          error
            ? "border-red-300 focus:border-red-500"
            : "border-[color:var(--color-border-soft)] focus:border-[color:var(--color-copper-500)]",
          pending && "opacity-60 cursor-not-allowed"
        )}
      >
        {OPTIONS.map((o) => (
          <option key={o} value={o}>
            {STATUS_LABELS[o]}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-[color:var(--color-stone)]" />}
      {!pending && savedAt > 0 && Date.now() - savedAt < 2500 && (
        <Check className="h-3.5 w-3.5 text-[color:var(--color-copper-600)]" />
      )}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
