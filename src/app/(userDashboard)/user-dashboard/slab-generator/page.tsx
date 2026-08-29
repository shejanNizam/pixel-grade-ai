"use client";

import { useGetMyGradingReportsQuery } from "@/redux/features/grading/gradingApi";
import {
  useCreateSlabLabelMutation,
  useRegenerateSlabMutation,
  useSelectSlabVariantMutation,
  type TSlabLabel,
} from "@/redux/features/slab/slabApi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import { getApiErrorMessage } from "@/utils/apiError";
import { App } from "antd";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";
import CreditBalanceCard from "../_components/new-analysis/CreditBalanceCard";
import ExportBar from "../_components/slab-generator/ExportBar";
import SlabControls from "../_components/slab-generator/SlabControls";
import SlabPreview from "../_components/slab-generator/SlabPreview";
import { slabSpecs, type GradedCard } from "../_components/slab-generator/data";

function SlabGeneratorScreen() {
  const { message } = App.useApp();

  // "Buy Slab" on a collection card deep-links here with the card's report id
  // so the user never has to pick it out of the list — or re-upload the card —
  // a second time.
  const requestedReportId = useSearchParams().get("reportId");

  const { data: reports, isLoading } = useGetMyGradingReportsQuery({
    limit: 50,
    sort: "-createdAt",
  });

  // The band prints the owner's avatar and @handle in its first column, so the
  // pre-generation stand-in needs them to show the band that will actually
  // print. The server takes these from the authenticated user, never from the
  // request — this query is only so the preview does not have to guess.
  const { data: me } = useGetMeQuery();
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

  /**
   * An explicit pick in the controls always wins. Failing that, honour the
   * `?reportId` a "Buy Slab" click arrived with, and only then fall back to the
   * most recent report.
   */
  const card = useMemo(() => {
    if (cardId) return cards.find((c) => c.id === cardId) ?? cards[0];
    if (requestedReportId) {
      const requested = cards.find((c) => c.id === requestedReportId);
      if (requested) return requested;
    }
    return cards[0];
  }, [cards, cardId, requestedReportId]);

  /**
   * The picker only holds the 50 most recent reports, so a deep link to an
   * older one lands on the wrong card. Say so rather than quietly slabbing
   * whatever happens to be at the top of the list.
   */
  const requestedMissing =
    !isLoading &&
    Boolean(requestedReportId) &&
    !cards.some((c) => c.id === requestedReportId);

  const label = card ? labels[card.id] : undefined;
  const composite = label?.compositeUrl;
  const variants = label?.variants ?? [];
  const selectedVariant = label?.selectedVariant;

  const handleGenerate = async () => {
    if (!card || generating) return;
    setGenerating(true);
    try {
      const created = await createLabel({ reportId: card.id }).unwrap();
      setLabels((current) => ({ ...current, [card.id]: created }));
      message.success("Generated artwork for " + card.name + "!");
    } catch (err) {
      message.error(
        getApiErrorMessage(err, "Couldn't generate artwork. Try again."),
      );
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!card || !label || generating) return;
    setGenerating(true);
    try {
      const updated = await regenerateLabel({ labelId: label._id }).unwrap();
      setLabels((current) => ({ ...current, [card.id]: updated }));
      message.success("Generated new artwork variant!");
    } catch (err) {
      message.error(
        getApiErrorMessage(err, "Couldn't regenerate artwork. Try again."),
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-medium text-white">Slab Generator</h2>
            <p className="mt-1.5 text-xs text-zinc-500">
              Create a custom, print-ready slab label. The card and label stay
              fixed — AI generates the artwork around them.
            </p>
          </div>
          <CreditBalanceCard />
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-medium text-white">Slab Generator</h2>
          <p className="mt-1.5 text-xs text-zinc-500">
            Create a custom, print-ready slab label. The card and label stay fixed
            — AI generates the artwork around them.
          </p>
        </div>
        <CreditBalanceCard />
      </div>

      {requestedMissing && (
        <p className="rounded-xl border border-amber-500/40 bg-amber-500/5 px-4 py-3 text-xs text-amber-300">
          That card isn&apos;t in your 50 most recent reports — pick it from the
          card list on the right.
        </p>
      )}

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
                  ownerUsername={me?.username}
                  ownerAvatarUrl={me?.avatar?.url}
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

            {/* The label's OWN stored geometry, not the spec's — a label
                already exported keeps the layout it was sold at. */}
            <ExportBar
              card={card}
              spec={spec}
              disabled={generating}
              labelId={label?._id}
              labelWidthMm={label?.labelWMm}
              labelHeightMm={label?.labelHMm}
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
            onRegenerate={label ? handleRegenerate : handleGenerate}
          />
        </div>
      )}
    </div>
  );
}

/** `useSearchParams` needs a Suspense boundary above it to prerender. */
export default function SlabGenerator() {
  return (
    <Suspense
      fallback={
        <div className="h-96 animate-pulse rounded-2xl border border-violet-500/40 bg-[#111113]" />
      }
    >
      <SlabGeneratorScreen />
    </Suspense>
  );
}
