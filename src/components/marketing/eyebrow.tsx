import { cn } from "@/lib/utils";

export function Eyebrow({
  children,
  tone = "copper",
  className,
}: {
  children: React.ReactNode;
  tone?: "copper" | "white";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "text-xs font-semibold tracking-[0.18em] uppercase",
        tone === "copper" ? "text-[color:var(--color-copper-600)]" : "text-[color:var(--color-copper-300)]",
        className
      )}
    >
      {children}
    </span>
  );
}
