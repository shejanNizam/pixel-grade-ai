import Image from "next/image";
import { MdVerified } from "react-icons/md";
import { CARD_IMAGE, type BackgroundStyle, type GradedCard, type SlabSpec } from "./data";

interface SlabPreviewProps {
  card: GradedCard;
  style: BackgroundStyle;
  spec: SlabSpec;
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

/**
 * The slab template.
 *
 * The label band and the card window are FIXED placeholders — the generated
 * artwork is painted around them and can never cover or shift them. Only the
 * background layer changes when the user regenerates.
 */
export default function SlabPreview({
  card,
  style,
  spec,
  seed,
  showBleed,
}: SlabPreviewProps) {
  const [from, via, to] = style.stops;

  // Seeded variation of the placeholder art: angle + two glow positions.
  const angle = Math.round(rand(seed, 1) * 360);
  const glowX = 20 + rand(seed, 2) * 60;
  const glowY = 20 + rand(seed, 3) * 60;

  // Bleed as a % of the slab, so the guide scales with the preview.
  const bleedX = (spec.bleedMm / spec.widthMm) * 100;
  const bleedY = (spec.bleedMm / spec.heightMm) * 100;

  return (
    <div
      className="relative mx-auto w-full max-w-xs overflow-hidden rounded-2xl ring-1 ring-white/15"
      style={{ aspectRatio: `${spec.widthMm} / ${spec.heightMm}` }}
    >
      {/* ---- AI background layer (the only part regeneration touches) ---- */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${angle}deg, ${from}, ${via}, ${to})`,
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `radial-gradient(circle at ${glowX}% ${glowY}%, ${to}99, transparent 55%)`,
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

      {/* ---- Content sits inside the safe area ---- */}
      <div
        className="absolute inset-0 z-10 flex flex-col"
        style={{ padding: `${bleedY * 1.6}% ${bleedX * 1.6}%` }}
      >
        {/* Label band — FIXED placeholder */}
        <div className="rounded-md bg-white px-2 py-1.5 shadow-lg">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate text-[10px] leading-tight font-bold text-black uppercase">
                {card.name}
              </p>
              <p className="truncate text-[7px] leading-tight text-neutral-600">
                {card.set} · {card.number} · {card.language}
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              {card.pixelVerified && (
                <span
                  title="Pixel Verified — inspected with PixelScope"
                  className="inline-flex items-center gap-0.5 rounded bg-blue-600 px-1 py-0.5 text-[6px] font-bold text-white"
                >
                  <MdVerified size={7} />
                  PIXEL VERIFIED
                </span>
              )}
              <span className="rounded bg-black px-1.5 py-0.5 text-center leading-none text-white">
                <span className="block text-[6px] font-medium">
                  {card.gradeLabel}
                </span>
                <span className="block text-[11px] font-bold tabular-nums">
                  {card.grade.toFixed(1)}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Card window — FIXED placeholder */}
        <div className="flex flex-1 items-center justify-center py-[6%]">
          <Image
            src={CARD_IMAGE}
            alt={`${card.name} — graded ${card.grade.toFixed(1)}`}
            width={280}
            height={392}
            className="max-h-full w-[76%] rounded-[3px] object-contain shadow-[0_4px_20px_rgba(0,0,0,0.6)] ring-1 ring-black/30"
          />
        </div>

        {/* Cert footer — part of the fixed label system */}
        <p className="text-center text-[6px] font-medium tracking-widest text-white/80 uppercase drop-shadow">
          PixelGrade AI · {card.certNumber}
        </p>
      </div>
    </div>
  );
}
