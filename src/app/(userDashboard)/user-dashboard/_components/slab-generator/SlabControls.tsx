"use client";

import { Select, Switch } from "antd";
import { FiRefreshCw } from "react-icons/fi";
import {
  backgroundStyles,
  slabSpecs,
  type BackgroundStyle,
  type GradedCard,
  type SlabSpec,
} from "./data";

interface SlabControlsProps {
  /** The user's graded reports — the only cards that can be slabbed. */
  cards: GradedCard[];
  card: GradedCard;
  style: BackgroundStyle;
  spec: SlabSpec;
  showBleed: boolean;
  generating: boolean;
  onCardChange: (card: GradedCard) => void;
  onStyleChange: (style: BackgroundStyle) => void;
  onSpecChange: (spec: SlabSpec) => void;
  onBleedChange: (show: boolean) => void;
  onRegenerate: () => void;
}

export default function SlabControls({
  cards,
  card,
  style,
  spec,
  showBleed,
  generating,
  onCardChange,
  onStyleChange,
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

      {/* ---- Background ---- */}
      <section>
        <h3 className="text-sm font-medium text-white">Background artwork</h3>
        <p className="mt-1 text-[11px] text-zinc-500">
          AI fills the area around the card and label. Both stay fixed.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-2">
          {backgroundStyles.map((s) => {
            const active = s.id === style.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onStyleChange(s)}
                aria-pressed={active}
                className={`overflow-hidden rounded-xl border p-2 text-left transition-colors ${
                  active
                    ? "border-violet-500 bg-violet-500/10"
                    : "border-white/10 bg-[#0d0d0f] hover:border-white/25"
                }`}
              >
                <span
                  aria-hidden
                  className="block h-8 w-full rounded-md"
                  style={{
                    backgroundImage: `linear-gradient(120deg, ${s.stops[0]}, ${s.stops[1]}, ${s.stops[2]})`,
                  }}
                />
                <span
                  className={`mt-1.5 block text-[11px] ${
                    active ? "text-white" : "text-zinc-400"
                  }`}
                >
                  {s.label}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={onRegenerate}
          disabled={generating}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 py-2.5 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <FiRefreshCw size={13} className={generating ? "animate-spin" : ""} />
          {generating ? "Generating…" : "Regenerate background"}
        </button>
      </section>

      {/* ---- Print ---- */}
      <section>
        <h3 className="text-sm font-medium text-white">Print</h3>

        <label
          htmlFor="slab-size"
          className="mt-3 mb-1.5 block text-[11px] text-zinc-400"
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
