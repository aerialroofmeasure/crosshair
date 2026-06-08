import { cn } from "@/lib/utils";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-6 pb-8 border-b border-[color:var(--color-border-soft)]", className)}>
      <div>
        {eyebrow && (
          <span className="text-xs font-semibold tracking-[0.18em] uppercase text-[color:var(--color-copper-600)]">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-2 text-3xl md:text-4xl font-display">{title}</h1>
        {description && (
          <p className="mt-2 text-[color:var(--color-stone)] max-w-2xl">{description}</p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
