/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

/** One plan per name, so this list also caps how many plans can exist. */
export const PLAN_NAMES = ["Basic Plan", "Plus Plan", "Premium Plan"] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

export const EXPIRY_OPTIONS = [
  "1 Week",
  "1 Month",
  "2 Month",
  "3 Month",
  "6 Month",
] as const;
export type PlanExpiry = (typeof EXPIRY_OPTIONS)[number];

export const MAX_PLANS = PLAN_NAMES.length;

/** How many facility rows the form offers. Blank ones are dropped on save. */
export const FACILITY_ROWS = 6;

export interface Facility {
  text: string;
  /** Unchecked facilities stay in the form but never reach the plan card. */
  included: boolean;
}

export interface Plan {
  id: string;
  name: PlanName;
  /** Whole dollars — the form only accepts digits. */
  price: number;
  expiry: PlanExpiry;
  facilities: Facility[];
}

const facilities = (...texts: string[]): Facility[] =>
  texts.map((text) => ({ text, included: true }));

export const seedPlans: Plan[] = [
  {
    id: "1",
    name: "Basic Plan",
    price: 0,
    expiry: "1 Month",
    facilities: facilities(
      "5 card scans per month",
      "AI grade prediction with confidence score",
      "Centering, corner, edge & surface analysis",
      "Watermarked PDF inspection report",
      "Store up to 25 cards in your collection",
    ),
  },
  {
    id: "2",
    name: "Plus Plan",
    price: 9,
    expiry: "1 Month",
    facilities: facilities(
      "200 card scans per month",
      "Live market valuation & price tracking",
      "Investor-ready PDF reports, no watermark",
      "Unlimited collection storage",
      "Priority scan queue & email support",
    ),
  },
  {
    id: "3",
    name: "Premium Plan",
    price: 19,
    expiry: "1 Month",
    facilities: facilities(
      "Unlimited card scans",
      "Bulk upload & batch grading",
      "API access for storefronts and marketplaces",
      "Team seats with a shared collection",
      "Dedicated support with 24-hour response",
    ),
  },
];
