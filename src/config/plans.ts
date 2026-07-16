// ---------------------------------------------------------------------------
// The subscription catalogue — the single source of truth for plan names,
// prices, features, and scan quotas.
//
// The marketing pricing table, the user dashboard's subscription screen, and
// the admin plan editor all read from here, so a plan renamed or repriced once
// is renamed or repriced everywhere. Previously the admin editor carried its
// own list ("Basic/Plus/Premium") that silently disagreed with the names
// customers saw, and no admin could ever produce the plans on the pricing page.
// ---------------------------------------------------------------------------

export const PLAN_NAMES = ["Free", "Pro", "Enterprise"] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

/** One plan per name, so the catalogue also caps how many plans can exist. */
export const MAX_PLANS = PLAN_NAMES.length;

export const BILLING_PERIODS = ["monthly", "yearly"] as const;
export type Billing = (typeof BILLING_PERIODS)[number];

/** Yearly is billed up front at 20% off; both figures are shown per month. */
export const YEARLY_DISCOUNT = 0.2;

/** How long a plan runs before it renews. `1 Year` backs the yearly billing
 *  toggle on the pricing page — without it the admin could not express the
 *  annual plan the site actually sells. */
export const EXPIRY_OPTIONS = [
  "1 Week",
  "1 Month",
  "2 Month",
  "3 Month",
  "6 Month",
  "1 Year",
] as const;
export type PlanExpiry = (typeof EXPIRY_OPTIONS)[number];

/** Scans allowed per billing period. `null` is unlimited — the Enterprise
 *  promise of "Unlimited card scans". */
export type ScanQuota = number | null;

export interface PlanDefinition {
  name: PlanName;
  tagline: string;
  /** Whole dollars per month at list price. */
  price: number;
  expiry: PlanExpiry;
  features: string[];
  /** Drives the "Most popular" ribbon; exactly one plan should set this. */
  popular: boolean;
  scanQuota: ScanQuota;
}

export const planCatalog: PlanDefinition[] = [
  {
    name: "Free",
    tagline: "For hobby collectors",
    price: 0,
    expiry: "1 Month",
    features: [
      "5 card scans per month",
      "AI grade prediction with confidence score",
      "Centering, corner, edge & surface analysis",
      "Watermarked PDF inspection report",
      "Store up to 25 cards in your collection",
    ],
    popular: false,
    scanQuota: 5,
  },
  {
    name: "Pro",
    tagline: "For serious collectors",
    price: 9,
    expiry: "1 Month",
    features: [
      "200 card scans per month",
      "Live market valuation & price tracking",
      "Investor-ready PDF reports, no watermark",
      "Unlimited collection storage",
      "Priority scan queue & email support",
    ],
    popular: true,
    scanQuota: 200,
  },
  {
    name: "Enterprise",
    tagline: "For businesses & shops",
    price: 19,
    expiry: "1 Month",
    features: [
      "Unlimited card scans",
      "Bulk upload & batch grading",
      "API access for storefronts and marketplaces",
      "Team seats with a shared collection",
      "Dedicated support with 24-hour response",
    ],
    popular: false,
    scanQuota: null,
  },
];

/** Monthly list price -> what that plan costs per month on the given billing
 *  period. Free stays free rather than rendering a discounted $0. */
export function monthlyPrice(price: number, billing: Billing): number {
  if (billing === "monthly" || price === 0) return price;
  return Math.round(price * (1 - YEARLY_DISCOUNT));
}

/** How a quota reads in the UI. Kept here so admin tables and user-facing
 *  quota cards phrase "unlimited" the same way. */
export function formatQuota(quota: ScanQuota): string {
  return quota === null ? "Unlimited" : `${quota} / month`;
}
