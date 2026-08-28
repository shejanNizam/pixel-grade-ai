"use client";

import type { TSlabVariant } from "@/redux/features/slab/slabApi";
import { Select, Switch } from "antd";
import Image from "next/image";
import { FiRefreshCw } from "react-icons/fi";
import {
  EXT_ART_COUNT,
  slabSpecs,
  type GradedCard,
  type SlabSpec,
} from "./data";

interface SlabControlsProps {
  /** The user's graded reports — the only cards that can be slabbed. */
  cards: GradedCard[];
  card: GradedCard;
  /** The four EXT. ART options. Empty until a batch has been generated. */
  variants: TSlabVariant[];
  /** 1-based index of the chosen option. */
  selectedVariant?: number;
  spec: SlabSpec;
  showBleed: boolean;
  /** A generation batch is in flight — four billed images. */
  generating: boolean;
  /** A selection is being saved. Cheap, but it still round-trips. */
  selecting: boolean;
  onCardChange: (card: GradedCard) => void;
  onVariantSelect: (index: number) => void;
  onSpecChange: (spec: SlabSpec) => void;
  onBleedChange: (show: boolean) => void;
  onRegenerate: () => void;
}

export default function SlabControls({
  cards,
  card,
  variants,
  selectedVariant,
  spec,
  showBleed,
  generating,
  selecting,
  onCardChange,
  onVariantSelect,
  onSpecChange,
  onBleedChange,
  onRegenerate,
}: SlabControlsProps) {
  return (
    <div className="space-y-7">
      {/* ---- Card ---- */}
      <section>
        <h3 className="text-sm font-medium text-white">Card</h3>
        <p className="mt-1 text-[11px] text-zinc-500">
          Only graded cards can be slabbed.
        </p>

        <Select
          value={card.id}
          onChange={(id) => {
            const next = cards.find((c) => c.id === id);
            if (next) onCardChange(next);
          }}
          size="large"
          className="mt-3 w-full"
          options={cards.map((c) => ({
            value: c.id,
            label: `${c.name} — ${c.grade.toFixed(1)} ${c.gradeLabel}`,
          }))}
        />

        <dl className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-[#0d0d0f] p-3">
          <div>
            <dt className="text-[10px] text-zinc-500">Confidence</dt>
            <dd className="mt-0.5 text-xs font-medium text-white tabular-nums">
              {card.confidence} %
            </dd>
          </div>
          <div>
            <dt className="text-[10px] text-zinc-500">Pixel Verified</dt>
            <dd
              className={`mt-0.5 text-xs font-medium ${
                card.pixelVerified ? "text-blue-400" : "text-zinc-500"
              }`}
            >
              {card.pixelVerified ? "Yes" : "No"}
            </dd>
          </div>
        </dl>

        {!card.pixelVerified && (
          <p className="mt-2 text-[11px] text-zinc-500">
            Rescan with PixelScope to earn the badge — it is awarded
            automatically and cannot be added by hand.
          </p>
        )}
      </section>

      {/* ---- Generate Label Section ---- */}
      <section className="rounded-xl border border-violet-500/30 bg-violet-500/10 p-4 space-y-3">
        <div>
          <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
            <FiRefreshCw className="text-violet-400" /> Custom Slab Label
          </h3>
          <p className="text-[11px] text-zinc-400 mt-0.5">
            Generate or refresh the custom 70 × 20 mm grading label for {card.name}.
          </p>
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={generating || selecting}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-violet-500 shadow-md shadow-violet-600/30 disabled:opacity-50 cursor-pointer"
        >
          <FiRefreshCw size={14} className={generating ? "animate-spin" : ""} />
          <span>{generating ? "Generating Label…" : "Generate Label"}</span>
        </button>
      </section>

      {/* ---- Background artwork: disabled for initial launch per client instructions (LABEL-ONLY) ---- */}
      {false && (
        <section>
          <h3 className="text-sm font-medium text-white">Background artwork</h3>
          <p className="mt-1 text-[11px] text-zinc-500">
            Choose the extended artwork that best matches your card.
          </p>

          <div className="mt-3 grid grid-cols-2 gap-2">
            {variants.length === 0
              ? Array.from({ length: EXT_ART_COUNT }, (_, i) => (
                  <div
                    key={i}
                    className="overflow-hidden rounded-xl border border-white/10 bg-[#0d0d0f] p-1.5"
                  >
                    <div
                      className={`aspect-4/5 w-full rounded-md bg-white/5 ${
                        generating ? "animate-pulse" : ""
                      }`}
                    />
                    <span className="mt-1.5 block text-[10px] tracking-wider text-zinc-600">
                      EXT. ART {i + 1}
                    </span>
                  </div>
                ))
              : variants.map((variant) => {
                  const active = variant.index === selectedVariant;
                  return (
                    <button
                      key={variant.index}
                      type="button"
                      onClick={() => onVariantSelect(variant.index)}
                      disabled={generating || selecting}
                      aria-pressed={active}
                      aria-label={`Use EXT. ART ${variant.index}`}
                      className={`overflow-hidden rounded-xl border p-1.5 text-left transition-colors disabled:cursor-not-allowed ${
                        active
                          ? "border-violet-500 bg-violet-500/10"
                          : "border-white/10 bg-[#0d0d0f] hover:border-white/25"
                      }`}
                    >
                      <Image
                        src={variant.artworkUrl}
                        alt=""
                        width={160}
                        height={200}
                        unoptimized
                        className="aspect-4/5 w-full rounded-md object-cover"
                      />
                      <span
                        className={`mt-1.5 block text-[10px] tracking-wider ${
                          active ? "text-white" : "text-zinc-400"
                        }`}
                      >
                        EXT. ART {variant.index}
                      </span>
                    </button>
                  );
                })}
          </div>

          <button
            type="button"
            onClick={onRegenerate}
            disabled={generating || selecting}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 py-2.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiRefreshCw size={13} className={generating ? "animate-spin" : ""} />
            {generating ? "Generating…" : "Regenerate artwork"}
          </button>
        </section>
      )}

      {/* ---- Slab Size & Controls ---- */}
      <section>
        <label
          htmlFor="slab-size"
          className="mb-1.5 block text-[11px] text-zinc-400"
        >
          Slab size
        </label>
        <Select
          id="slab-size"
          value={spec.id}
          onChange={(id) => {
            const next = slabSpecs.find((s) => s.id === id);
            if (next) onSpecChange(next);
          }}
          size="large"
          className="w-full"
          options={slabSpecs.map((s) => ({
            value: s.id,
            label: `${s.label} — ${s.widthMm} × ${s.heightMm} mm`,
          }))}
        />

        <div className="mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-[#0d0d0f] px-3 py-2.5">
          <div>
            <p className="text-xs text-white">Show bleed &amp; trim guide</p>
            <p className="text-[10px] text-zinc-500">
              {spec.bleedMm} mm bleed · {spec.safeMm} mm safe area
            </p>
          </div>
          <Switch
            size="small"
            checked={showBleed}
            onChange={onBleedChange}
            aria-label="Show bleed and trim guide"
          />
        </div>

        {/* Confirmed slab spec. The card opening is fixed; artwork only fills
            the printable area around it. */}
        <p className="mt-2 text-[10px] text-zinc-500">
          Card opening fixed at {spec.openingWidthMm} × {spec.openingHeightMm}{" "}
          mm. May be adjusted when the printer&apos;s final spec sheet arrives.
        </p>
      </section>
    </div>
  );
}
