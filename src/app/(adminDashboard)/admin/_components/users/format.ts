import type { TUser } from "@/types/auth";

/** Short display id — the tail of the Mongo ObjectId, like the "#1532" refs
 *  in the design. Full ids stay in URLs and API calls only. */
export const userRef = (user: TUser): string => `#${user._id.slice(-4)}`;

/** "Jan 30, 2024" per the design; em dash when the API sent no date. */
export const formatUserDate = (iso?: string): string =>
  iso
    ? new Date(iso).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "—";
