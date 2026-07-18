// ---------------------------------------------------------------------------
// Demo account state for the new-analysis screen.
//
// Frontend-only placeholder until the subscription/credits API exists. Both the
// credit balance card and the PixelScope gate read from here, so the plan they
// assume can never disagree. Swap for the real `getMe` / subscription query.
// ---------------------------------------------------------------------------

import { getPlan, type PlanName } from "@/config/plans";

/** The plan the demo user is on. Change to "Collector" to preview the
 *  PixelScope-unlocked experience. */
export const DEMO_PLAN_NAME: PlanName = "Free";

export const demoPlan = getPlan(DEMO_PLAN_NAME);

/** Credits the demo user has already spent this interval. */
export const DEMO_CREDITS_USED = 10;
