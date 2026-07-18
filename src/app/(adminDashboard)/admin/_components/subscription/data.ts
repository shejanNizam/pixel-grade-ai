/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

import {
  CREDIT_INTERVALS,
  EXPIRY_OPTIONS,
  PLAN_NAMES,
  planCatalog,
  type CreditAllowance,
  type CreditInterval,
  type PlanExpiry,
  type PlanName,
} from "@/config/plans";

// Names and expiries live in the shared catalogue (`src/config/plans.ts`) so
// this editor stays in lock-step with what customers see on the pricing page.
// The four plans are fixed — admin edits them, never creates or deletes — so
// there is no "plan cap" to enforce here. Re-exported so the subscription
// components keep importing from one local module.
export { CREDIT_INTERVALS, EXPIRY_OPTIONS, PLAN_NAMES };
export type { CreditAllowance, CreditInterval, PlanExpiry, PlanName };

/** How many facility rows the form offers. Blank ones are dropped on save.
 *  Must be ≥ the longest plan's feature list (currently 7) so editing never
 *  truncates a plan's bullets. */
export const FACILITY_ROWS = 8;

export interface Facility {
  text: string;
  /** Unchecked facilities stay in the form but never reach the plan card. */
  included: boolean;
}

export interface Plan {
  id: string;
  name: PlanName;
  /** Whole dollars per month at list price — the form only accepts digits. */
  price: number;
  /** Effective per-month price when billed yearly (charged up front ×12). */
  priceYearly: number;
  expiry: PlanExpiry;
  /** Credits granted per interval; `null` is unlimited. */
  credits: CreditAllowance;
  /** Whether the allowance refills daily or monthly. */
  creditInterval: CreditInterval;
  /** PixelScope (Advanced scan) + Pixel Verified are paid-only. */
  pixelscope: boolean;
  facilities: Facility[];
}

/** The four fixed plans, seeded from the catalogue so the editor opens showing
 *  the live plans rather than a second, divergent set of defaults. */
export const seedPlans: Plan[] = planCatalog.map((plan, i) => ({
  id: String(i + 1),
  name: plan.name,
  price: plan.price,
  priceYearly: plan.priceYearly,
  expiry: plan.expiry,
  credits: plan.credits,
  creditInterval: plan.creditInterval,
  pixelscope: plan.pixelscope,
  facilities: plan.features.map((text) => ({ text, included: true })),
}));
