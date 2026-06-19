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

/* ============================================================
   Report-file requirements per ordered format.
   Used to gate "mark complete" — an order can't be delivered
   until the employee has uploaded the file kinds the customer
   paid for.
   ============================================================ */

export type FileKind = "pdf" | "esx" | "xml" | "bundle" | "other";

/**
 * Which file kinds must be present before an order of a given format can
 * be marked complete. A bundle ships both the PDF and the Xactimate ESX.
 */
export function requiredKindsForFormat(format: string): FileKind[] {
  switch (format) {
    case "pdf":
      return ["pdf"];
    case "xml":
      return ["xml"];
    case "esx":
      return ["esx"];
    case "bundle":
      return ["pdf", "esx"];
    default:
      return ["pdf"];
  }
}

/** Infer a file kind from its filename extension. */
export function inferFileKind(fileName: string): FileKind {
  const ext = fileName.toLowerCase().split(".").pop() ?? "";
  if (ext === "pdf") return "pdf";
  if (ext === "esx") return "esx";
  if (ext === "xml") return "xml";
  if (ext === "zip") return "bundle";
  return "other";
}

export const FILE_KIND_LABELS: Record<FileKind, string> = {
  pdf: "PDF",
  esx: "ESX",
  xml: "XML",
  bundle: "Bundle (.zip)",
  other: "File",
};

/** Format label helper — single source for the short format badge text. */
export function formatLabelShort(format: string): string {
  return format === "esx"
    ? "ESX"
    : format === "xml"
      ? "XML"
      : format === "bundle"
        ? "Bundle"
        : "PDF";
}

/** Speed label helper — short badge text. */
export function speedLabelShort(speed: string): string {
  return speed === "rush" ? "Rush 6h" : speed === "express" ? "Express 2h" : "Standard 24h";
}
