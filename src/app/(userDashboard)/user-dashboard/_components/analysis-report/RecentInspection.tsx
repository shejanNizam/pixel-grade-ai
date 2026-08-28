"use client";

import { useAddCollectionItemMutation, useGetMyCollectionQuery } from "@/redux/features/collection/collectionApi";
import {
  useGetMyGradingReportsQuery,
  type TDefectSeverity,
} from "@/redux/features/grading/gradingApi";
import { pickGradedComp } from "@/types/card";
import { App } from "antd";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FiPlus, FiRefreshCw, FiRotateCw } from "react-icons/fi";
import { MdAutoAwesome, MdVerified } from "react-icons/md";
import { CARD_IMAGE } from "./data";

const MAX_GRADE = 10;

const SEVERITY_DOT: Record<TDefectSeverity, string> = {
  minor: "bg-zinc-500",
  moderate: "bg-amber-400",
  severe: "bg-red-500",
};

/** Colour tracks the number so a low confidence reads as low at a glance
 *  instead of relying on the reader parsing two digits. */
const confidenceBarClass = (confidence: number): string => {
  if (confidence >= 85) return "bg-emerald-500";
  if (confidence >= 50) return "bg-amber-400";
  return "bg-red-500";
};

/**
 * A labelled meter whose fill always matches the value printed beside it.
 *
 * `value`/`max` are kept separate from `display` so the geometry cannot drift
 * from the text: the bar is filled from the same number that is rendered.
 */
function Meter({
  label,
  value,
  max,
  display,
  barClass,
}: {
  label: string;
  value: number;
  max: number;
  display: string;
  barClass: string;
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));

  return (
    <div>
      <div className="flex items-baseline justify-between text-[11px]">
        <span className="text-zinc-500">{label}</span>
        <span className="font-medium text-zinc-300 tabular-nums">
          {display}
        </span>
      </div>
      <div
        role="meter"
        aria-label={label}
        aria-valuenow={Math.round(value)}
        aria-valuemin={0}
        aria-valuemax={max}
        className="mt-1 h-2 w-full overflow-hidden rounded-full bg-white/8"
      >
        <div
          className={`h-full rounded-full transition-[width] ${barClass}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function RecentInspection() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetReportId = searchParams.get("reportId");
  const { message } = App.useApp();
  const [showBack, setShowBack] = useState(false);

  const { data: collectionData } = useGetMyCollectionQuery();
  const { data, isLoading } = useGetMyGradingReportsQuery(
    targetReportId
      ? { page: 1, limit: 50 }
      : { limit: 1, sort: "-createdAt" },
  );
  const [addToCollection, { isLoading: isAdding }] =
    useAddCollectionItemMutation();

  const report = targetReportId
    ? data?.data.find((r) => r._id === targetReportId) ?? data?.data[0]
    : data?.data[0];
  const card = report && typeof report.card === "object" ? report.card : null;

  const isAlreadyInCollection = Boolean(
    report &&
      collectionData?.data.some((item) =>
        typeof item.report === "object"
          ? item.report?._id === report._id
          : item.report === report._id,
      ),
  );

  if (isLoading) {
    return (
      <article className="h-96 animate-pulse rounded-2xl border border-violet-500/40 bg-[#111113]" />
    );
  }

  if (!report) {
    return (
      <article className="rounded-2xl border border-violet-500/40 bg-[#111113] p-8 text-center">
        <p className="text-sm text-zinc-400">
          No inspections yet — scan your first card to see its report here.
        </p>
        <button
          type="button"
          onClick={() => router.push("/user-dashboard/new-analysis")}
          className="mt-5 inline-flex rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500"
        >
          Start a scan
        </button>
      </article>
    );
  }

  const name = card?.name ?? "Card";
  const frontImage = (card?.officialImageUrl as string | undefined) ?? CARD_IMAGE;
  const backImage = "https://images.pokemontcg.io/back.png";
  const displayedImage = showBack ? backImage : frontImage;
  const marketValue = card?.latestPrice;

  const addCard = async () => {
    if (isAdding || isAlreadyInCollection) return;
    try {
      await addToCollection({ report: report._id }).unwrap();
      message.success(`${name} added to your collection.`);
    } catch {
      message.error("Couldn't add the card. Try again.");
    }
  };

  // All three are absent on reports graded before `pixelgrade-v2`. Old reports
  // are never re-graded, so every branch below has to survive them being empty.
  const defects = report.detectedDefects ?? [];
  const imageIssues = report.imageQuality?.issues ?? [];
  const centering = report.centering;

  const subScores = [
    { label: "Surfaces", value: report.scoreSurface, detail: null },
    { label: "Corners", value: report.scoreCorners, detail: null },
    { label: "Edges", value: report.scoreEdges, detail: null },
    {
      label: "Centering",
      value: report.scoreCentering,
      // Rounded to whole percent: "55/45" is how collectors write it, and the
      // model's precision does not justify a decimal place.
      detail: centering
        ? `${Math.round(centering.leftPct)}/${Math.round(100 - centering.leftPct)}`
        : null,
    },
  ];

  // The condition qualifies a raw comp the way the grade qualifies a graded
  // one: Scrydex prices Near Mint separately from Damaged, and the two can
  // differ several-fold. Almost always "NM" — anything else means no Near Mint
  // comp existed and the figure is for a played copy, which the user must see.
  const marketBasisLabel =
    card?.priceBasis === "graded"
      ? `Graded${card.priceGradeRef ? ` (${card.priceGradeRef})` : ""}`
      : `Raw / ungraded${card?.priceCondition ? ` (${card.priceCondition})` : ""}`;

  // The graded comp for THIS report's predicted grade, not the top of the
  // ladder (client, 2026-08-06: "show both the raw card value and the PSA
  // graded market value"). Quoting a PSA 10 next to a card we called 5.5 would
  // overstate it by a multiple — and it is the number someone would price a
  // sale from.
  const gradedComp = pickGradedComp(card?.gradedPrices, report.grade);
  const gradedCompany = card?.gradedCompany ?? "PSA";

  return (
    <article className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-3">
          <div className="group relative cursor-pointer" onClick={() => setShowBack(!showBack)}>
            <Image
              src={displayedImage}
              alt={`${name} — ${showBack ? "back" : "front"}`}
              width={280}
              height={392}
              // External CDN card art — bypass the optimizer's host allowlist.
              unoptimized={displayedImage !== CARD_IMAGE}
              className="max-h-72 w-full flex-1 rounded-xl object-contain transition-transform duration-300 group-hover:scale-102"
            />
            <span className="absolute bottom-2 right-2 flex items-center gap-1 rounded-md bg-black/70 px-2 py-1 text-[10px] font-medium text-white shadow">
              <FiRotateCw size={11} /> {showBack ? "Show Front" : "Flip to Back"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => router.push("/user-dashboard/new-analysis")}
              aria-label={`Retake scan for ${name}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
            >
              <FiRefreshCw size={13} />
              Retake
            </button>

            <button
              type="button"
              onClick={addCard}
              disabled={isAdding || isAlreadyInCollection}
              aria-label={`Add ${name} to your collection`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiPlus size={13} />
              {isAdding ? "Adding…" : isAlreadyInCollection ? "Added ✓" : "Add card"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push(`/user-dashboard/slab-generator?reportId=${report._id}`)}
            aria-label={`Create a custom slab label for ${name}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 py-2 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/20 cursor-pointer"
          >
            <MdAutoAwesome size={13} />
            Create slab
          </button>
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-medium text-white">{name}</h3>
          <p className="mt-1 text-xs text-zinc-500">
            {card?.setExpansion ?? ""}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {card?.language && (
              <span className="inline-flex w-fit rounded-md border border-violet-500/40 px-2 py-0.5 text-[11px] text-violet-300">
                {card.language}
              </span>
            )}

            {/* Awarded automatically by the server when the scan used
                PixelScope and confidence cleared the threshold. */}
            {report.pixelVerified && (
              <span
                title="Inspected with PixelScope — Pixel Verified"
                className="inline-flex w-fit items-center gap-1 rounded-md border border-purple-500/40 bg-purple-500/20 px-2.5 py-0.5 text-xs font-semibold text-purple-300 shadow-xs"
              >
                <MdVerified size={13} className="text-purple-400" />
                Pixel Verified
              </span>
            )}
          </div>

          <p className="mt-6 flex items-baseline gap-2.5">
            <span className="text-4xl font-semibold text-white">
              {report.grade.toFixed(1)}
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-medium text-white">
                {report.gradeLabel}
              </span>
              <span className="block text-[11px] text-zinc-500">
                AI Grade Estimate · not an official certification
              </span>
            </span>
          </p>

          {/* Two SEPARATE, LABELLED meters.
              Prototype V1 drew one bar from the grade and printed the
              confidence percentage beside it, so a 9.5 grade at 38% confidence
              showed a nearly full bar next to the number 38 — read, reasonably,
              as the AI contradicting itself. A meter must measure the number
              standing next to it. */}
          <div className="mt-4 space-y-2.5">
            <Meter
              label="Grade"
              value={report.grade}
              max={MAX_GRADE}
              display={`${report.grade.toFixed(1)} / 10`}
              barClass="bg-linear-to-r from-violet-600 to-fuchsia-400"
            />
            <Meter
              label="Confidence"
              value={report.confidence}
              max={100}
              display={`${Math.round(report.confidence)} %`}
              barClass={confidenceBarClass(report.confidence)}
            />
          </div>

          {/* Why confidence landed where it did. Without this a low number
              reads as the AI being unsure of itself rather than the photos
              being hard to grade from. */}
          {imageIssues.length > 0 && (
            <p className="mt-2 text-[11px] leading-relaxed text-amber-400/80">
              Limited by image quality: {imageIssues.join("; ")}.
            </p>
          )}

          <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-white/8 pt-4 text-center">
            {subScores.map((score) => (
              <div key={score.label}>
                <dt className="text-[11px] text-zinc-500">{score.label}</dt>
                <dd className="mt-1 text-sm font-medium text-white tabular-nums">
                  {score.value.toFixed(1)}
                </dd>
                {/* Measured border ratio, shown under the centering score so
                    the number can be checked rather than taken on trust. */}
                {score.detail && (
                  <dd className="text-[10px] text-zinc-600 tabular-nums">
                    {score.detail}
                  </dd>
                )}
              </div>
            ))}
          </dl>

          {defects.length > 0 && (
            <div className="mt-4 border-t border-white/8 pt-4">
              <p className="text-[11px] font-medium text-zinc-400">
                Detected issues
              </p>
              <ul className="mt-2 space-y-1.5">
                {defects.map((defect, index) => (
                  <li
                    key={`${defect.category}-${index}`}
                    className="flex items-start gap-2 text-[11px] leading-relaxed text-zinc-400"
                  >
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${SEVERITY_DOT[defect.severity]}`}
                      aria-hidden
                    />
                    <span>
                      <span className="capitalize text-zinc-300">
                        {defect.category}
                      </span>
                      {" — "}
                      {defect.description}
                      {defect.location && (
                        <span className="text-zinc-600">
                          {" "}
                          ({defect.location})
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-auto flex flex-wrap items-end justify-between gap-4 pt-5">
            <div>
              {/* The basis is part of the number, not a footnote: a raw comp
                  and a graded comp for the same card differ by multiples, and
                  an unlabelled figure will be read as whichever is convenient. */}
              <p className="text-[11px] text-zinc-500">
                Est Market Value · {marketBasisLabel}
              </p>
              <p className="mt-1 text-lg font-semibold text-white tabular-nums">
                {marketValue !== undefined
                  ? `$ ${marketValue.toLocaleString("en-US")}`
                  : "—"}
              </p>
            </div>

            {/* Only rendered when a comp exists for this grade. No placeholder
                dash: an empty "if graded" slot invites the reader to fill it in
                with a number they imagine, and cards below the bottom of the
                ladder genuinely have no graded market. */}
            {gradedComp && (
              <div className="text-right">
                <p className="text-[11px] text-zinc-500">
                  If {gradedCompany} {gradedComp.grade} · est.
                </p>
                <p className="mt-1 text-lg font-semibold text-emerald-400 tabular-nums">
                  $ {gradedComp.price.toLocaleString("en-US")}
                </p>
              </div>
            )}
          </div>

          {gradedComp && (
            // The grade is this platform's prediction, not PSA's — the graded
            // figure is what the card would fetch IF PSA agreed. Saying so is
            // the difference between a comp and a promise.
            <p className="mt-2 text-[10px] leading-snug text-zinc-600">
              Graded value is the {gradedCompany} {gradedComp.grade} market
              price for this card. Our grade is an estimate, not a{" "}
              {gradedCompany} certification.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
