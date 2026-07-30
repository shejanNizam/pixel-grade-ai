"use client";

import { useGetMyGradingReportsQuery } from "@/redux/features/grading/gradingApi";
import {
  useCreateSlabLabelMutation,
  useRegenerateSlabMutation,
  useSelectSlabVariantMutation,
  type TSlabLabel,
} from "@/redux/features/slab/slabApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App } from "antd";
import Link from "next/link";
import { useMemo, useState } from "react";
import ExportBar from "../_components/slab-generator/ExportBar";
import SlabControls from "../_components/slab-generator/SlabControls";
import SlabPreview from "../_components/slab-generator/SlabPreview";
import { slabSpecs, type GradedCard } from "../_components/slab-generator/data";

export default function SlabGenerator() {
  const { message } = App.useApp();

  const { data: reports, isLoading } = useGetMyGradingReportsQuery({
    limit: 50,
    sort: "-createdAt",
  });
  const [createLabel] = useCreateSlabLabelMutation();
  const [regenerateLabel] = useRegenerateSlabMutation();
  const [selectVariantMutation] = useSelectSlabVariantMutation();

  // Only graded cards can be slabbed — the picker is the user's reports.
  const cards: GradedCard[] = useMemo(
    () =>
      (reports?.data ?? []).map((report) => {
        const card = typeof report.card === "object" ? report.card : null;
        return {
          id: report._id,
          name: card?.name ?? "Card",
          set: card?.setExpansion ?? "",
          number: card?.cardNumber ?? "",
          language: card?.language ?? "English",
          year: card?.releaseYear ? String(card.releaseYear) : undefined,
          grade: report.grade,
          gradeLabel: report.gradeLabel,
          confidence: report.confidence,
          pixelVerified: report.pixelVerified,
          // MUST match `pixelIdFor` in the server's slab.service.ts — same
          // slice length (10, not 8) and the same case. The preview showing a
          // different id than the printed band is worse than showing none.
          pixelId: `PG-${report._id.slice(-10).toUpperCase()}`,
          // The confirmed card's artwork rather than a stock placeholder. The
          // printed slab goes further and composites the user's OWN front
          // photo, which only the server has access to.
          imageUrl: card?.officialImageUrl,
        };
      }),
    [reports],
  );

  const [cardId, setCardId] = useState<string | null>(null);
  const [spec, setSpec] = useState(slabSpecs[0]);
  const [showBleed, setShowBleed] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [selecting, setSelecting] = useState(false);
  /** The rendered label for the current card, keyed by report id. */
  const [labels, setLabels] = useState<Record<string, TSlabLabel>>({});

  const card = cards.find((c) => c.id === cardId) ?? cards[0];
  const label = card ? labels[card.id] : undefined;

  const variants = label?.variants ?? [];
  const selectedVariant = label?.selectedVariant;
  const composite = label?.compositeUrl;

  /**
   * Produces the four EXT. ART options.
   *
   * ⚠️ FOUR billed image generations per press, both on first generate and on
   * every regenerate. It is triggered by an explicit user action on this
   * screen — deliberately NOT on scan — so a scan that never becomes a slab
   * order costs nothing in artwork.
   */
  const generate = async () => {
    if (!card || generating) return;
    setGenerating(true);
    try {
      // First press creates the label and its four options; after that,
      // regenerate throws them away and produces four completely new ones.
      const next = label
        ? await regenerateLabel({ labelId: label._id }).unwrap()
        : await createLabel({ reportId: card.id }).unwrap();

      setLabels((current) => ({ ...current, [card.id]: next }));
      message.success(
        label
          ? "Four new artwork options generated."
          : "Slab label generated — pick your artwork.",
      );
    } catch (err) {
      message.error(
        getApiErrorMessage(err, "Couldn't generate the slab. Try again."),
      );
    } finally {
      setGenerating(false);
    }
  };

  /**
   * Switches which EXT. ART option the slab uses.
   *
   * Free at the image provider — all four were composited when the batch was
   * generated, so the server only re-points the export and rebuilds the PDF.
   */
  const selectVariant = async (index: number) => {
    if (!card || !label || selecting || index === selectedVariant) return;
    setSelecting(true);
    try {
      const next = await selectVariantMutation({
        labelId: label._id,
        variantIndex: index,
      }).unwrap();
      setLabels((current) => ({ ...current, [card.id]: next }));
    } catch (err) {
      message.error(
        getApiErrorMessage(err, "Couldn't select that artwork. Try again."),
      );
    } finally {
      setSelecting(false);
    }
  };

  if (!isLoading && cards.length === 0) {
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-medium text-white">Slab Generator</h2>
          <p className="mt-1.5 text-xs text-zinc-500">
            Create a custom, print-ready slab label. The card and label stay
            fixed — AI generates the artwork around them.
          </p>
        </div>

        <div className="rounded-2xl border border-dashed border-violet-500/40 bg-[#111113] px-6 py-12 text-center">
          <p className="text-sm text-zinc-400">
            Only graded cards can be slabbed — scan and grade a card first.
          </p>
          <Link
            href="/user-dashboard/new-analysis"
            className="mt-5 inline-flex rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
          >
            Start a scan
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-white">Slab Generator</h2>
        <p className="mt-1.5 text-xs text-zinc-500">
          Create a custom, print-ready slab label. The card and label stay fixed
          — AI generates the artwork around them.
        </p>
      </div>

      {isLoading || !card ? (
        <div className="h-96 animate-pulse rounded-2xl border border-violet-500/40 bg-[#111113]" />
      ) : (
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)] lg:gap-12">
          {/* ---- Preview ---- */}
          <div className="space-y-6">
            <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h3 className="text-sm font-medium text-white">Preview</h3>
                <span className="text-[11px] text-zinc-500">
                  {selectedVariant ? `EXT. ART ${selectedVariant} · ` : ""}
                  {spec.label}
                  {label && ` · v${label.version}`}
                </span>
              </div>

              {/* One component for both states — it swaps to the server
                  composite the moment there is one, so the bleed guide and
                  the frame stay identical across the transition. */}
              <div
                className={generating || selecting ? "opacity-60" : undefined}
              >
                <SlabPreview
                  card={card}
                  spec={spec}
                  compositeUrl={composite}
                  seed={1}
                  showBleed={showBleed}
                />
              </div>

              <p className="mt-5 text-center text-[11px] text-zinc-500">
                {composite
                  ? "Server-rendered composite — exactly what the export contains."
                  : "Layout preview. Generate the artwork to render the real slab."}
              </p>

              {/* Disclosure, not decoration.
                  When the card in the window is an AI rendering rather than a
                  photograph, the slab still carries a real grade and a
                  scannable Pixel ID beside it — so it has to say plainly that
                  the picture is not the graded card. Without this the slab
                  reads as evidence of a condition nobody photographed. */}
              {label?.cardImageSource === "generated" && (
                <p className="mt-2 text-center text-[11px] text-amber-400/80">
                  Card image is AI-generated artwork, not a photograph of the
                  graded card.
                </p>
              )}
            </section>

            <ExportBar
              card={card}
              spec={spec}
              disabled={generating}
              pngUrl={label?.exportPngUrl}
              pdfUrl={label?.exportPdfUrl}
            />
          </div>

          {/* ---- Controls ---- */}
          <SlabControls
            cards={cards}
            card={card}
            variants={variants}
            selectedVariant={selectedVariant}
            spec={spec}
            showBleed={showBleed}
            generating={generating}
            selecting={selecting}
            onCardChange={(next) => setCardId(next.id)}
            onVariantSelect={selectVariant}
            onSpecChange={setSpec}
            onBleedChange={setShowBleed}
            onRegenerate={generate}
          />
        </div>
      )}
    </div>
  );
}
