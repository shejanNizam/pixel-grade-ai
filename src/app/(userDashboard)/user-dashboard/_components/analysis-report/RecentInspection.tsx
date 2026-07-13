"use client";

import { App } from "antd";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiPlus, FiRefreshCw, FiTrendingUp } from "react-icons/fi";
import { CARD_IMAGE, inspection } from "./data";

const MAX_GRADE = 10;

export default function RecentInspection() {
  const { name, set, language, grade, gradeLabel, marketValue, trend } =
    inspection;
  const router = useRouter();
  const { message } = App.useApp();

  return (
    <article className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="flex flex-col gap-3">
          <Image
            src={CARD_IMAGE}
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
              onClick={() =>
                message.success(`${name} added to your collection.`)
              }
              aria-label={`Add ${name} to your collection`}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-600 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500"
            >
              <FiPlus size={13} />
              Add card
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <h3 className="text-base font-medium text-white">{name}</h3>
          <p className="mt-1 text-xs text-zinc-500">{set}</p>

          <span className="mt-3 inline-flex w-fit rounded-md border border-violet-500/40 px-2 py-0.5 text-[11px] text-violet-300">
            {language}
          </span>

          <p className="mt-6 flex items-baseline gap-2.5">
            <span className="text-4xl font-semibold text-white">
              {grade.toFixed(1)}
            </span>
            <span className="leading-tight">
              <span className="block text-xs font-medium text-white">
                {gradeLabel}
              </span>
              <span className="block text-[11px] text-zinc-500">
                AI Grade Estimate
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
              style={{ width: `${(grade / MAX_GRADE) * 100}%` }}
            />
          </div>

          <dl className="mt-5 grid grid-cols-4 gap-2 border-t border-white/8 pt-4 text-center">
            {inspection.subScores.map((score) => (
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
                $ {marketValue.toLocaleString("en-US")}
              </p>
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/12 px-1.5 py-0.5 text-[11px] font-medium text-emerald-400">
                {trend}
                <FiTrendingUp />
              </span>
              <p className="mt-1 text-[11px] text-zinc-500">This Month</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
