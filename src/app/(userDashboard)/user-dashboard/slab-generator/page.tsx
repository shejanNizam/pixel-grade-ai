"use client";

import { App } from "antd";
import { useState } from "react";
import ExportBar from "../_components/slab-generator/ExportBar";
import SlabControls from "../_components/slab-generator/SlabControls";
import SlabPreview from "../_components/slab-generator/SlabPreview";
import {
  backgroundStyles,
  gradedCards,
  slabSpecs,
} from "../_components/slab-generator/data";

/** How long the fake generate takes — stands in for the image-model call. */
const GENERATE_MS = 900;

export default function SlabGenerator() {
  const { message } = App.useApp();

  const [card, setCard] = useState(gradedCards[0]);
  const [style, setStyle] = useState(backgroundStyles[0]);
  const [spec, setSpec] = useState(slabSpecs[0]);
  const [showBleed, setShowBleed] = useState(true);
  const [seed, setSeed] = useState(1);
  const [generating, setGenerating] = useState(false);

  const regenerate = () => {
    setGenerating(true);
    // The real call returns a new background image for the same card + label.
    setTimeout(() => {
      setSeed((s) => s + 1);
      setGenerating(false);
      message.success("New background generated (demo).");
    }, GENERATE_MS);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-white">Slab Generator</h2>
        <p className="mt-1.5 text-xs text-zinc-500">
          Create a custom, print-ready slab label. The card and label stay
          fixed — AI generates the artwork around them.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-12">
        {/* ---- Preview ---- */}
        <div className="space-y-6">
          <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-6">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-sm font-medium text-white">Preview</h3>
              <span className="text-[11px] text-zinc-500">
                {style.label} · {spec.label}
              </span>
            </div>

            <div className={generating ? "animate-pulse" : undefined}>
              <SlabPreview
                card={card}
                style={style}
                spec={spec}
                seed={seed}
                showBleed={showBleed}
              />
            </div>

            <p className="mt-5 text-center text-[11px] text-zinc-500">
              Dashed line marks the trim edge. Artwork extends past it so the
              print has no white margin.
            </p>
          </section>

          <ExportBar card={card} spec={spec} disabled={generating} />
        </div>

        {/* ---- Controls ---- */}
        <SlabControls
          card={card}
          style={style}
          spec={spec}
          showBleed={showBleed}
          generating={generating}
          onCardChange={setCard}
          onStyleChange={setStyle}
          onSpecChange={setSpec}
          onBleedChange={setShowBleed}
          onRegenerate={regenerate}
        />
      </div>
    </div>
  );
}
