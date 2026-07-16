/* Frontend-only placeholder data for the Slab Label Generator. */

/** No per-card artwork in /assets yet — every slab renders this. */
export const CARD_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

// ---------------------------------------------------------------------------
// Slab specs
//
// NOTE: these measurements are PLACEHOLDERS. The exact slab dimensions and
// bleed margin must be confirmed by the client (ideally from their printing
// partner's spec sheet) before the export is production-ready.
// ---------------------------------------------------------------------------
export interface SlabSpec {
  id: string;
  label: string;
  widthMm: number;
  heightMm: number;
  bleedMm: number;
}

export const slabSpecs: SlabSpec[] = [
  { id: "standard", label: "Standard", widthMm: 82.5, heightMm: 133, bleedMm: 3 },
  { id: "wide", label: "Wide", widthMm: 85, heightMm: 130, bleedMm: 3 },
  { id: "tall", label: "Tall", widthMm: 80, heightMm: 140, bleedMm: 3 },
];

// ---------------------------------------------------------------------------
// Background styles
//
// The real backgrounds come from the AI image-generation service. These CSS
// gradients stand in for that artwork so the layout, placeholders and export
// framing can be reviewed before the API is wired up.
// ---------------------------------------------------------------------------
export interface BackgroundStyle {
  id: string;
  label: string;
  /** Prompt sent to the image model once the backend exists. */
  prompt: string;
  /** Placeholder art: [from, via, to] gradient stops. */
  stops: [string, string, string];
}

export const backgroundStyles: BackgroundStyle[] = [
  {
    id: "cosmic",
    label: "Cosmic",
    prompt: "deep space nebula, stars, violet and cyan, high detail",
    stops: ["#2e1065", "#4c1d95", "#0e7490"],
  },
  {
    id: "inferno",
    label: "Inferno",
    prompt: "molten fire and embers, orange and crimson, dramatic",
    stops: ["#450a0a", "#9a3412", "#f59e0b"],
  },
  {
    id: "aurora",
    label: "Aurora",
    prompt: "northern lights over mountains, emerald and teal, ethereal",
    stops: ["#064e3b", "#0d9488", "#22d3ee"],
  },
  {
    id: "vintage",
    label: "Vintage",
    prompt: "aged parchment with gold filigree, warm sepia, classic",
    stops: ["#292524", "#78350f", "#d6d3d1"],
  },
];

// ---------------------------------------------------------------------------
// Graded cards available to slab
// ---------------------------------------------------------------------------
export interface GradedCard {
  id: string;
  name: string;
  set: string;
  number: string;
  language: string;
  grade: number;
  gradeLabel: string;
  confidence: number;
  /** Server-set: only true when the scan used PixelScope AND confidence >= 90. */
  pixelVerified: boolean;
  certNumber: string;
}

export const gradedCards: GradedCard[] = [
  {
    id: "rep-1",
    name: "Charizard ex",
    set: "Pokemon 151",
    number: "199/165",
    language: "English",
    grade: 9.0,
    gradeLabel: "MINT",
    confidence: 92,
    pixelVerified: true,
    certNumber: "PG-2026-0001",
  },
  {
    id: "rep-2",
    name: "Blastoise",
    set: "Base Set Unlimited",
    number: "2/102",
    language: "English",
    grade: 8.5,
    gradeLabel: "NM-MT",
    confidence: 87,
    pixelVerified: false,
    certNumber: "PG-2026-0002",
  },
  {
    id: "rep-3",
    name: "Pikachu",
    set: "Base Set Unlimited",
    number: "58/102",
    language: "Japanese",
    grade: 9.5,
    gradeLabel: "GEM-MT",
    confidence: 95,
    pixelVerified: true,
    certNumber: "PG-2026-0003",
  },
];
