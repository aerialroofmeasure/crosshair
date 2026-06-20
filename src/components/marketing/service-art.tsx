import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Service illustration: two realistic views of the building — the roof (top)
 * view and the front view — that cross-fade back and forth on a loop.
 * Hovering the image snaps to the front view.
 *
 * Images live in /public/services/{slug}-top.jpg and {slug}-front.jpg.
 */
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
  const sizes = "(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 380px";

  return (
    <div
      className={cn(
        "group/art relative w-full aspect-[4/3] overflow-hidden rounded-xl bg-[color:var(--color-warm-cream)] ring-1 ring-black/[0.05] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.4)]",
        className
      )}
    >
      {/* Roof / top view — base layer */}
      <Image
        src={`/services/${slug}-top.jpg`}
        alt={`${label} — roof view`}
        fill
        sizes={sizes}
        className="object-cover"
      />
      {/* Front view — cross-fades over the top; snaps in on hover */}
      <Image
        src={`/services/${slug}-front.jpg`}
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
