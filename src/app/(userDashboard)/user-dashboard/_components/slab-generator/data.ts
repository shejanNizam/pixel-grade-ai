/* Frontend-only placeholder data for the Slab Label Generator. */

/** No per-card artwork in /assets yet — every slab renders this. */
export const CARD_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

// ---------------------------------------------------------------------------
// Slab specs
//
// Revised by the client 2026-07-29 (Prototype V1 bug report), to match the
// physical holder they selected:
//   Overall slab (trim): 80 mm × 135 mm
//   Grading label band:  70 mm × 20 mm — sits at the TOP, above the window
//   Card opening (fixed): 65 mm × 90 mm — never shifts
//   Bleed: 3 mm all sides · Safe area: keep text/QR ≥ 3 mm inside trim
//   Export: PNG + PDF @ 300 DPI (1016 × 1665 px full-bleed)
//
// MUST STAY IN SYNC with SLAB_DEFAULTS in the backend's app/constants.ts —
// this preview claims to show what will print, and a drift between the two
// makes that claim false. The server is authoritative; every label stores its
// own copy of these numbers so already-exported labels keep their layout.
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
  /** The grading label band above the window. */
  labelWidthMm: number;
  labelHeightMm: number;
  bleedMm: number;
  /** Keep important content this far inside the trim line. */
  safeMm: number;
}

export const slabSpecs: SlabSpec[] = [
  {
    id: "standard",
    label: "Standard slab",
    widthMm: 80,
    heightMm: 135,
    openingWidthMm: 65,
    openingHeightMm: 90,
    labelWidthMm: 70,
    labelHeightMm: 20,
    bleedMm: 3,
    safeMm: 3,
  },
];

// ---------------------------------------------------------------------------
// Background artwork
//
// The fixed themes (Cosmic / Inferno / Aurora / Vintage) were removed on
// 2026-07-30. Artwork is now generated from the confirmed card as four EXT. ART
// options the user picks between; there is no client-side list to choose from,
// and the thumbnails are real generated images served from Cloudinary.
//
// Must match EXT_ART_TREATMENTS.length in the server's imagegen.provider.ts —
// it is only used here to size the loading skeletons.
// ---------------------------------------------------------------------------
export const EXT_ART_COUNT = 4;

// ---------------------------------------------------------------------------
// Graded cards available to slab — the view model the preview renders. Built
// from real grading reports on the page; only graded cards can be slabbed.
// ---------------------------------------------------------------------------
export interface GradedCard {
  /** The grading report id — what POST /slab takes as reportId. */
  id: string;
  name: string;
  set: string;
  number: string;
  language: string;
  /** Release year, printed above the set name on the band. */
  year?: string;
  grade: number;
  gradeLabel: string;
  confidence: number;
  /** Server-set: only true when the scan used PixelScope AND confidence >= 90. */
  pixelVerified: boolean;
  /** Renamed from `certNumber` on the printed band (client, 2026-07-29).
   *  Same value, same format — only the caption changed. */
  pixelId: string;
  /** The user's own scanned card. The preview shows the card that was actually
   *  graded, not a stock placeholder — falls back to CARD_IMAGE only when the
   *  report has no image. */
  imageUrl?: string;
}
