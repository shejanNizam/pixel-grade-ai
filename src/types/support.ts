// ---------------------------------------------------------------------------
// Support ticket shapes, shared by the user's support screen (which opens
// tickets) and the admin queue (which answers them). Both sides read one
// definition so a status added here can't be rendered by only half the app.
// ---------------------------------------------------------------------------

export const TICKET_PRIORITIES = ["Low", "Normal", "High"] as const;
export type TicketPriority = (typeof TICKET_PRIORITIES)[number];

/** `Open` is untouched, `Answered` has a staff reply, `Resolved` is closed. */
export const TICKET_STATUSES = ["Open", "Answered", "Resolved"] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

export interface TicketReply {
  id: string;
  /** Staff replies render as the support side of the thread. */
  from: "user" | "support";
  message: string;
  /** ISO date (YYYY-MM-DD). */
  sent: string;
}

export interface Ticket {
  id: string;
  subject: string;
  message: string;
  priority: TicketPriority;
  status: TicketStatus;
  /** ISO date (YYYY-MM-DD). */
  created: string;
  /** Who opened it — the admin queue lists across all users. */
  user: { name: string; email: string };
  /** The plan the requester is on. Paid plans promise faster response, so the
   *  queue needs it to triage. */
  plan: string;
  replies: TicketReply[];
}

/** Tag colours, kept beside the unions so both tables agree. */
export const PRIORITY_COLOR: Record<TicketPriority, string> = {
  Low: "default",
  Normal: "blue",
  High: "red",
};

export const STATUS_COLOR: Record<TicketStatus, string> = {
  Open: "orange",
  Answered: "blue",
  Resolved: "green",
};
