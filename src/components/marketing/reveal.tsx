"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before fading in (for staggering siblings manually). */
  delay?: number;
  /** Intersection threshold (0–1). */
  threshold?: number;
}

/**
 * Reveals its children on first scroll into view.
 * Drop in around any block — uses the `.reveal` / `.reveal.in` classes
 * defined in globals.css. SSR-safe (the initial render uses `.reveal`,
 * which is opacity-0; the IntersectionObserver flips it to `.in`).
 */
export function Reveal({ children, className, delay = 0, threshold = 0.18 }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      node.classList.add("in");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => node.classList.add("in"), delay);
            } else {
              node.classList.add("in");
            }
            io.unobserve(e.target);
          }
        });
      },
      { threshold }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [delay, threshold]);

  return (
    <div ref={ref} className={cn("reveal", className)}>
      {children}
    </div>
  );
}
