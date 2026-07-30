import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { CARD_IMAGE, type GradedCard, type SlabSpec } from "./data";

interface SlabPreviewProps {
  card: GradedCard;
  spec: SlabSpec;
  /**
   * The server's composite of the selected EXT. ART option — card, artwork,
   * label, and all. When present this IS the preview: the client requires
   * "the preview should always match the final exported design", and the only
   * way to guarantee that is to show the exported file rather than a
   * client-side approximation of it.
   *
   * Absent before the first generation, when the mock below stands in.
   */
  compositeUrl?: string;
  /** Changes on every regenerate — re-rolls the placeholder artwork. */
  seed: number;
  showBleed: boolean;
}

/** Deterministic 0-1 from the seed, so the same seed always renders the same
 *  art (a stand-in for the image model's own seeded generation). */
function rand(seed: number, salt: number) {
  const x = Math.sin(seed * 9301 + salt * 49297) * 233280;
  return x - Math.floor(x);
}

/** Matches the server's `formatGrade` — "10", not "10.0"; "8.5" keeps its half.
 *  The preview claims to show the print, so the two must agree. */
const formatGrade = (grade: number): string =>
  Number.isInteger(grade) ? String(grade) : grade.toFixed(1);

/**
 * The slab template.
 *
 * The label band and the card window are FIXED placeholders — the generated
 * artwork is painted around them and can never cover or shift them. Only the
 * background layer changes when the user regenerates.
 */
export default function SlabPreview({
  card,
  spec,
  compositeUrl,
  seed,
  showBleed,
}: SlabPreviewProps) {
  // Bleed as a % of the slab, so the guide scales with the preview.
  const bleedX = (spec.bleedMm / spec.widthMm) * 100;
  const bleedY = (spec.bleedMm / spec.heightMm) * 100;

  // The card window is a FIXED opening (65 × 90 mm on an 80 × 135 mm slab).
  // Content sits inside a padded safe area, so size the window relative to that
  // inner box rather than the full slab, keeping the real opening proportions.
  const contentInsetX = bleedX * 1.6;
  const openingWidthPct =
    ((spec.openingWidthMm / spec.widthMm) * 100) /
    (1 - (2 * contentInsetX) / 100);

  // The label band is also a real measured rectangle (70 × 20 mm), not a
  // "whatever the text needs" box — 20 mm is the tightest constraint in the
  // design, and a preview that lets it grow would hide an overflow that only
  // shows up on the printed slab.
  const labelWidthPct =
    ((spec.labelWidthMm / spec.widthMm) * 100) /
    (1 - (2 * contentInsetX) / 100);
  const labelAspect = `${spec.labelWidthMm} / ${spec.labelHeightMm}`;

  const cardImage = card.imageUrl ?? CARD_IMAGE;

  // ---- The real thing ----
  //
  // Once the server has composited the selected artwork, show THAT file. Every
  // pixel below this branch is an approximation drawn in CSS, and an
  // approximation is exactly what the client rejected: a preview that differs
  // from the export is a preview that lies. The mock only survives for the gap
  // before the first generation finishes.
  if (compositeUrl) {
    return (
      <div
        className="relative isolate mx-auto w-full max-w-xs overflow-hidden rounded-2xl ring-1 ring-white/15"
        style={{ aspectRatio: `${spec.widthMm} / ${spec.heightMm}` }}
      >
        <Image
          src={compositeUrl}
          alt={`${card.name} slab — graded ${formatGrade(card.grade)}`}
          fill
          sizes="320px"
          unoptimized
          priority
          className="object-cover"
        />

        {showBleed && (
          <div
            aria-hidden
            className="absolute z-20 rounded-lg border border-dashed border-white/70"
            style={{
              top: `${bleedY}%`,
              bottom: `${bleedY}%`,
              left: `${bleedX}%`,
              right: `${bleedX}%`,
            }}
          />
        )}
      </div>
    );
  }

  // ---- Pre-generation stand-in ----
  //
  // Seeded so the same seed always renders the same placeholder art.
  const angle = Math.round(rand(seed, 1) * 360);
  const glowX = 20 + rand(seed, 2) * 60;
  const glowY = 20 + rand(seed, 3) * 60;

  return (
    // `isolate` scopes the z-10/z-20 layers below to this element's own stacking
    // context, so they can't paint over the page's sticky header on scroll.
    <div
      className="relative isolate mx-auto w-full max-w-xs overflow-hidden rounded-2xl ring-1 ring-white/15"
      style={{ aspectRatio: `${spec.widthMm} / ${spec.heightMm}` }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, #2e1065, #4c1d95, #0e7490)`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(circle at ${glowX}% ${glowY}%, #0e749099, transparent 55%)`,
        }}
      />

      {/* ---- Bleed / trim guide ---- */}
      {showBleed && (
        <div
          aria-hidden
          className="absolute z-20 rounded-lg border border-dashed border-white/70"
          style={{
            top: `${bleedY}%`,
            bottom: `${bleedY}%`,
            left: `${bleedX}%`,
            right: `${bleedX}%`,
          }}
        />
      )}

      {/* ---- Transparent slab case ----
          Mirrors buildCaseLayer in the server's slab.composite.ts: rim, inner
          lip, and the moulded tabs top and bottom. Sits above the artwork and
          below the guides, exactly as the composite layers it, so the stand-in
          and the finished export read as the same object. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-15">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/12 via-transparent to-transparent" />
        <div className="absolute inset-0 rounded-2xl ring-3 ring-white/20 ring-inset" />
        <div className="absolute inset-[3%] rounded-xl ring-1 ring-black/30 ring-inset" />
        <div className="absolute inset-[3.6%] rounded-xl ring-1 ring-white/20 ring-inset" />
        <div className="absolute top-0 left-1/2 h-[1.1%] w-[13%] -translate-x-1/2 rounded-full bg-white/50" />
        <div className="absolute bottom-0 left-1/2 h-[1.1%] w-[13%] -translate-x-1/2 rounded-full bg-white/50" />
      </div>

      {/* ---- Content sits inside the safe area ---- */}
      <div
        className="absolute inset-0 z-10 flex flex-col"
        style={{ padding: `${bleedY * 1.6}% ${bleedX * 1.6}%` }}
      >
        {/* ---- Grading label band — FIXED, at the TOP of the slab ----
            Mirrors the four-column strip the server composites in
            slab.composite.ts: wordmark │ card info │ grade │ Pixel ID.

            Frosted, not solid, to match buildFrostedBand: the server dims the
            artwork behind the band by BAND_FROST_BRIGHTNESS and lays a scrim of
            BAND_SCRIM_OPACITY over it. The two numbers below are those
            constants — a solid bar here would show the client a black plate
            while the export renders glass, on the exact detail he is judging.
            (CSS gets backdrop-filter; the server has to blur pixels by hand
            because SVG overlays cannot sample what is beneath them.) */}
        <div
          className="mx-auto flex items-stretch gap-1.5 overflow-hidden rounded-md bg-[#0B0B0C]/45 px-1.5 py-1 shadow-lg ring-1 ring-white/25 backdrop-blur-md backdrop-brightness-[0.55]"
          style={{ width: `${labelWidthPct}%`, aspectRatio: labelAspect }}
        >
          <div className="flex shrink-0 flex-col justify-center leading-none">
            <span className="text-[6px] font-bold tracking-wider text-white">
              PIXEL
            </span>
            <span className="text-[6px] font-bold tracking-wider text-white">
              GRADE
            </span>
          </div>

          <div className="w-px shrink-0 self-stretch bg-white/20" />

          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <p className="truncate text-[9px] leading-tight font-bold text-white">
              {card.name}
            </p>
            <p className="truncate text-[6px] leading-tight text-neutral-400">
              {[card.year, card.set].filter(Boolean).join(" ")}
            </p>
            <p className="truncate text-[6px] leading-tight text-neutral-500">
              {[card.number, card.language].filter(Boolean).join(" · ")}
            </p>
            {card.pixelVerified && (
              <span className="inline-flex items-center gap-0.5 text-[5px] leading-tight font-bold text-emerald-400">
                <MdVerified size={5} />
                PIXEL VERIFIED
              </span>
            )}
          </div>

          <div className="w-px shrink-0 self-stretch bg-white/20" />

          <div className="flex shrink-0 flex-col items-center justify-center leading-none">
            <span className="text-[15px] font-bold text-white tabular-nums">
              {formatGrade(card.grade)}
            </span>
            <span className="text-[5px] font-bold tracking-wider text-amber-300">
              {card.gradeLabel.toUpperCase()}
            </span>
          </div>

          <div className="flex shrink-0 flex-col justify-center text-right leading-none">
            <span className="text-[5px] tracking-wider text-neutral-500">
              PIXEL ID
            </span>
            <span className="text-[5px] text-neutral-300">{card.pixelId}</span>
          </div>
        </div>

        {/* ---- Card window — FIXED, sized to the real 65 × 90 mm opening.
            Shows the user's own scanned card, which is what the server
            composites; CARD_IMAGE is only a fallback. ---- */}
        <div className="flex flex-1 items-center justify-center py-[4%]">
          <div
            className="relative overflow-hidden rounded-[3px] shadow-[0_4px_20px_rgba(0,0,0,0.6)] ring-1 ring-black/30"
            style={{
              width: `${openingWidthPct}%`,
              aspectRatio: `${spec.openingWidthMm} / ${spec.openingHeightMm}`,
            }}
          >
            <Image
              src={cardImage}
              alt={`${card.name} — graded ${formatGrade(card.grade)}`}
              fill
              sizes="200px"
              // Cloudinary-hosted scans are outside the optimizer's allowlist.
              unoptimized={cardImage !== CARD_IMAGE}
              // `contain`, not `cover`: a card whose aspect ratio differs
              // slightly from the window must be letterboxed, never cropped —
              // cropping cuts the edges the grade is about.
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
