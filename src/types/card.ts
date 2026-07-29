// ---------------------------------------------------------------------------
// The card catalogue row — the server's local cache of the identification and
// pricing services (card.interface.ts). Shared by the scan flow, collection,
// and price tracker.
// ---------------------------------------------------------------------------

export type CardGame = "pokemon" | "magic" | "yugioh" | "sports";

/** What a price refers to. Never render `latestPrice` without it — a raw comp
 *  and a graded comp for the same card differ by multiples. */
export type PriceBasis = "raw" | "graded";

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
  latestPrice?: number;
  /** Defaults to "raw" server-side; everything the pricing provider returns
   *  today is an ungraded comp. */
  priceBasis?: PriceBasis;
  /** The grade a "graded" price refers to, e.g. "PSA 9". Absent for raw. */
  priceGradeRef?: string;
  currency: string;
  lastPricedAt?: string;
}
