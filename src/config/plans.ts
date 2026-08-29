// ---------------------------------------------------------------------------
// The subscription catalogue — the single source of truth for plan names,
// prices, features, and credit allowances.
//
// The marketing pricing table, the user dashboard's subscription screen, and
// the admin plan editor all read from here, so a plan renamed or repriced once
// is renamed or repriced everywhere.
//
// BUSINESS MODEL — CREDITS (confirmed by client, Jul 2026)
// The product meters usage in *credits*, not a raw scan count.
//   • 5 credits = 1 finished grading report (see CREDITS_PER_SCAN). They are
//     debited when the scan starts and refunded whenever no report results —
//     a failure, a cancel, or a scan left unconfirmed.
//   • Free is topped up DAILY; paid plans get a MONTHLY allowance.
//   • Credits are also spent by future premium AI features.
//
// ⚠️ The client specifies allowances in SCANS (2026-08-10: Free 5/day,
// Collector 300/month, Pro 1,200/month, Enterprise unlimited) but `credits`
// below is in CREDITS. Always write `<scans> * CREDITS_PER_SCAN`. Pasting the
// scan count straight in fails silently — the pricing page still renders, it
// just advertises a fifth of the allowance.
// Pricing/tiers come from the client's "Pricing Plans (Developer
// Specification)" sheet: Free / Collector / Pro / Enterprise.
// ---------------------------------------------------------------------------

export const PLAN_NAMES = ["Free", "Collector", "Pro", "Enterprise"] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

/** One plan per name, so the catalogue also caps how many plans can exist. */
export const MAX_PLANS = PLAN_NAMES.length;

export const BILLING_PERIODS = ["monthly", "yearly"] as const;
export type Billing = (typeof BILLING_PERIODS)[number];

/** Credits burned per AI grading report. Mirrors the server constant. */
export const CREDITS_PER_SCAN = 5;

/** How long a plan runs before it renews. `1 Year` backs the yearly billing
 *  toggle on the pricing page. */
export const EXPIRY_OPTIONS = [
  "1 Week",
  "1 Month",
  "2 Month",
  "3 Month",
  "6 Month",
  "1 Year",
] as const;
export type PlanExpiry = (typeof EXPIRY_OPTIONS)[number];

/** When the credit allowance is refilled. Free = daily, paid = monthly. */
export const CREDIT_INTERVALS = ["daily", "monthly"] as const;
export type CreditInterval = (typeof CREDIT_INTERVALS)[number];

/** Credits granted per interval. `null` is unlimited — the Enterprise plan. */
export type CreditAllowance = number | null;

export interface PlanDefinition {
  name: PlanName;
  tagline: string;
  /** Whole dollars per month at monthly list price. */
  price: number;
  /** Effective per-month price when billed yearly (charged up front ×12). */
  priceYearly: number;
  expiry: PlanExpiry;
  features: string[];
  /** Drives the "Most popular" ribbon; exactly one plan should set this. */
  popular: boolean;
  /** Credits granted each interval; `null` is unlimited. */
  credits: CreditAllowance;
  /** Whether the allowance refills daily or monthly. */
  creditInterval: CreditInterval;
  /** PixelScope (Advanced multi-image scan) + Pixel Verified are paid-only. */
  pixelscope: boolean;
}

export const planCatalog: PlanDefinition[] = [
  {
    name: "Free",
    tagline: "For trying it out",
    price: 0,
    priceYearly: 0,
    expiry: "1 Month",
    features: [
      "Standard scan (phone camera)",
      "Basic AI grading report",
      "Order custom slab labels",
      "No PixelScope",
      "No Pixel Verified badge",
    ],
    popular: false,
    credits: 20,
    creditInterval: "daily",
    pixelscope: false,
  },
  {
    name: "Collector",
    tagline: "For active collectors",
    price: 10,
    priceYearly: 8,
    expiry: "1 Month",
    features: [
      "Standard & Advanced (PixelScope) scans",
      "Pixel Verified badge",
      "Full AI grading reports",
      "Unlimited report history",
      "Collection management",
      "Price tracking",
      "Order custom slab labels",
    ],
    popular: true,
    credits: 1500,
    creditInterval: "monthly",
    pixelscope: true,
  },
  {
    name: "Pro",
    tagline: "For power users",
    price: 25,
    priceYearly: 20,
    expiry: "1 Month",
    features: [
      "Everything in Collector",
      "Priority AI processing",
      "Bulk grading",
      "Advanced analytics",
      "Collection insights",
      "Early access to new AI features",
      "Priority support",
    ],
    popular: false,
    credits: 4000,
    creditInterval: "monthly",
    pixelscope: true,
  },
  {
    name: "Enterprise",
    tagline: "For businesses & card shops",
    price: 119,
    priceYearly: 99,
    expiry: "1 Month",
    features: [
      "Everything in Pro",
      "Custom grading reports",
      "Team accounts",
      "Card Shop Dashboard",
      "API access (coming soon)",
      "Dedicated account manager",
      "Priority feature requests",
    ],
    popular: false,
    credits: 25000,
    creditInterval: "monthly",
    pixelscope: true,
  },
];

/** Look a plan up by name. */
export function getPlan(name: PlanName): PlanDefinition {
  return planCatalog.find((plan) => plan.name === name) ?? planCatalog[0];
}

/** What a plan costs per month on the given billing period. Free stays free. */
export function monthlyPrice(plan: PlanDefinition, billing: Billing): number {
  return billing === "yearly" ? plan.priceYearly : plan.price;
}

/** Total charged up front for a year (the effective monthly rate × 12). This
 *  is the real amount that leaves the customer's card when they pick yearly. */
export function yearlyTotal(plan: PlanDefinition): number {
  return plan.priceYearly * 12;
}

/** Dollars saved over a year by paying yearly instead of monthly. */
export function yearlySavings(plan: PlanDefinition): number {
  return plan.price * 12 - plan.priceYearly * 12;
}

/** Credits shown as a metered term, e.g. "1,500 credits / month" or
 *  "20 credits / day". Kept here so admin tables and user-facing cards phrase
 *  "unlimited" the same way. */
export function formatCredits(
  credits: CreditAllowance,
  interval: CreditInterval,
): string {
  if (credits === null) return "Unlimited credits";
  const per = interval === "daily" ? "day" : "month";
  return `${credits.toLocaleString()} credits / ${per}`;
}

/** Roughly how many scans an allowance buys, for a friendly "≈ N scans" hint. */
export function creditsToScans(credits: CreditAllowance): number | null {
  return credits === null ? null : Math.floor(credits / CREDITS_PER_SCAN);
}
