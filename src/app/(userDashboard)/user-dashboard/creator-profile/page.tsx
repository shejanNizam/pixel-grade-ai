"use client";

import { useGetCollectionSummaryQuery } from "@/redux/features/collection/collectionApi";
import { useGetMyGradingReportsQuery } from "@/redux/features/grading/gradingApi";
import { useGetMeQuery } from "@/redux/features/user/userApi";
import Image from "next/image";
import Link from "next/link";
import { MdVerified } from "react-icons/md";

const FALLBACK_IMAGE = "/assets/user-dashboard/recent_scan_card.png";

const money = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

/** "Alex Alfred" -> "AA". */
const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function CreatorProfile() {
  const { data: me, isLoading: loadingMe } = useGetMeQuery();
  const { data: summary } = useGetCollectionSummaryQuery();
  const { data: reports } = useGetMyGradingReportsQuery({
    limit: 8,
    sort: "-createdAt",
  });

  const certified = reports?.meta?.total ?? 0;
  const showcase = reports?.data ?? [];

  // "Pixel verified" creator badge — earned once any scan cleared the bar.
  const hasVerified = showcase.some((report) => report.pixelVerified);

  // Average confidence across the reports we have to hand.
  const avgConfidence =
    showcase.length > 0
      ? Math.round(
          showcase.reduce((sum, report) => sum + report.confidence, 0) /
            showcase.length,
        )
      : null;

  const summaryStats = [
    {
      emoji: "💰",
      label: "Total value",
      value: summary ? money(summary.totalValue) : "—",
      valueClass: "text-violet-400",
    },
    {
      emoji: "🃏",
      label: "Total cards",
      value: summary ? summary.totalCards.toLocaleString("en-US") : "—",
      valueClass: "text-violet-400",
    },
    {
      emoji: "🏅",
      label: "Cards certified",
      value: certified.toLocaleString("en-US"),
      valueClass: "text-green-400",
    },
    {
      emoji: "⭐",
      label: "Avg confidence",
      value: avgConfidence !== null ? String(avgConfidence) : "—",
      suffix: avgConfidence !== null ? "%" : undefined,
      valueClass: "text-amber-400",
    },
  ];

  if (loadingMe || !me) {
    return (
      <div className="space-y-6">
        <div className="h-56 animate-pulse rounded-2xl border border-white/10 bg-[#111113]" />
        <div className="h-72 animate-pulse rounded-2xl border border-white/10 bg-[#111113]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="rounded-2xl border border-white/10 bg-[#111113] p-6 sm:p-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-5">
            <div className="relative shrink-0">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full bg-violet-500/50 blur-xl"
              />
              {me.avatar?.url ? (
                <Image
                  src={me.avatar.url}
                  alt=""
                  width={80}
                  height={80}
                  unoptimized
                  className="relative h-20 w-20 rounded-full object-cover ring-2 ring-violet-500/40"
                />
              ) : (
                <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-2xl font-bold text-white ring-2 ring-violet-500/40">
                  {initialsOf(me.name)}
                </span>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  {me.name}
                </h2>
                {hasVerified && (
                  <MdVerified
                    className="text-blue-400"
                    size={20}
                    aria-label="Pixel verified"
                  />
                )}
              </div>

              {hasVerified && (
                <span className="inline-block rounded-md bg-violet-500/20 px-3 py-0.5 text-xs font-medium text-violet-300">
                  Pixel verified
                </span>
              )}

              <p className="pt-1 text-sm text-zinc-500">{me.email}</p>
            </div>
          </div>
        </div>

        {/* Summary stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {summaryStats.map((s) => (
            <div
              key={s.label}
              className="flex flex-col gap-1.5 rounded-xl border border-white/10 bg-[#0d0d0f] p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{s.emoji}</span>
                <span className="text-xs text-zinc-500">{s.label}</span>
              </div>
              <p className={`text-2xl font-bold ${s.valueClass}`}>
                {s.value}
                {s.suffix && (
                  <span className="text-base font-semibold text-white">
                    {s.suffix}
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* My showcase — the user's most recent graded cards. */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">My showcase</h2>
          <Link
            href="/user-dashboard/analysis-report"
            className="text-sm font-medium text-violet-400 transition-opacity hover:opacity-80"
          >
            View all
          </Link>
        </div>

        {showcase.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-zinc-500">
            Grade your first card to start your showcase.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {showcase.map((report) => {
              const card =
                typeof report.card === "object" ? report.card : null;
              return (
                <div
                  key={report._id}
                  className="overflow-hidden rounded-2xl border border-violet-500/30 bg-[#111113]"
                >
                  <Image
                    src={
                      (card?.officialImageUrl as string | undefined) ??
                      FALLBACK_IMAGE
                    }
                    alt={card?.name ?? "Graded card"}
                    width={280}
                    height={390}
                    unoptimized={Boolean(card?.officialImageUrl)}
                    className="h-auto w-full object-cover"
                  />
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="truncate text-xs text-zinc-300">
                      {card?.name ?? "Card"}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-violet-300 tabular-nums">
                      {report.grade.toFixed(1)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
