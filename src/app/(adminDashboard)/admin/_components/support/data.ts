/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

import type { Ticket } from "@/types/support";

export const PAGE_SIZE = 6;

/** The "All tickets" option never filters; the rest are ticket statuses. */
export const ALL_TICKETS = "All tickets";

const seed: Array<Pick<Ticket, "subject" | "message" | "priority" | "status" | "plan"> & {
  name: string;
  created: string;
}> = [
  {
    subject: "Scan stuck on processing",
    message:
      "I uploaded four images of a 1998 holo and the inspection has been processing for about an hour. The scan still counted against my monthly quota.",
    priority: "High",
    status: "Open",
    plan: "Pro",
    name: "John Carter",
    created: "2026-07-14",
  },
  {
    subject: "Centering grade looks wrong",
    message:
      "The centering score came back 4.5 but the card is visibly well centered. Can someone take a look at the report?",
    priority: "Normal",
    status: "Open",
    plan: "Pro",
    name: "Alicia Moore",
    created: "2026-07-13",
  },
  {
    subject: "Billed twice this month",
    message:
      "My card was charged twice on the yearly plan. Transaction IDs are #84950520324 and #84950520399.",
    priority: "High",
    status: "Answered",
    plan: "Enterprise",
    name: "Daniel Reeves",
    created: "2026-07-12",
  },
  {
    subject: "How do I export a slab image?",
    message:
      "I built a slab in the generator but I can't work out how to export it at print resolution.",
    priority: "Low",
    status: "Answered",
    plan: "Free",
    name: "Priya Nair",
    created: "2026-07-11",
  },
  {
    subject: "Bulk upload fails over 50 cards",
    message:
      "Batch grading drops out around the 50-card mark and I have to restart the upload.",
    priority: "High",
    status: "Open",
    plan: "Enterprise",
    name: "Marcus Webb",
    created: "2026-07-10",
  },
  {
    subject: "Request: PSA population data",
    message:
      "Would be great if the price tracker showed PSA population counts next to the comps.",
    priority: "Low",
    status: "Resolved",
    plan: "Pro",
    name: "Sofia Almeida",
    created: "2026-07-08",
  },
  {
    subject: "Can't reset my password",
    message:
      "The reset email never arrives. I've checked spam and tried twice today.",
    priority: "Normal",
    status: "Resolved",
    plan: "Free",
    name: "Tom Hedley",
    created: "2026-07-07",
  },
];

export const tickets: Ticket[] = seed.map((row, i) => ({
  id: String(i + 1),
  subject: row.subject,
  message: row.message,
  priority: row.priority,
  status: row.status,
  created: row.created,
  plan: row.plan,
  user: {
    name: row.name,
    email: `${row.name.split(" ")[0].toLowerCase()}@example.com`,
  },
  replies:
    row.status === "Open"
      ? []
      : [
          {
            id: `${i + 1}-r1`,
            from: "support",
            message:
              "Thanks for reporting this — we've taken a look and followed up by email with the details.",
            sent: row.created,
          },
        ],
}));
