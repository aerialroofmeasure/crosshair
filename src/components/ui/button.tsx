import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const variantStyles: Record<Variant, string> = {
  primary:
    "bg-[color:var(--color-navy-900)] text-white hover:bg-[color:var(--color-navy-800)] shadow-sm shadow-navy-900/10",
  secondary:
    "bg-[color:var(--color-copper-500)] text-white hover:bg-[color:var(--color-copper-600)]",
  outline:
    "border border-[color:var(--color-navy-900)] text-[color:var(--color-navy-900)] hover:bg-[color:var(--color-navy-900)] hover:text-white",
  ghost:
    "text-[color:var(--color-navy-900)] hover:bg-black/5",
};

const sizeStyles: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-[15px]",
  lg: "h-13 px-7 text-base",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none whitespace-nowrap";

interface ButtonBaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
}

type ButtonProps = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps>;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variantStyles[variant], sizeStyles[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}

interface ButtonLinkProps extends ButtonBaseProps {
  href: string;
  external?: boolean;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  external,
}: ButtonLinkProps) {
  const styles = cn(base, variantStyles[variant], sizeStyles[size], className);
  if (external) {
    return (
      <a href={href} className={styles} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={styles}>
      {children}
    </Link>
  );
}
