/* Frontend-only placeholder data for the Slab Label Generator. */

/** No per-card artwork in /assets yet — every slab renders this. */
export const CARD_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

// ---------------------------------------------------------------------------
// Slab specs
//
// Confirmed by the client (Jul 2026):
//   Overall slab (trim): 94 mm × 138 mm
//   Card opening (fixed): 65 mm × 90 mm — never shifts
//   Bleed: 3 mm all sides · Safe area: keep text/QR ≥ 3 mm inside trim
//   Export: PNG + PDF @ 300 DPI at exact slab dimensions
// The client noted these may be adjusted once the physical prototype /
// printer's final spec sheet arrives, so they stay data-driven here.
// ---------------------------------------------------------------------------
export interface SlabSpec {
  id: string;
  label: string;
  /** Overall trim size. */
  widthMm: number;
  heightMm: number;
  /** Fixed card window cut into the slab. */
  openingWidthMm: number;
  openingHeightMm: number;
  bleedMm: number;
  /** Keep important content this far inside the trim line. */
  safeMm: number;
}

export const slabSpecs: SlabSpec[] = [
  {
    id: "standard",
    label: "Standard slab",
    widthMm: 94,
    heightMm: 138,
    openingWidthMm: 65,
    openingHeightMm: 90,
    bleedMm: 3,
    safeMm: 3,
  },
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
