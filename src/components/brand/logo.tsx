import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "mark" | "lockup" | "stacked";
  tone?: "navy" | "white";
  /** Hide the tagline under the wordmark. Useful in compact slots. */
  noTagline?: boolean;
}

/**
 * Aerial Crosshair — corner-bracket reticle with dashed crosshairs
 * framing a top-down hipped-roof view, with copper accents at the
 * roof ridge and crosshair centre.
 *
 * Three variants:
 *   - mark     → just the reticle (square)
 *   - lockup   → reticle + horizontal wordmark
 *   - stacked  → mark-dominant emblem with single-line wordmark + tagline (portrait)
 */
export function Logo({ className, variant = "lockup", tone = "navy", noTagline = false }: LogoProps) {
  const fg = tone === "white" ? "#FFFFFF" : "#0B1E3A";
  const bg = tone === "white" ? "#0B1E3A" : "#FAF7F2";
  const copper = "#C9892F";

  if (variant === "mark") {
    return (
      <svg
        viewBox="0 0 220 220"
        className={cn("h-10 w-10", className)}
        aria-label="Aerial Roof Measure"
      >
        <Reticle fg={fg} bg={bg} copper={copper} />
      </svg>
    );
  }

  if (variant === "stacked") {
    // Mark-dominant — reticle takes ~55% of the canvas, single-line
    // wordmark sits underneath, optional tagline below a copper rule.
    // Compact viewBox so every pixel is doing work.
    return (
      <svg
        viewBox="0 0 360 340"
        className={cn("h-32 w-auto", className)}
        aria-label="Aerial Roof Measure"
        role="img"
      >
        {/* Mark — centered, ~200px tall */}
        <g transform="translate(85, 5)">
          <Reticle fg={fg} bg={bg} copper={copper} />
        </g>

        {/* Wordmark — single line, sized to span ~85% of viewBox */}
        <text
          x="180"
          y="248"
          textAnchor="middle"
          fill={fg}
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="34"
          fontWeight="700"
          letterSpacing="-0.6"
        >
          Aerial Roof Measure
        </text>

        {!noTagline && (
          <>
            <line x1="60" y1="272" x2="300" y2="272" stroke={copper} strokeWidth="2" />
            <text
              x="180"
              y="302"
              textAnchor="middle"
              fill={copper}
              fontFamily="var(--font-inter), sans-serif"
              fontSize="13"
              fontWeight="600"
              letterSpacing="4.5"
            >
              PROFESSIONAL · PRECISE · ON TIME
            </text>
          </>
        )}
      </svg>
    );
  }

  // Default: lockup — reticle + horizontal wordmark on one line.
  // ViewBox always 980x220 (mark is the tallest element). Wordmark
  // re-centers vertically against the mark when noTagline is true.
  return (
    <svg
      viewBox="0 0 980 220"
      className={cn("h-12 w-auto md:h-14", className)}
      aria-label="Aerial Roof Measure"
      role="img"
    >
      <Reticle fg={fg} bg={bg} copper={copper} />

      <g transform="translate(280, 0)">
        <text
          x="0"
          y={noTagline ? 138 : 102}
          fill={fg}
          fontFamily="var(--font-fraunces), Georgia, serif"
          fontSize="68"
          fontWeight="600"
          letterSpacing="-1"
        >
          Aerial Roof Measure
        </text>
        {!noTagline && (
          <>
            <line x1="0" y1="128" x2="600" y2="128" stroke={copper} strokeWidth="2" opacity="0.85" />
            <text
              x="0"
              y="168"
              fill={copper}
              fontFamily="var(--font-inter), sans-serif"
              fontSize="26"
              fontWeight="600"
              letterSpacing="5.5"
            >
              PROFESSIONAL · PRECISE · ON TIME
            </text>
          </>
        )}
      </g>
    </svg>
  );
}

/**
 * The reticle mark — heavier strokes, copper centre dot for emphasis,
 * copper accent on the ridge line so the brand colour reads at any size.
 * Designed to sit in a 220x220 viewBox.
 */
function Reticle({ fg, bg, copper }: { fg: string; bg: string; copper: string }) {
  return (
    <g transform="translate(15, 15)">
      {/* Corner brackets — outer frame (chunkier) */}
      <g stroke={fg} strokeWidth="10" fill="none" strokeLinecap="square">
        <polyline points="0,42 0,0 42,0" />
        <polyline points="148,0 190,0 190,42" />
        <polyline points="0,148 0,190 42,190" />
        <polyline points="190,148 190,190 148,190" />
      </g>

      {/* Dashed copper crosshairs */}
      <g stroke={copper} strokeWidth="2.4" strokeDasharray="6 6">
        <line x1="95" y1="0" x2="95" y2="190" />
        <line x1="0" y1="95" x2="190" y2="95" />
      </g>

      {/* Inner roof plate — top-down hipped roof */}
      <g transform="translate(35, 47)">
        <rect x="0" y="0" width="120" height="96" fill={fg} />
        <line x1="0" y1="48" x2="120" y2="48" stroke={copper} strokeWidth="4" />
        <line x1="0" y1="0" x2="38" y2="48" stroke={bg} strokeWidth="3" />
        <line x1="120" y1="0" x2="82" y2="48" stroke={bg} strokeWidth="3" />
        <line x1="0" y1="96" x2="38" y2="48" stroke={bg} strokeWidth="3" />
        <line x1="120" y1="96" x2="82" y2="48" stroke={bg} strokeWidth="3" />
      </g>

      {/* Copper centre dot — the "you are here" pinpoint */}
      <circle cx="95" cy="95" r="6" fill={copper} />
      <circle cx="95" cy="95" r="2.5" fill={fg} />
    </g>
  );
}
