/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

import type { Ticket } from "@/types/support";

/** The signed-in user's own tickets — the admin queue's counterpart, scoped to
 *  one person. One answered thread so the reply rendering is visible. */
export const myTickets: Ticket[] = [
  {
    id: "TCK-0002",
    subject: "Centering grade looks wrong",
    message:
      "The centering score came back 4.5 but the card is visibly well centered. Can someone take a look at the report?",
    priority: "Normal",
    status: "Answered",
    created: "2026-07-13",
    user: { name: "You", email: "you@example.com" },
    plan: "Pro",
    replies: [
      {
        id: "TCK-0002-r1",
        from: "support",
        message:
          "Thanks for flagging — we re-ran the scan against a fresh calibration and the centering came back 8.9. Your report has been updated and the scan credit refunded.",
        sent: "2026-07-14",
      },
    ],
  },
  {
    id: "TCK-0001",
    subject: "How do I export a slab image?",
    message:
      "I built a slab in the generator but I can't work out how to export it at print resolution.",
    priority: "Low",
    status: "Resolved",
    created: "2026-07-09",
    user: { name: "You", email: "you@example.com" },
    plan: "Pro",
    replies: [
      {
        id: "TCK-0001-r1",
        from: "support",
        message:
          "Open the slab, then use Export at the top right and pick 300 DPI. Pro plans export without a watermark.",
        sent: "2026-07-09",
      },
    ],
  },
];
