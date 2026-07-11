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
export interface Service {
  slug: string;
  name: string;
  blurb: string;
  deliverables: string[];
  icon: string;
  /**
   * Price (USD) per delivery format. Keys are format ids:
   * pdf | esx | xml | esx_pdf | xml_pdf. Only the formats a report
   * actually offers appear here.
   */
  prices: Record<string, number>;
  /** Lowest price across formats — the "From $X" shown on tiles. */
  startsAt: number;
  /** Struck-through comparison price, to convey the discount. */
  compareAt: number;
  /** Set false for services shown with an illustration instead of a photo. */
  photo?: boolean;
}

/**
 * Finalized price list (per-format). The tile "From $X" = the lowest format
 * price; the struck-through compareAt (~1.75×) makes it read as a discount.
 * The order engine charges prices[format] × speed multiplier.
 */
export const services: Service[] = [
  {
    slug: "residential",
    name: "Residential Roof",
    blurb: "Single-family homes — fast, contractor-grade roof reports for estimates.",
    deliverables: ["PDF report", "ESX (Xactimate)", "XML", "ESX + PDF", "XML + PDF"],
    icon: "home",
    prices: { pdf: 14, esx: 14, xml: 17, esx_pdf: 17, xml_pdf: 20 },
    startsAt: 14,
    compareAt: 25,
  },
  {
    slug: "commercial",
    name: "Commercial Roof",
    blurb: "Flat, low-slope and complex commercial structures with detailed planes.",
    deliverables: ["PDF report", "ESX", "XML", "ESX + PDF", "XML + PDF"],
    icon: "building",
    prices: { pdf: 17, esx: 17, xml: 20, esx_pdf: 20, xml_pdf: 23 },
    startsAt: 17,
    compareAt: 30,
  },
  {
    slug: "multifamily",
    name: "Multifamily",
    blurb: "Apartments, condos and complex roof systems — measured plane by plane.",
    deliverables: ["PDF report", "ESX", "XML"],
    icon: "buildings",
    prices: { pdf: 30, esx: 30, xml: 30 },
    startsAt: 30,
    compareAt: 54,
  },
  {
    slug: "wall-siding",
    name: "Wall & Siding",
    blurb: "Elevation by elevation wall reports for siding, painting and cladding bids.",
    deliverables: ["ESX (Xactimate)", "ESX + PDF"],
    icon: "wall",
    prices: { esx: 32, esx_pdf: 40 },
    startsAt: 32,
    compareAt: 57,
  },
  {
    slug: "gutter",
    name: "Gutter",
    blurb: "Linear footage with downspout count for clean gutter quotes.",
    deliverables: ["PDF report"],
    icon: "gutter",
    prices: { pdf: 10 },
    startsAt: 10,
    compareAt: 18,
  },
  {
    slug: "blueprint",
    name: "Blueprint Roof Report",
    blurb: "Fast blueprint-style roof report — total area, planes and pitch at a glance.",
    deliverables: ["PDF report"],
    icon: "shield",
    prices: { pdf: 17 },
    startsAt: 17,
    compareAt: 30,
  },
  {
    slug: "quick-squares",
    name: "Quick Squares",
    blurb: "Roof area in squares — the quickest number for a fast quote.",
    deliverables: ["PDF report"],
    icon: "layers",
    prices: { pdf: 10 },
    startsAt: 10,
    compareAt: 18,
    photo: false,
  },
];
