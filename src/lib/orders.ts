import { services } from "@/lib/site-config";

/**
 * Server-side pricing model. Single source of truth.
 * Pricing is recomputed server-side so the client can never tamper with it.
 */

export const SPEED_MULTIPLIERS = {
  standard: 1,
  rush: 1.5,
  express: 2,
} as const;

export const SPEED_LABELS = {
  standard: "Standard · 24h",
  rush: "Rush · 6h",
  express: "Express · 2h",
} as const;

export const FORMAT_LABELS = {
  pdf: "PDF",
  esx: "ESX (Xactimate)",
  xml: "XML",
  bundle: "Bundle",
} as const;

export type Speed = keyof typeof SPEED_MULTIPLIERS;
export type Format = keyof typeof FORMAT_LABELS;

export type LocationMode = "type" | "link";
export type OrderStatus =
  | "pending_payment"
  | "paid"
  | "in_progress"
  | "delivered"
  | "cancelled";

export interface OrderPayload {
  customer_name: string;
  customer_email: string;
  customer_company?: string;
  notes?: string;
  location_mode: LocationMode;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  maps_link?: string;
  service_slug: string;
  format: Format;
  speed: Speed;
}

export function priceOrderCents(serviceSlug: string, speed: Speed) {
  const service = services.find((s) => s.slug === serviceSlug);
  if (!service) throw new Error(`Unknown service: ${serviceSlug}`);
  const multiplier = SPEED_MULTIPLIERS[speed];
  if (!multiplier) throw new Error(`Unknown speed: ${speed}`);
  const baseCents = service.startsAt * 100;
  const totalCents = Math.round(baseCents * multiplier);
  return {
    service,
    baseCents,
    totalCents,
  };
}

export function formatRef(orderNumber: number) {
  return `ARM-${String(orderNumber).padStart(6, "0")}`;
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending_payment: "Pending payment",
  paid: "Paid · queued",
  in_progress: "In progress",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_TONES: Record<OrderStatus, "amber" | "blue" | "copper" | "navy" | "red"> = {
  pending_payment: "amber",
  paid: "blue",
  in_progress: "copper",
  delivered: "navy",
  cancelled: "red",
};
