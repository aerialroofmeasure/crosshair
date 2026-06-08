"use client";

import { useEffect, useRef, useState } from "react";

interface AnimatedNumberProps {
  /** The target number to count up to. */
  value: number;
  /** Total animation duration (ms). */
  duration?: number;
  /** Number of decimal places to show. */
  decimals?: number;
  /** Optional locale-aware thousands separator. */
  format?: boolean;
}

/**
 * Counts from 0 → value the first time it enters the viewport.
 * Uses requestAnimationFrame with an ease-out curve.
 * Respects prefers-reduced-motion.
 */
export function AnimatedNumber({
  value,
  duration = 1400,
  decimals = 0,
  format = true,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement | null>(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;

    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const run = () => {
      if (started.current) return;
      started.current = true;
      if (reduce) {
        setDisplay(value);
        return;
      }
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration);
        // easeOutQuint
        const eased = 1 - Math.pow(1 - t, 5);
        setDisplay(value * eased);
        if (t < 1) requestAnimationFrame(tick);
        else setDisplay(value);
      };
      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(node);

    return () => io.disconnect();
  }, [value, duration]);

  const text =
    decimals > 0
      ? display.toFixed(decimals)
      : format
      ? Math.round(display).toLocaleString("en-US")
      : String(Math.round(display));

  return <span ref={ref}>{text}</span>;
}
