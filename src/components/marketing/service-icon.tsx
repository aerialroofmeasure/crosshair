import { Building2, Home, Hotel, Layers, ShieldCheck, Waves } from "lucide-react";
import { cn } from "@/lib/utils";

const map = {
  home: Home,
  building: Building2,
  buildings: Hotel,
  wall: Layers,
  gutter: Waves,
  shield: ShieldCheck,
} as const;

export function ServiceIcon({
  name,
  className,
}: {
  name: keyof typeof map;
  className?: string;
}) {
  const Icon = map[name];
  return (
    <div
      className={cn(
        "inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[color:var(--color-navy-900)] text-[color:var(--color-copper-300)]",
        className
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </div>
  );
}
