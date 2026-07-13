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

export const recentReports = Array.from({ length: 3 }, (_, i) => ({
  id: i,
  name: "Charizard ex",
  set: "Pokemon 151",
  grade: "9.0",
  gradeLabel: "MINT",
  confidence: "92 %",
  value: "$ 238",
}));
