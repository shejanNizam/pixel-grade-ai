// ---------------------------------------------------------------------------
// The card catalogue row — the server's local cache of the identification and
// pricing services (card.interface.ts). Shared by the scan flow, collection,
// and price tracker.
// ---------------------------------------------------------------------------

export type CardGame = "pokemon" | "magic" | "yugioh" | "sports";

/** What a price refers to. Never render `latestPrice` without it — a raw comp
 *  and a graded comp for the same card differ by multiples. */
export type PriceBasis = "raw" | "graded";

/** One rung of a grading company's price ladder. */
export interface TGradedComp {
  /** "10", "9.5", "9" … a string because half grades are real. */
  grade: string;
  price: number;
}

/**
 * The rung a predicted grade should be priced at.
 *
 * Mirrors `pickGradedComp` in the backend's `scrydex.mapper.ts` — keep the two
 * in step. Exact match, else the next rung DOWN rather than the nearest: PSA
 * does not award every half grade on every card, and rounding an 8.7 up to a
 * PSA 9 comp quotes a price the card would not fetch. Erring low understates
 * rather than oversells, which is the right way to be wrong about money.
 *
 * Returns null when the grade sits below the whole ladder — no comp beats a
 * misleading one.
 */
export const pickGradedComp = (
  ladder: TGradedComp[] | undefined,
  grade: number | undefined,
): TGradedComp | null => {
  if (!ladder?.length || grade === undefined || !Number.isFinite(grade)) {
    return null;
  }

  const exact = ladder.find((comp) => Number(comp.grade) === grade);
  if (exact) return exact;

  const below = ladder.filter((comp) => Number(comp.grade) <= grade);
  return below.length > 0 ? below[below.length - 1] : null;
};

export interface TCard {
  _id: string;
  /** Stable id from the identification service — the natural key. */
  scrydexCardId: string;
  game: CardGame;
  name: string;
  language?: string;
  releaseYear?: number;
  setExpansion?: string;
  /** Printed number, e.g. "199/165". */
  cardNumber?: string;
  rarity?: string;
  officialImageUrl?: string;
  /**
   * Which Scrydex printing this row is, e.g. "unlimitedHolofoil".
   *
   * Server-owned. Worth showing next to the price on anything that compares
   * cards: Base Set Pikachu has eleven printings whose Near Mint prices span
   * two orders of magnitude, so "Pikachu — $2,146" without the printing is a
   * number a collector cannot act on.
   */
  scrydexVariant?: string;
  latestPrice?: number;
  /** Defaults to "raw" server-side; everything the pricing provider returns
   *  today is an ungraded comp. */
  priceBasis?: PriceBasis;
  /** The grade a "graded" price refers to, e.g. "PSA 9". Absent for raw. */
  priceGradeRef?: string;
  /** Every PSA comp for this printing, cheapest rung first. Use
   *  `pickGradedComp` to read the rung matching a report's grade — never take
   *  the top rung, which is a PSA 10 the card almost certainly is not. */
  gradedPrices?: TGradedComp[];
  /** Which grader `gradedPrices` came from. "PSA" today. */
  gradedCompany?: string;
  /** Condition a raw price refers to — "NM" | "LP" | "MP" | "HP" | "DM".
   *  Almost always "NM"; anything else means no Near Mint comp existed. */
  priceCondition?: string;
  currency: string;
  lastPricedAt?: string;
}
