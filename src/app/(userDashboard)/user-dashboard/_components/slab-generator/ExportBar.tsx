"use client";

import { App } from "antd";
import { FiDownload, FiFileText, FiImage } from "react-icons/fi";
import type { GradedCard, SlabSpec } from "./data";

/** Print resolution the export is rendered at, server-side. */
const EXPORT_DPI = 300;

const MM_PER_INCH = 25.4;

interface ExportBarProps {
  card: GradedCard;
  spec: SlabSpec;
  disabled: boolean;
  /** Server-rendered exports — present once the slab has been generated. */
  pngUrl?: string;
  pdfUrl?: string;
}

/** mm -> pixels at the export DPI, including bleed on both edges. */
function pxWithBleed(mm: number, bleedMm: number) {
  return Math.round(((mm + bleedMm * 2) / MM_PER_INCH) * EXPORT_DPI);
}

export default function ExportBar({
  card,
  spec,
  disabled,
  pngUrl,
  pdfUrl,
}: ExportBarProps) {
  const { message } = App.useApp();

  const widthPx = pxWithBleed(spec.widthMm, spec.bleedMm);
  const heightPx = pxWithBleed(spec.heightMm, spec.bleedMm);

  // Exports are rendered server-side — the card and label are composited
  // there so the placeholders can't be knocked out of place.
  const download = (format: "PNG" | "PDF") => {
    const url = format === "PNG" ? pngUrl : pdfUrl;
    if (!url) {
      message.info(`Generate ${card.name}'s slab first, then export.`);
      return;
    }
    window.open(url, "_blank", "noopener");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-[#111113] p-4">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-medium text-white">
            <FiDownload size={14} className="text-violet-400" />
            Print-ready export
          </h3>
          <p className="mt-1 text-[11px] text-zinc-500 tabular-nums">
            {spec.widthMm} × {spec.heightMm} mm + {spec.bleedMm} mm bleed ·{" "}
            {widthPx} × {heightPx} px @ {EXPORT_DPI} DPI
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={disabled}
            onClick={() => download("PNG")}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiImage size={13} />
            PNG
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => download("PDF")}
            className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiFileText size={13} />
            PDF
          </button>
        </div>
      </div>
    </div>
  );
}
