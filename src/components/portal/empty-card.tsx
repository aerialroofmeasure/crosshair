import { cn } from "@/lib/utils";

interface EmptyCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyCard({ icon, title, description, action, className }: EmptyCardProps) {
  return (
    <div
      className={cn(
        "relative rounded-2xl border border-[color:var(--color-border-soft)] bg-white p-12 md:p-16 text-center overflow-hidden",
        className
      )}
    >
      {/* Soft copper glow in the corner */}
      <div
        aria-hidden
        className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[color:var(--color-copper-400)]/8 blur-3xl pointer-events-none"
      />
      {/* Hairline copper top edge */}
      <div
        aria-hidden
        className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-[color:var(--color-copper-400)]/50 to-transparent"
      />

      <div className="relative">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)] flex items-center justify-center shadow-[0_8px_24px_-8px_rgba(11,30,58,0.25)]">
          {icon}
        </div>
        <h2 className="mt-6 text-2xl md:text-3xl font-display">{title}</h2>
        <p className="mt-3 text-[color:var(--color-stone)] max-w-md mx-auto leading-relaxed">
          {description}
        </p>
        {action && <div className="mt-7 flex flex-wrap justify-center gap-3">{action}</div>}
      </div>
    </div>
  );
}
