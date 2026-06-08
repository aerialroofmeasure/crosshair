"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Animated aerial roof-measurement visual.
 *
 * Two-layer architecture:
 *   - BACKGROUND layer (grid + decorative rings) → radial mask fades to
 *     transparent at the edges so no boxy outline shows against the navy hero.
 *   - FOREGROUND layer (roof, dim lines, labels, reticle, scan beam) → NO mask.
 *     Labels stay crisp regardless of where they sit in the visual.
 *
 * Pure SVG/CSS animations — <4KB on the wire.
 */
export function RoofScan({ className }: { className?: string }) {
  const area = useTickUp(2148, 1800);
  const accuracy = useTickUp(98.4, 1800, 1);

  // Mask applied ONLY to the decorative background layer.
  const bgMask = "radial-gradient(ellipse 65% 60% at 50% 50%, #000 35%, rgba(0,0,0,0.7) 65%, transparent 85%)";

  return (
    <div className={cn("relative aspect-square w-full max-w-[560px]", className)}>
      {/* ============================================
          LAYER 1 — Decorative background (masked)
          Grid pattern + outer reticle rings + compass.
          Fades to transparent at the edges.
          ============================================ */}
      <div
        className="absolute inset-0"
        style={{ WebkitMaskImage: bgMask, maskImage: bgMask }}
      >
        <svg
          viewBox="0 0 480 480"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <pattern id="rs-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M24 0 L0 0 0 24" fill="none" stroke="rgba(201,137,47,0.12)" strokeWidth="1" />
            </pattern>
            <pattern id="rs-grid-major" width="96" height="96" patternUnits="userSpaceOnUse">
              <path d="M96 0 L0 0 0 96" fill="none" stroke="rgba(201,137,47,0.22)" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="480" height="480" fill="url(#rs-grid)" opacity="0"
            style={{ animation: "fade-in 0.8s 0.15s both" }}
          />
          <rect width="480" height="480" fill="url(#rs-grid-major)" opacity="0"
            style={{ animation: "fade-in 0.8s 0.35s both" }}
          />

          <g opacity="0" style={{ animation: "fade-in 0.6s 0.4s both" }}>
            <circle cx="240" cy="240" r="220" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="1" strokeDasharray="3 6" />
            <circle cx="240" cy="240" r="180" fill="none" stroke="rgba(255,255,255,0.13)" strokeWidth="1" />
            <circle cx="240" cy="240" r="140" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            {[0, 90, 180, 270].map((deg) => (
              <line
                key={deg}
                x1="240" y1="20" x2="240" y2="34"
                stroke="rgba(255,255,255,0.55)" strokeWidth="1.5"
                transform={`rotate(${deg} 240 240)`}
              />
            ))}
            <text x="240" y="14" textAnchor="middle" fill="rgba(255,255,255,0.6)"
              fontSize="10" fontWeight="700" letterSpacing="2"
              fontFamily="var(--font-inter), sans-serif">N</text>
          </g>
        </svg>
      </div>

      {/* ============================================
          LAYER 2 — Foreground (NOT masked)
          Roof shape, dimension lines, labels, reticle,
          scan beam — all stay crisp at full opacity.
          ============================================ */}
      <div className="absolute inset-0">
        <svg
          viewBox="0 0 480 480"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="rs-beam-glow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,200,120,0)" />
              <stop offset="50%" stopColor="rgba(255,200,120,0.55)" />
              <stop offset="100%" stopColor="rgba(255,200,120,0)" />
            </linearGradient>
            <radialGradient id="rs-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(201,137,47,0.55)" />
              <stop offset="100%" stopColor="rgba(201,137,47,0)" />
            </radialGradient>
          </defs>

          {/* ROOF — hipped main with attached ell */}
          <g>
            <rect
              x="120" y="140" width="240" height="200"
              fill="rgba(255,255,255,0.04)"
              stroke="rgba(255,255,255,0.75)" strokeWidth="2"
              strokeDasharray="880" strokeDashoffset="880"
              style={{ animation: "draw-line 1.3s 0.55s var(--ease-out-soft) both" }}
            />
            <line x1="180" y1="240" x2="300" y2="240"
              stroke="rgba(255,255,255,0.95)" strokeWidth="2.8"
              strokeDasharray="120" strokeDashoffset="120"
              style={{ animation: "draw-line 0.6s 1.7s var(--ease-out-soft) both" }}
            />
            {[
              { from: "180,240", to: "120,140" },
              { from: "300,240", to: "360,140" },
              { from: "180,240", to: "120,340" },
              { from: "300,240", to: "360,340" },
            ].map((h, i) => (
              <line key={i}
                x1={h.from.split(",")[0]} y1={h.from.split(",")[1]}
                x2={h.to.split(",")[0]} y2={h.to.split(",")[1]}
                stroke="rgba(255,255,255,0.7)" strokeWidth="1.6"
                strokeDasharray="120" strokeDashoffset="120"
                style={{ animation: `draw-line 0.55s ${1.95 + i * 0.08}s var(--ease-out-soft) both` }}
              />
            ))}

            <rect
              x="350" y="200" width="90" height="100"
              fill="rgba(255,255,255,0.03)"
              stroke="rgba(255,255,255,0.55)" strokeWidth="1.6"
              strokeDasharray="380" strokeDashoffset="380"
              style={{ animation: "draw-line 1s 2.4s var(--ease-out-soft) both" }}
            />
            <line x1="350" y1="250" x2="440" y2="250"
              stroke="rgba(255,255,255,0.85)" strokeWidth="1.8"
              strokeDasharray="90" strokeDashoffset="90"
              style={{ animation: "draw-line 0.4s 3.1s var(--ease-out-soft) both" }}
            />
          </g>

          {/* MEASUREMENT DIMENSION LINES */}
          <g stroke="#C9892F" strokeWidth="1.6" fill="none">
            <g style={{ animation: "fade-in 0.4s 3.3s both" }}>
              <line x1="120" y1="105" x2="360" y2="105" />
              <line x1="120" y1="98" x2="120" y2="112" />
              <line x1="360" y1="98" x2="360" y2="112" />
            </g>
            <g style={{ animation: "fade-in 0.4s 3.6s both" }}>
              <line x1="450" y1="140" x2="450" y2="340" />
              <line x1="443" y1="140" x2="457" y2="140" />
              <line x1="443" y1="340" x2="457" y2="340" />
            </g>
            <g style={{ animation: "fade-in 0.4s 3.9s both" }}>
              <line x1="78" y1="200" x2="78" y2="300" />
              <line x1="71" y1="200" x2="85" y2="200" />
              <line x1="71" y1="300" x2="85" y2="300" />
            </g>
          </g>

          {/* DIMENSION LABELS */}
          <g style={{ animation: "fade-up 0.45s 3.4s both" }}>
            <rect x="208" y="89" width="64" height="22" rx="11" fill="#0B1E3A" stroke="#C9892F" strokeWidth="1" />
            <text x="240" y="104" textAnchor="middle"
              fill="#FAF7F2" fontSize="11" fontWeight="700"
              fontFamily="var(--font-inter-tight), var(--font-inter), sans-serif"
              letterSpacing="0.4">42&apos; 6&quot;</text>
          </g>
          <g style={{ animation: "fade-up 0.45s 3.7s both" }}>
            <rect x="422" y="229" width="56" height="22" rx="11" fill="#0B1E3A" stroke="#C9892F" strokeWidth="1" />
            <text x="450" y="244" textAnchor="middle"
              fill="#FAF7F2" fontSize="11" fontWeight="700"
              fontFamily="var(--font-inter-tight), var(--font-inter), sans-serif"
              letterSpacing="0.4">28&apos; 0&quot;</text>
          </g>
          <g style={{ animation: "fade-up 0.45s 4s both" }}>
            <rect x="50" y="239" width="56" height="22" rx="11" fill="#0B1E3A" stroke="#C9892F" strokeWidth="1" />
            <text x="78" y="254" textAnchor="middle"
              fill="#FAF7F2" fontSize="11" fontWeight="700"
              fontFamily="var(--font-inter-tight), var(--font-inter), sans-serif"
              letterSpacing="0.4">14&apos; 0&quot;</text>
          </g>
          <g style={{ animation: "fade-up 0.5s 4.4s both" }}>
            <rect x="208" y="278" width="64" height="22" rx="11" fill="#C9892F" />
            <text x="240" y="293" textAnchor="middle"
              fill="#0B1E3A" fontSize="11" fontWeight="700"
              fontFamily="var(--font-inter-tight), var(--font-inter), sans-serif"
              letterSpacing="0.5">6 / 12</text>
          </g>
          <g style={{ animation: "fade-up 0.5s 4.7s both" }}>
            <rect x="370" y="240" width="44" height="20" rx="10" fill="#C9892F" />
            <text x="392" y="254" textAnchor="middle"
              fill="#0B1E3A" fontSize="10" fontWeight="700"
              fontFamily="var(--font-inter-tight), var(--font-inter), sans-serif"
              letterSpacing="0.5">4 / 12</text>
          </g>

          {/* SCAN BEAM — sharp 2px line with thin glow halo */}
          <g style={{ animation: "scan-vertical 5s 4.5s ease-in-out infinite" }}>
            <rect x="100" y="116" width="360" height="14" fill="url(#rs-beam-glow)" />
            <rect x="100" y="122" width="360" height="2" fill="rgba(255,210,140,0.95)" />
          </g>

          {/* RETICLE — locks on roof apex */}
          <g transform="translate(240, 240)" opacity="0"
            style={{ animation: "fade-in 0.5s 2.6s both" }}>
            <circle r="28" fill="url(#rs-glow)"
              style={{ transformOrigin: "center", animation: "pulse-ring 2.6s ease-out infinite" }}
            />
            <circle r="16" fill="none" stroke="#C9892F" strokeWidth="1.8" />
            <line x1="-26" y1="0" x2="-10" y2="0" stroke="#C9892F" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="10" y1="0" x2="26" y2="0" stroke="#C9892F" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="-26" x2="0" y2="-10" stroke="#C9892F" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="0" y1="10" x2="0" y2="26" stroke="#C9892F" strokeWidth="1.8" strokeLinecap="round" />
            <circle r="3" fill="#FAF7F2" />
          </g>
        </svg>
      </div>

      {/* ============================================
          HUD overlays — on top of both SVG layers
          ============================================ */}
      <div className="absolute top-4 left-4 inline-flex items-center gap-2 rounded-full bg-[color:var(--color-navy-900)]/55 backdrop-blur-md border border-white/15 px-3 py-1.5 text-[11px] font-medium text-white animate-fade-in z-10"
        style={{ animationDelay: "0.2s" }}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--color-copper-400)] opacity-75 animate-ping" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-copper-500)]" />
        </span>
        Measuring
      </div>

      <div className="absolute bottom-4 left-4 text-[10px] font-numeric text-white/75 leading-tight animate-fade-up z-10"
        style={{ animationDelay: "1.6s" }}>
        <div className="text-white/45 uppercase tracking-[0.18em] text-[9px] font-semibold mb-0.5">Coordinates</div>
        <div>32.7847° N, 96.7970° W</div>
        <div className="text-white/45 mt-0.5">Imagery · 2026-04 · 7cm/px</div>
      </div>

      <div className="absolute bottom-4 right-4 text-right text-[10px] font-numeric text-white/85 leading-tight animate-fade-up z-10"
        style={{ animationDelay: "1.9s" }}>
        <div className="text-white/45 uppercase tracking-[0.18em] text-[9px] font-semibold mb-0.5">Roof area</div>
        <div className="text-base text-white font-semibold">
          {area.toLocaleString("en-US")}
          <span className="text-[color:var(--color-copper-300)] ml-1 text-xs">sq ft</span>
        </div>
        <div className="text-[color:var(--color-copper-300)] mt-1.5 text-[9px] uppercase tracking-[0.18em] font-semibold">Accuracy</div>
        <div>
          <span className="text-white">{accuracy.toFixed(1)}</span>
          <span className="text-[color:var(--color-copper-300)] ml-0.5">%</span>
        </div>
      </div>
    </div>
  );
}

function useTickUp(target: number, ms: number, decimals = 0) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setV(target);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      const eased = 1 - Math.pow(1 - t, 4);
      const next = target * eased;
      setV(decimals > 0 ? Number(next.toFixed(decimals)) : Math.round(next));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, decimals]);
  return v;
}
