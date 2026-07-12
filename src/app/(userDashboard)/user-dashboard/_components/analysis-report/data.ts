/* Frontend-only placeholder data for the Analysis report screen. */

/** Card artwork isn't in /assets yet — every card render points here for now. */
export const CARD_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

export const inspection = {
  name: "Charizard ex",
  set: "Pokemon 151 · 199/165",
  language: "English",
  grade: 9.0,
  gradeLabel: "MINT",
  marketValue: 1928,
  trend: "8.7 %",
  subScores: [
    { label: "Surface", value: 9.0 },
    { label: "Corners", value: 6.5 },
    { label: "Edges", value: 7.7 },
    { label: "Centering", value: 4.1 },
  ],
};

export const impact = [
  { value: "128", label: "Total cards certified" },
  { value: "$ 3526", label: "Total market value" },
  { value: "92 %", label: "Avg confidence score" },
  { value: "92 %", label: "Slabs ordered" },
  { value: "92 %", label: "Community rating" },
];

export const recentReports = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  name: "Charizard ex",
  set: "Pokemon 151",
  grade: "9.0",
  gradeLabel: "MINT",
  confidence: "92 %",
  value: "$ 238",
}));

export const creator = {
  name: "David joseph",
  badge: "Slab creator",
  stats: [
    { value: "358", label: "Cards certified" },
    { value: "12k", label: "Followers" },
    { value: "12k", label: "Following" },
  ],
  activity: [
    { text: "Slab order is confirmed", when: "2h ago" },
    { text: "New review on your profile", when: "2d ago" },
    { text: "Your report was verified", when: "5h ago" },
    { text: "New followers", when: "7h ago" },
  ],
};
