/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

import type { PlanName } from "@/config/plans";

/** Subscription revenue, not marketplace payouts: money flows from subscribers
 *  to the platform, so there is nothing to withdraw and nothing pending payout.
 *  These are the figures a subscription business actually tracks. */
export const earnings = [
  { label: "Total earnings", value: "$ 50.8K", delta: "20.4 %" },
  { label: "Monthly recurring revenue", value: "$ 12.4K", delta: "8.2 %" },
  { label: "Active subscriptions", value: "1,284", delta: "4.1 %" },
];

export interface Transaction {
  id: string;
  ref: string;
  name: string;
  tranId: string;
  email: string;
  date: string;
  country: string;
  /** Which plan the charge was for — the main way revenue gets sliced. */
  plan: PlanName;
  total: string;
}

/** Totals match the catalogue's prices, so the column doesn't contradict the
 *  plan it names. */
const rows: Array<{ name: string; plan: PlanName; total: string }> = [
  { name: "John Carter", plan: "Pro", total: "$ 9" },
  { name: "Alicia Moore", plan: "Pro", total: "$ 9" },
  { name: "Daniel Reeves", plan: "Enterprise", total: "$ 19" },
  { name: "Priya Nair", plan: "Pro", total: "$ 9" },
  { name: "Marcus Webb", plan: "Enterprise", total: "$ 19" },
  { name: "Sofia Almeida", plan: "Pro", total: "$ 9" },
  { name: "Tom Hedley", plan: "Enterprise", total: "$ 19" },
  { name: "Grace Lin", plan: "Pro", total: "$ 9" },
  { name: "Owen Barrett", plan: "Pro", total: "$ 9" },
  { name: "Nadia Rahman", plan: "Enterprise", total: "$ 19" },
  { name: "Felix Turner", plan: "Pro", total: "$ 9" },
  { name: "Ivy Chen", plan: "Enterprise", total: "$ 19" },
];

export const transactions: Transaction[] = rows.map((row, i) => ({
  id: String(i + 1),
  ref: `#${1532 + i}`,
  name: row.name,
  tranId: `#${84950520324 + i}`,
  email: `${row.name.split(" ")[0].toLowerCase()}@example.com`,
  date: "Jan 30, 2024",
  country: "United States",
  plan: row.plan,
  total: row.total,
}));

export const PAGE_SIZE = 6;
