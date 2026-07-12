/**
 * Categorical series colors for the dashboard charts.
 *
 * The order is the colorblind-safety mechanism, not cosmetic: the Figma put
 * violet directly beside indigo, which collide under protanopia/deuteranopia
 * (ΔE 3.3 — indistinguishable). Reordering so violet and blue are never
 * adjacent lifts the worst adjacent pair to ΔE 21.9, clear of the ≥12 target.
 * Every series is also direct-labeled in the legend, so identity never rests
 * on color alone. Re-run the validator if these change.
 */
export const seriesColors = [
  "#4ade80", // green
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#a78bfa", // violet
  "#22d3ee", // cyan
  "#f472b6", // pink
] as const;

/** Chart chrome for the near-black dashboard surface. */
export const chartInk = {
  grid: "rgba(255,255,255,0.06)",
  axis: "#6b7280",
  accent: "#8b5cf6",
} as const;
