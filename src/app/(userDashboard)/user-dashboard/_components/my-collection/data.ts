/* Frontend-only placeholder data for My Collection. */

/** No per-card artwork in /assets yet — every tile falls back to this. */
export const CARD_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

export interface CollectionCard {
  id: string;
  name: string;
  set: string;
  number: string;
  addedOn: string;
  favorite: boolean;
  /** Set when the user adds a card through the modal. */
  imageUrl?: string;
}

export const initialCards: CollectionCard[] = [
  "Charizard",
  "Blastoise",
  "Pikachu",
  "Mewtwo",
  "Eevee",
  "Gengar",
].map((name, i) => ({
  id: `seed-${i}`,
  name,
  set: "Fossil ( 1999 )",
  number: "#5/64",
  addedOn: "July 9, 2026",
  favorite: false,
}));
