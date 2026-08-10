"use client";

import {
  useExportLabelOnlyMutation,
  useExportPrintSlabMutation,
} from "@/redux/features/slab/slabApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App } from "antd";
import { useState } from "react";
import { FiDownload, FiFileText, FiImage, FiShoppingBag, FiTag } from "react-icons/fi";
import type { GradedCard, SlabSpec } from "./data";
import OrderSlabModal from "./OrderSlabModal";

/** Print resolution the export is rendered at, server-side. */
const EXPORT_DPI = 300;

const MM_PER_INCH = 25.4;

interface ExportBarProps {
  card: GradedCard;
  spec: SlabSpec;
  disabled: boolean;
  /** The rendered label — exports are unavailable until the slab is generated. */
  labelId?: string;
  /** Label band dimensions, so the "Label Only" file states its own size
   *  rather than the slab's. Falls back to the spec's defaults. */
  labelWidthMm?: number;
  labelHeightMm?: number;
}

/** mm -> pixels at the export DPI, including bleed on both edges. */
function pxWithBleed(mm: number, bleedMm: number) {
  return Math.round(((mm + bleedMm * 2) / MM_PER_INCH) * EXPORT_DPI);
}

/** mm -> pixels at the export DPI, no bleed. The label band prints trimmed. */
function px(mm: number) {
  return Math.round((mm / MM_PER_INCH) * EXPORT_DPI);
}

type ExportKind = "print" | "label";
type Format = "png" | "pdf";

export default function ExportBar({
  card,
  spec,
  disabled,
  labelId,
  labelWidthMm = spec.labelWidthMm,
  labelHeightMm = spec.labelHeightMm,
}: ExportBarProps) {
  const { message } = App.useApp();

  const [exportPrint] = useExportPrintSlabMutation();
  const [exportLabel] = useExportLabelOnlyMutation();
  const [busy, setBusy] = useState<string | null>(null);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const widthPx = pxWithBleed(spec.widthMm, spec.bleedMm);
  const heightPx = pxWithBleed(spec.heightMm, spec.bleedMm);

  /**
   * Both endpoints stream an authenticated binary attachment, so the file has
   * to come back through RTK Query as a blob — a plain `window.open` on the URL
   * would arrive without the bearer token and 401.
   */
  const download = async (kind: ExportKind, format: Format) => {
    if (!labelId) {
      message.info(`Generate ${card.name}'s slab first, then export.`);
      return;
    }
    if (busy) return;

    const key = `${kind}-${format}`;
    setBusy(key);
    try {
      const run = kind === "print" ? exportPrint : exportLabel;
      const blob = await run({ labelId, format }).unwrap();

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download =
        kind === "print"
          ? `slab_print_${labelId}.${format}`
          : `label_only_${labelId}.${format}`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      // Revoking immediately can cancel the download in some browsers.
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (err) {
      message.error(
        getApiErrorMessage(err, "Couldn't build that file. Try again."),
      );
    } finally {
      setBusy(null);
    }
  };

  const buttons = (kind: ExportKind) => (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={disabled || busy !== null}
        onClick={() => download(kind, "png")}
        className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiImage size={13} />
        {busy === `${kind}-png` ? "Building…" : "PNG"}
      </button>
      <button
        type="button"
        disabled={disabled || busy !== null}
        onClick={() => download(kind, "pdf")}
        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FiFileText size={13} />
        {busy === `${kind}-pdf` ? "Building…" : "PDF"}
      </button>
    </div>
  );

  return (
    <div className="space-y-3">
      {/* ---- Order Physical Slab ---- */}
      <div className="rounded-2xl border border-violet-500/40 bg-linear-to-r from-violet-950/60 to-black p-4 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
              <FiShoppingBag size={15} className="text-amber-400" />
              Order Physical Custom Slab
            </h3>
            <p className="mt-1 text-xs text-zinc-300">
              Get this exact slab design produced in-house and shipped directly to your address.
            </p>
          </div>

          <button
            type="button"
            disabled={disabled || !labelId}
            onClick={() => setOrderModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-linear-to-r from-amber-400 to-amber-500 px-6 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-102 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <FiShoppingBag size={14} />
            Order Slab ($24.99)
          </button>
        </div>
      </div>

      {/* ---- Full slab, card window left blank ---- */}
      <div className="rounded-2xl border border-white/10 bg-[#111113] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-medium text-white">
              <FiDownload size={14} className="text-violet-400" />
              Print-ready export — full slab
            </h3>
            <p className="mt-1 text-[11px] text-zinc-500 tabular-nums">
              {spec.widthMm} × {spec.heightMm} mm + {spec.bleedMm} mm bleed ·{" "}
              {widthPx} × {heightPx} px @ {EXPORT_DPI} DPI
            </p>
            {/* The preview shows the card in the window; this file does not.
                Saying so here is what stops it being reported as a bug. */}
            <p className="mt-1.5 text-[11px] text-zinc-400">
              The card window is left blank so the press prints only the slab
              artwork around your card.
            </p>
          </div>

          {buttons("print")}
        </div>
      </div>

      {/* ---- Grading label alone ---- */}
      <div className="rounded-2xl border border-white/10 bg-[#111113] p-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-medium text-white">
              <FiTag size={14} className="text-violet-400" />
              Label only
            </h3>
            <p className="mt-1 text-[11px] text-zinc-500 tabular-nums">
              {labelWidthMm} × {labelHeightMm} mm · {px(labelWidthMm)} ×{" "}
              {px(labelHeightMm)} px @ {EXPORT_DPI} DPI
            </p>
            <p className="mt-1.5 text-[11px] text-zinc-400">
              Just the grading label, at print size — for printing your own
              labels at home.
            </p>
          </div>

          {buttons("label")}
        </div>
      </div>

      <OrderSlabModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        card={card}
        spec={spec}
        slabId={labelId}
      />
    </div>
  );
}
