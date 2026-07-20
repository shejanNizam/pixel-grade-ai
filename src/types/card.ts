// ---------------------------------------------------------------------------
// The card catalogue row — the server's local cache of the identification and
// pricing services (card.interface.ts). Shared by the scan flow, collection,
// and price tracker.
// ---------------------------------------------------------------------------

export type CardGame = "pokemon" | "magic" | "yugioh" | "sports";

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
  currency: string;
  lastPricedAt?: string;
}
