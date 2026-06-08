export const siteConfig = {
  name: "Aerial Roof Measure",
  shortName: "ARM",
  tagline: "Professional · Precise · On Time",
  description:
    "Professional aerial roof, wall, gutter and insurance-grade measurement reports — engineered for contractors, adjusters and architects.",
  url: "https://aerialroofmeasure.com",
  email: {
    orders: "orders@aerialroofmeasure.com",
    support: "support@aerialroofmeasure.com",
    founder: "founder@aerialroofmeasure.com",
  },
  // TAT promise — adjustable later
  tat: {
    standard: "24 hours",
    rush: "6 hours",
    express: "2 hours",
  },
  // Accuracy promise
  accuracy: "98%+",
  // Stats shown on homepage (placeholders until real data)
  stats: {
    reportsDelivered: 1240,
    avgAccuracy: 98.4,
    avgTatHours: 18,
    repeatClients: 87,
  },
} as const;

export const mainNav = [
  { label: "Services", href: "/services" },
  { label: "How it works", href: "/how-it-works" },
  { label: "FAQ", href: "/faq" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
] as const;

/**
 * Pricing strategy:
 *   `startsAt`  → our list price (what the customer pays).
 *   `compareAt` → the typical industry average for an equivalent report.
 *                 Used in the "WAS $X" strikethrough to convey value.
 *                 Source: average of 3 competitor sites + 2 large legacy
 *                 providers (e.g. EagleView, Hover). Conservative end of range.
 */
export const services = [
  {
    slug: "residential",
    name: "Residential Roof",
    blurb: "Single-family homes — fast, contractor-grade roof reports for estimates.",
    deliverables: ["PDF report", "ESX (Xactimate)", "XML", "Bundle"],
    icon: "home",
    startsAt: 18,
    compareAt: 32,
  },
  {
    slug: "commercial",
    name: "Commercial Roof",
    blurb: "Flat, low-slope and complex commercial structures with detailed planes.",
    deliverables: ["PDF report", "ESX", "XML", "Bundle"],
    icon: "building",
    startsAt: 28,
    compareAt: 48,
  },
  {
    slug: "multifamily",
    name: "Multifamily",
    blurb: "Apartments, condos and complex roof systems — measured plane by plane.",
    deliverables: ["PDF report", "ESX", "XML"],
    icon: "buildings",
    startsAt: 24,
    compareAt: 42,
  },
  {
    slug: "wall-siding",
    name: "Wall & Siding",
    blurb: "Elevation by elevation wall reports for siding, painting and cladding bids.",
    deliverables: ["PDF report", "ESX", "Bundle"],
    icon: "wall",
    startsAt: 32,
    compareAt: 55,
  },
  {
    slug: "gutter",
    name: "Gutter",
    blurb: "Linear footage with downspout count for clean gutter quotes.",
    deliverables: ["PDF report"],
    icon: "gutter",
    startsAt: 12,
    compareAt: 22,
  },
  {
    slug: "insurance-esx",
    name: "Insurance / ESX",
    blurb: "Xactimate-ready ESX files for adjusters and restoration teams.",
    deliverables: ["ESX (Xactimate)", "PDF support", "Photo overlays"],
    icon: "shield",
    startsAt: 22,
    compareAt: 40,
  },
] as const;

export type Service = typeof services[number];
