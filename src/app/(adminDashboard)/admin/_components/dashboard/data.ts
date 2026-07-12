/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

export const stats = [
  { label: "Total users", value: "3420", delta: "+8% from last month" },
  { label: "Subscribed users", value: "3420", delta: "+8% from last month" },
  { label: "New subscriber", value: "3420", delta: "+8% from last month" },
  { label: "Total earnings", value: "3420", delta: "+8% from last month" },
];

export interface RecentUser {
  id: string;
  ref: string;
  name: string;
  email: string;
  date: string;
  status: string;
  country: string;
}

export const recentUsers: RecentUser[] = Array.from({ length: 5 }, (_, i) => ({
  id: String(i + 1),
  ref: "#1532",
  name: "John Carter",
  email: "hello@johncarter.com",
  date: "Jan 30, 2024",
  status: "New users",
  country: "United States",
}));

/** Shown beside the "Most recent users" heading. */
export const recentUsersTotal = 34;
