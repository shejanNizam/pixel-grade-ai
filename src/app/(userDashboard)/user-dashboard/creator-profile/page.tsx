"use client";

import {
  useGetCollectionSummaryQuery,
  useGetMyCollectionQuery,
} from "@/redux/features/collection/collectionApi";
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

  // The showcase is the COLLECTION, not the grading history (client, UI
  // Feedback v1 edit #3). Grading a card does not put it in your collection —
  // adding it does. Sourcing this from reports meant a card the user scanned
  // and never kept still appeared on their public profile, and the tile count
  // disagreed with the "Total cards" stat right above it.
  const { data: collection } = useGetMyCollectionQuery({
    limit: 8,
    sortBy: "addedAt",
    sortOrder: "desc",
  });

  const showcase = collection?.data ?? [];

  // Every stat comes from the server's collection-scoped summary. Counting
  // client-side over one page silently under-reports anyone holding more than
  // the page size, and Pixel Verified in particular must be counted on the
  // server-awarded flag rather than inferred from "has a report".
  const pixelVerifiedCount = summary?.pixelVerifiedCount ?? 0;
  const avgConfidence = summary?.averageConfidence ?? null;

  // The creator badge is earned once a held card has cleared the bar.
  const hasVerified = pixelVerifiedCount > 0;

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
      label: "Pixel Verified",
      value: pixelVerifiedCount.toLocaleString("en-US"),
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

              {/* Public handle, not the email address — the Creator Profile is
                  a shareable page and an email address on it is an invitation
                  to scrape it. Falls back to the email only until a username
                  is set, since accounts predate the field. */}
              <p className="pt-1 text-sm text-zinc-500">
                {me.username ? `@${me.username}` : me.email}
              </p>
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

      {/* My showcase — the user's most recently ADDED collection entries.
          "View all" goes to the collection, not the analysis reports, so the
          link lands where the tiles actually come from. */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold text-white">My showcase</h2>
          <Link
            href="/user-dashboard/my-collection"
            className="text-sm font-medium text-violet-400 transition-opacity hover:opacity-80"
          >
            View all
          </Link>
        </div>

        {showcase.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-white/10 py-16 text-center text-sm text-zinc-500">
            Add a card to your collection to start your showcase.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {showcase.map((item) => {
              const card = typeof item.card === "object" ? item.card : null;
              const report =
                typeof item.report === "object" && item.report !== null
                  ? item.report
                  : null;

              // Manually-added entries have no report and therefore no grade —
              // showing "0.0" would invent one. The image can come from the
              // manual upload instead of the catalogue for the same reason.
              const image =
                item.manualImageUrl ??
                (card?.officialImageUrl as string | undefined);

              return (
                <div
                  key={item._id}
                  className="overflow-hidden rounded-2xl border border-violet-500/30 bg-[#111113]"
                >
                  <Image
                    src={image ?? FALLBACK_IMAGE}
                    alt={card?.name ?? "Collected card"}
                    width={280}
                    height={390}
                    unoptimized={Boolean(image)}
                    className="h-auto w-full object-cover"
                  />
                  <div className="flex items-center justify-between px-3 py-2">
                    <span className="truncate text-xs text-zinc-300">
                      {card?.name ?? "Card"}
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-violet-300 tabular-nums">
                      {report
                        ? report.grade.toFixed(1)
                        : (item.externalGrade ?? "—")}
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
