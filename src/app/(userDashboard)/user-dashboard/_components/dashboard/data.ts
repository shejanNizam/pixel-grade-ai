/* Frontend-only placeholder data. Swap for RTK Query hooks when the API exists. */

export const stats = [
  { label: "Total collection value", value: "$ 34.5 k", delta: "11.3 %" },
  { label: "Cards in collection", value: "27", delta: "11.3 %" },
  { label: "Slabs ordered", value: "756", delta: "3.1 %" },
  { label: "Average grade", value: "8.3", delta: "3.1 %" },
  { label: "Total scans", value: "54", delta: "3.1 %" },
];

/** Collection value per month, in dollars. */
export const collectionValue = [
  { month: "Jan", value: 62_000 },
  { month: "Feb", value: 47_000 },
  { month: "Mar", value: 58_000 },
  { month: "Apr", value: 96_000 },
  { month: "May", value: 122_000 },
  { month: "Jun", value: 108_000 },
  { month: "Jul", value: 138_000 },
  { month: "Aug", value: 228_000 },
  { month: "Sep", value: 196_000 },
  { month: "Oct", value: 121_000 },
  { month: "Nov", value: 88_000 },
  { month: "Dec", value: 152_000 },
];

/** One row per set — the donut and the value bars read from the same source. */
export const sets = [
  { name: "Sword and Shield", count: 132, share: 84, value: 7343 },
  { name: "Scarlet and Violet", count: 54, share: 95, value: 847 },
  { name: "Sun and Moon", count: 8, share: 37, value: 93 },
  { name: "XY", count: 19, share: 53, value: 652 },
  { name: "Base set", count: 67, share: 98, value: 7165 },
  { name: "Other", count: 11, share: 32, value: 567 },
];

export const recentScans = Array.from({ length: 5 }, (_, i) => ({
  id: i,
  name: "Card name here",
  grade: "PSA 9",
  date: "July 7, 2026",
  time: "at 11:09 AM",
}));
