"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Upload, CheckCircle2, AlertCircle, FileText, X, ShieldCheck } from "lucide-react";
import {
  requiredKindsForFormat,
  inferFileKind,
  FILE_KIND_LABELS,
  formatLabelShort,
  type FileKind,
} from "@/lib/orders";
import { cn } from "@/lib/utils";

export function CompleteOrder({ orderId, format }: { orderId: string; format: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const required = requiredKindsForFormat(format);
  const presentKinds = new Set(files.map((f) => inferFileKind(f.name)));
  const missing = required.filter((k) => !presentKinds.has(k));
  const canSubmit = files.length > 0 && missing.length === 0;

  function addFiles(list: FileList | null) {
    if (!list) return;
    const next = [...files];
    for (const f of Array.from(list)) {
      if (!next.some((e) => e.name === f.name && e.size === f.size)) next.push(f);
    }
    setFiles(next);
    setError(null);
  }

  function removeFile(name: string, size: number) {
    setFiles((prev) => prev.filter((f) => !(f.name === name && f.size === size)));
  }

  function submit() {
    if (!canSubmit) return;
    setError(null);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("orderId", orderId);
        files.forEach((f) => fd.append("files", f));
        const res = await fetch("/api/employee/complete", { method: "POST", body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Couldn't complete this order.");
        }
        setOpen(false);
        setFiles([]);
        router.refresh();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Couldn't complete this order.");
      }
    });
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="neu-btn hover:neu-btn-hover active:neu-btn-active inline-flex items-center gap-2 rounded-full px-5 h-10 text-sm font-medium text-[color:var(--color-navy-900)]"
      >
        <CheckCircle2 className="h-4 w-4 text-[color:var(--color-copper-600)]" />
        Mark complete
      </button>
    );
  }

  return (
    <div className="w-full mt-1 rounded-2xl neu-inset p-4">
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-[0.14em] uppercase text-[color:var(--color-copper-700)]">
          <ShieldCheck className="h-3.5 w-3.5" />
          Deliver {formatLabelShort(format)} report
        </span>
        <button onClick={() => setOpen(false)} className="p-1 rounded-md text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)]" aria-label="Cancel">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Required-files checklist */}
      <div className="mt-3 flex flex-wrap gap-2">
        {required.map((k) => (
          <KindBadge key={k} kind={k} ok={presentKinds.has(k)} />
        ))}
      </div>

      {/* Dropzone / picker */}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-3 w-full rounded-xl border border-dashed border-[color:var(--color-copper-400)]/50 bg-[color:var(--color-warm-white)] px-4 py-5 text-center hover:border-[color:var(--color-copper-500)] transition"
      >
        <Upload className="h-5 w-5 mx-auto text-[color:var(--color-copper-600)]" />
        <span className="mt-1.5 block text-sm font-medium text-[color:var(--color-navy-900)]">Choose report files</span>
        <span className="block text-xs text-[color:var(--color-stone)]">PDF, ESX, XML or ZIP · you can add several</span>
      </button>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.esx,.xml,.zip"
        className="hidden"
        onChange={(e) => addFiles(e.target.files)}
      />

      {/* Selected files */}
      {files.length > 0 && (
        <ul className="mt-3 space-y-1.5">
          {files.map((f) => (
            <li key={`${f.name}-${f.size}`} className="flex items-center gap-2 rounded-lg bg-[color:var(--color-warm-white)] px-3 py-2 text-sm">
              <FileText className="h-4 w-4 text-[color:var(--color-stone)] flex-shrink-0" />
              <span className="flex-1 min-w-0 truncate text-[color:var(--color-navy-900)]">{f.name}</span>
              <span className="text-[11px] uppercase font-semibold text-[color:var(--color-copper-700)]">{FILE_KIND_LABELS[inferFileKind(f.name)]}</span>
              <button onClick={() => removeFile(f.name, f.size)} className="p-0.5 text-[color:var(--color-stone)] hover:text-red-600" aria-label={`Remove ${f.name}`}>
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-red-600">
          <AlertCircle className="h-3.5 w-3.5" />
          {error}
        </p>
      )}
      {!error && missing.length > 0 && files.length > 0 && (
        <p className="mt-3 text-xs text-amber-700">
          Still need: {missing.map((k) => FILE_KIND_LABELS[k]).join(", ")}
        </p>
      )}

      <div className="mt-4 flex items-center justify-end gap-2">
        <button onClick={() => setOpen(false)} className="px-4 h-10 rounded-full text-sm font-medium text-[color:var(--color-stone)] hover:text-[color:var(--color-navy-900)]">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={!canSubmit || pending}
          className={cn(
            "inline-flex items-center gap-2 rounded-full px-5 h-10 text-sm font-medium text-white transition",
            canSubmit && !pending
              ? "bg-[color:var(--color-copper-500)] hover:bg-[color:var(--color-copper-600)]"
              : "bg-[color:var(--color-stone)]/50 cursor-not-allowed"
          )}
        >
          {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
          {pending ? "Publishing…" : "Publish & complete"}
        </button>
      </div>
    </div>
  );
}

function KindBadge({ kind, ok }: { kind: FileKind; ok: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        ok
          ? "bg-[color:var(--color-copper-500)]/12 text-[color:var(--color-copper-700)] border-[color:var(--color-copper-500)]/30"
          : "bg-white text-[color:var(--color-stone)] border-[color:var(--color-border-soft)]"
      )}
    >
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {FILE_KIND_LABELS[kind]} required
    </span>
  );
}
