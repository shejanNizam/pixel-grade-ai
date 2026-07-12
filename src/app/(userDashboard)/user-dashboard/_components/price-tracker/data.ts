/* Frontend-only placeholder data for the Price Tracker. */

export const CARD_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

/** Seeded PRNG — the series must be identical on the server and the client,
 *  otherwise the sparklines would trip a hydration mismatch. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A 30-point walk with a gentle drift, used for every trend line. */
export function series(seed: number, drift = 0, points = 30): number[] {
  const rand = mulberry32(seed);
  let value = 50;
  return Array.from({ length: points }, (_, i) => {
    value += (rand() - 0.5) * 10 + drift;
    return Math.max(value, 1) + i * 0;
  });
}

export const marketStats = [
  {
    label: "Total Market Value",
    value: "$12,458.20",
    delta: "8.47%",
    caption: "(24h)",
    up: true,
    color: "#a78bfa",
    data: series(1, 0.6),
  },
  {
    label: "24h Change",
    value: "$973.45",
    delta: "8.47%",
    up: true,
    color: "#4ade80",
    data: series(2, 0.5),
  },
  {
    label: "7d Change",
    value: "$1,589.10",
    delta: "14.62%",
    up: true,
    color: "#38bdf8",
    data: series(3, 0.8),
  },
  {
    label: "30d Change",
    value: "-$312.75",
    delta: "2.31%",
    up: false,
    color: "#f87171",
    data: series(4, -0.5),
  },
];

export interface TrackedCard {
  key: string;
  name: string;
  favorite: boolean;
  detail: string;
  grade: string;
  set: string;
  year: string;
  marketValue: number;
  change24h: number;
  change7d: number;
  change30d: number;
  trend: number[];
}

const baseCards = [
  {
    name: "Charizard",
    favorite: true,
    detail: "Base Set Unlimited #4/102",
    grade: "PSA 9 MINT",
    set: "Base Set Unlimited",
    marketValue: 2150,
    change24h: 2.15,
    change7d: 6.72,
    change30d: -1.38,
  },
  {
    name: "Blastoise",
    favorite: true,
    detail: "Base Set Unlimited #2/102",
    grade: "PSA 8 NM-MT",
    set: "Base Set Unlimited",
    marketValue: 1250,
    change24h: 1.63,
    change7d: 4.21,
    change30d: -3.24,
  },
  {
    name: "Pikachu",
    favorite: false,
    detail: "Base Set Unlimited #58/102",
    grade: "PSA 9 MINT",
    set: "Base Set Unlimited",
    marketValue: 650,
    change24h: 0.78,
    change7d: 2.35,
    change30d: -0.91,
  },
  {
    name: "Mewtwo",
    favorite: false,
    detail: "Base Set Unlimited #10/102",
    grade: "PSA 8 NM-MT",
    set: "Base Set Unlimited",
    marketValue: 900,
    change24h: 3.21,
    change7d: 7.14,
    change30d: -2.17,
  },
  {
    name: "Eevee",
    favorite: false,
    detail: "Jungle #51/64",
    grade: "PSA 9 MINT",
    set: "Jungle",
    marketValue: 275,
    change24h: 0.5,
    change7d: 1.85,
    change30d: -1.07,
  },
  {
    name: "Gengar",
    favorite: false,
    detail: "Fossil #5/62",
    grade: "PSA 9 MINT",
    set: "Fossil",
    marketValue: 350,
    change24h: 1.45,
    change7d: 5.11,
    change30d: -2.79,
  },
];

/** 24 tracked cards so the pagination in the design is real, not decorative. */
export const trackedCards: TrackedCard[] = Array.from(
  { length: 24 },
  (_, i) => {
    const base = baseCards[i % baseCards.length];
    return {
      ...base,
      key: `card-${i}`,
      year: "1999",
      trend: series(i + 10, base.change30d / 12),
    };
  },
);
