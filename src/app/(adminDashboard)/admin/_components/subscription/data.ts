/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

import {
  EXPIRY_OPTIONS,
  MAX_PLANS,
  PLAN_NAMES,
  planCatalog,
  type PlanExpiry,
  type PlanName,
  type ScanQuota,
} from "@/config/plans";

// Names, expiries, and the plan cap live in the shared catalogue
// (`src/config/plans.ts`) so this editor can only ever produce plans that match
// what customers see on the pricing page. Re-exported here so the subscription
// components keep importing from one local module.
export { EXPIRY_OPTIONS, MAX_PLANS, PLAN_NAMES };
export type { PlanExpiry, PlanName, ScanQuota };

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
  /** Scans included per period; `null` is unlimited. */
  scanQuota: ScanQuota;
  facilities: Facility[];
}

/** Seeded from the catalogue, so the editor opens showing the live plans
 *  rather than a second, divergent set of defaults. */
export const seedPlans: Plan[] = planCatalog.map((plan, i) => ({
  id: String(i + 1),
  name: plan.name,
  price: plan.price,
  expiry: plan.expiry,
  scanQuota: plan.scanQuota,
  facilities: plan.features.map((text) => ({ text, included: true })),
}));
