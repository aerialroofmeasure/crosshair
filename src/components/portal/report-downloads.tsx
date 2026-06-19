import { Download, FileText } from "lucide-react";
import { FILE_KIND_LABELS, type FileKind } from "@/lib/orders";

export interface DownloadableFile {
  id: string;
  kind: FileKind;
  file_name: string;
  size_bytes: number | null;
}

function prettySize(bytes: number | null): string | null {
  if (!bytes && bytes !== 0) return null;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Renders the delivered report files for an order as download links.
 * Each link hits /api/reports/[fileId], which authorizes the caller and
 * redirects to a short-lived signed URL.
 */
export function ReportDownloads({ files, compact = false }: { files: DownloadableFile[]; compact?: boolean }) {
  if (files.length === 0) {
    return (
      <p className="text-xs text-[color:var(--color-stone)] italic">Files are being finalized.</p>
    );
  }

  return (
    <div className={compact ? "flex flex-wrap gap-2" : "grid gap-2 sm:grid-cols-2"}>
      {files.map((f) => {
        const size = prettySize(f.size_bytes);
        return (
          <a
            key={f.id}
            href={`/api/reports/${f.id}`}
            className="group neu-btn hover:neu-btn-hover active:neu-btn-active inline-flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm transition"
          >
            <span className="h-8 w-8 rounded-lg bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center flex-shrink-0">
              <FileText className="h-4 w-4" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block truncate font-medium text-[color:var(--color-navy-900)]">{f.file_name}</span>
              <span className="block text-[11px] text-[color:var(--color-stone)]">
                {FILE_KIND_LABELS[f.kind]}
                {size ? ` · ${size}` : ""}
              </span>
            </span>
            <Download className="h-4 w-4 text-[color:var(--color-copper-600)] flex-shrink-0 transition-transform group-hover:translate-y-0.5" />
          </a>
        );
      })}
    </div>
  );
}
