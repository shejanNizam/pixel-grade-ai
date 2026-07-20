"use client";

import { useAddCollectionItemMutation } from "@/redux/features/collection/collectionApi";
import { useGetMyGradingReportsQuery } from "@/redux/features/grading/gradingApi";
import { App } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiPlus, FiRefreshCw } from "react-icons/fi";
import { MdAutoAwesome, MdVerified } from "react-icons/md";
import { CARD_IMAGE } from "./data";

const MAX_GRADE = 10;

export default function RecentInspection() {
  const router = useRouter();
  const { message } = App.useApp();

  const { data, isLoading } = useGetMyGradingReportsQuery({
    limit: 1,
    sort: "-createdAt",
  });
  const [addToCollection, { isLoading: isAdding }] =
    useAddCollectionItemMutation();

  const report = data?.data[0];
  const card = report && typeof report.card === "object" ? report.card : null;

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
  const image = (card?.officialImageUrl as string | undefined) ?? CARD_IMAGE;
  const marketValue = card?.latestPrice;

  const addCard = async () => {
    if (isAdding) return;
    try {
      await addToCollection({ report: report._id }).unwrap();
      message.success(`${name} added to your collection.`);
    } catch {
      message.error("Couldn't add the card. Try again.");
    }
  };

  const subScores = [
    { label: "Surfaces", value: report.scoreSurface },
    { label: "Corners", value: report.scoreCorners },
    { label: "Edges", value: report.scoreEdges },
    { label: "Centering", value: report.scoreCentering },
  ];

  return (
    <article className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-3">
          <Image
            src={image}
            alt={`${name} — front`}
            width={280}
            height={392}
            className="max-h-72 w-full flex-1 rounded-xl object-contain"
          />

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => router.push("/user-dashboard/new-analysis")}
              aria-label={`Retake the scan of ${name}`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-white/15 bg-white/5 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-white/10"
            >
              <FiRefreshCw size={13} />
              Retake
            </button>

            <button
              type="button"
              onClick={addCard}
              disabled={isAdding}
              aria-label={`Add ${name} to your collection`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FiPlus size={13} />
              {isAdding ? "Adding…" : "Add card"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => router.push("/user-dashboard/slab-generator")}
            aria-label={`Create a custom slab label for ${name}`}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-violet-500/40 bg-violet-500/10 py-2 text-xs font-medium text-violet-300 transition-colors hover:bg-violet-500/20"
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
                title="Inspected with PixelScope — awarded automatically"
                className="inline-flex w-fit items-center gap-1 rounded-md bg-blue-500/15 px-2 py-0.5 text-[11px] font-medium text-blue-400"
              >
                <MdVerified size={12} />
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
                AI Grade Estimate · {report.confidence} % confidence
              </span>
            </span>
          </p>

          {/* The bar restates the grade above it, so it's decorative. */}
          <div
            aria-hidden
            className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/8"
          >
            <div
              className="h-full rounded-full bg-linear-to-r from-violet-600 to-fuchsia-400"
              style={{ width: `${(report.grade / MAX_GRADE) * 100}%` }}
            />
          </div>

          <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-white/8 pt-4 text-center">
            {subScores.map((score) => (
              <div key={score.label}>
                <dt className="text-[11px] text-zinc-500">{score.label}</dt>
                <dd className="mt-1 text-sm font-medium text-white tabular-nums">
                  {score.value.toFixed(1)}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-auto flex items-end justify-between gap-4 pt-5">
            <div>
              <p className="text-[11px] text-zinc-500">Est Market Value</p>
              <p className="mt-1 text-lg font-semibold text-white tabular-nums">
                {marketValue !== undefined
                  ? `$ ${marketValue.toLocaleString("en-US")}`
                  : "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
