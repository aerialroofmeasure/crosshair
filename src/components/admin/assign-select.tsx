"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AssignOption {
  id: string;
  name: string;
}

export function AssignSelect({
  orderId,
  current,
  employees,
  disabled,
}: {
  orderId: string;
  current: string | null;
  employees: AssignOption[];
  disabled?: boolean;
}) {
  const router = useRouter();
  const [value, setValue] = useState<string>(current ?? "");
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  function save(next: string) {
    const prev = value;
    setValue(next);
    setError(null);
    setSaved(false);
    startTransition(async () => {
      try {
        const res = await fetch("/api/admin/assign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId, employeeId: next || null }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Couldn't assign.");
        }
        setSaved(true);
        timer.current = setTimeout(() => setSaved(false), 2500);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't assign.");
        setValue(prev);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => save(e.target.value)}
        disabled={pending || disabled}
        className={cn(
          "h-9 px-3 rounded-lg neu-inset border-none text-sm text-[color:var(--color-navy-900)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-copper-500)]/30 transition",
          (pending || disabled) && "opacity-60 cursor-not-allowed"
        )}
      >
        <option value="">Unassigned</option>
        {employees.map((e) => (
          <option key={e.id} value={e.id}>
            {e.name}
          </option>
        ))}
      </select>
      {pending && <Loader2 className="h-3.5 w-3.5 animate-spin text-[color:var(--color-stone)]" />}
      {!pending && saved && <Check className="h-3.5 w-3.5 text-[color:var(--color-copper-600)]" />}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
