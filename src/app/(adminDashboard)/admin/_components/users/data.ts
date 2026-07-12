/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

/** "Blocked" is the only status the table renders in red; the rest read as active. */
export type UserStatus = "New users" | "Subscribed" | "Blocked";

export interface AdminUser {
  id: string;
  ref: string;
  name: string;
  email: string;
  date: string;
  /** Drives the status cell and which action the row menu offers. */
  status: UserStatus;
  state: string;
}

const states = [
  "New York",
  "California",
  "Loss angels",
  "United States",
  "United States",
  "United States",
];

/** 34 rows so the "Total users ( 34 )" count and the pager agree with each other. */
const makeUsers = (status: UserStatus): AdminUser[] =>
  Array.from({ length: 34 }, (_, i) => ({
    id: String(i + 1),
    ref: "#1532",
    name: "John Carter",
    email: "hello@johncarter.com",
    date: "Jan 30, 2024",
    status,
    state: states[i % states.length],
  }));

export const users = makeUsers("New users");
export const subscribedUsers = makeUsers("Subscribed");

export const PAGE_SIZE = 6;

/** The "All users" option never filters; the other is the page's own status. */
export const ALL_USERS = "All users";

/** The details screen — one poster plus the cards they submitted. */
export const userDetails = {
  name: "Cheerleader",
  email: "abc@gmail.com",
  state: "New York, USA",
  cards: [
    {
      id: "1",
      image: "/assets/user-dashboard/recent_scan_card.png",
      grades: [
        { label: "Surfaces", value: "4.5" },
        { label: "Corners", value: "8.7" },
        { label: "Edges", value: "9.1" },
        { label: "Centering", value: "7.5" },
      ],
    },
    {
      id: "2",
      image: "/assets/user-dashboard/recent_scan_card.png",
      grades: [
        { label: "Surfaces", value: "4.5" },
        { label: "Corners", value: "8.7" },
        { label: "Edges", value: "9.1" },
        { label: "Centering", value: "7.5" },
      ],
    },
  ],
};
