import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Service illustration.
 *
 * For photo-backed services: two realistic views of the building — the roof
 * (top) view and the front view — that cross-fade back and forth on a loop
 * (hover snaps to the front). Images live in
 * /public/services/{slug}-top-v2.jpg and {slug}-front-v2.jpg.
 *
 * For services without a photo (e.g. quick-squares): a blueprint-grid
 * illustration fallback so nothing breaks.
 */

// Services shown with the blueprint illustration instead of photos.
const NO_PHOTO = new Set(["quick-squares"]);

export function ServiceArt({
  slug,
  name,
  className,
}: {
  slug: string;
  name?: string;
  className?: string;
}) {
  const label = name ?? "Service";

  if (NO_PHOTO.has(slug)) {
    return <BlueprintFallback label={label} className={className} />;
  }

  const sizes = "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 380px";
  // Bump when the source images change, to bust browser/CDN image caches.
  const v = "2";

  return (
    <div
      className={cn(
        "group/art relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[color:var(--color-warm-cream)] ring-1 ring-black/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]",
        className
      )}
    >
      {/* Roof / top view — base layer */}
      <Image
        src={`/services/${slug}-top-v${v}.jpg`}
        alt={`${label} — roof view`}
        fill
        sizes={sizes}
        className="object-cover"
      />
      {/* Front view — cross-fades over the top; snaps in on hover */}
      <Image
        src={`/services/${slug}-front-v${v}.jpg`}
        alt={`${label} — front view`}
        fill
        sizes={sizes}
        className="object-cover animate-svc-switch group-hover/art:opacity-100 group-hover/art:[animation:none]"
      />

      {/* View pill */}
      <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-[color:var(--color-navy-900)]/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-sm">
        Roof &harr; Front
      </span>
    </div>
  );
}

/** Blueprint-grid fallback for photo-less services (roof area in squares). */
function BlueprintFallback({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn("relative w-full aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-black/[0.05]", className)}
      style={{
        backgroundColor: "#f4ede0",
        backgroundImage:
          "linear-gradient(rgba(201,137,47,0.14) 1px,transparent 1px),linear-gradient(90deg,rgba(201,137,47,0.14) 1px,transparent 1px)",
        backgroundSize: "18px 18px",
      }}
    >
      <svg viewBox="0 0 200 140" role="img" aria-label={`${label} illustration`} className="block w-full h-auto">
        {/* roof outline split into measured squares */}
        <path d="M40 96 L100 40 L160 96 Z" fill="none" stroke="#0b1e3a" strokeWidth={3} strokeLinejoin="round" />
        <path
          d="M56 96 L100 55 M72 96 L100 70 M88 96 L100 85 M144 96 L100 55 M128 96 L100 70 M112 96 L100 85 M40 96 H160"
          fill="none"
          stroke="#0b1e3a"
          strokeWidth={1.4}
          opacity={0.55}
        />
        {/* dimension line + squares tag */}
        <path d="M40 112 H160 M40 108 v8 M160 108 v8" fill="none" stroke="#c9892f" strokeWidth={1.6} strokeLinecap="round" />
        <g transform="translate(100,120)">
          <rect x="-19" y="-1" width="38" height="17" rx="8" fill="#0b1e3a" />
          <text x="0" y="11" textAnchor="middle" fill="#ddb05c" fontFamily="Arial, sans-serif" fontSize="9" fontWeight="700" letterSpacing="1">
            SQ
          </text>
        </g>
      </svg>
      <span className="pointer-events-none absolute bottom-2 left-2 z-10 rounded-full bg-[color:var(--color-navy-900)]/70 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white">
        Area in squares
      </span>
    </div>
  );
}
