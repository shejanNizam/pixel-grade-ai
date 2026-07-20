"use client";

import Sparkline from "@/components/charts/Sparkline";
import { useGetCollectionValueOverTimeQuery } from "@/redux/features/collection/collectionApi";
import { useGetPortfolioSummaryQuery } from "@/redux/features/price/priceApi";
import Link from "next/link";
import { FiArrowDown, FiArrowUp, FiLock } from "react-icons/fi";

const money = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

const isForbidden = (err: unknown): boolean =>
  typeof err === "object" &&
  err !== null &&
  "status" in err &&
  (err as { status?: number }).status === 403;

export default function MarketStats() {
  const { data, isLoading, error } = useGetPortfolioSummaryQuery();
  const { data: valueSeries } = useGetCollectionValueOverTimeQuery(
    { months: 12 },
    { skip: Boolean(error) },
  );

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-xl border border-white/8 bg-[#111113]"
          />
        ))}
      </div>
    );
  }

  // Price tracking is a paid feature; the server answers 403 on Free.
  if (isForbidden(error)) {
    return (
      <div className="rounded-2xl border border-dashed border-violet-500/40 bg-[#111113] px-6 py-10 text-center">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-violet-500/15 text-violet-300">
          <FiLock size={18} />
        </span>
        <h3 className="mt-4 text-sm font-medium text-white">
          Price tracking is a paid feature
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-xs text-zinc-500">
          Live market values and price history are available on the Collector
          plan and above.
        </p>
        <Link
          href="/user-dashboard/subscription"
          className="mt-5 inline-flex rounded-lg bg-violet-500 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-600"
        >
          Upgrade to unlock price tracking
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const trendValues = (valueSeries ?? []).map((p) => p.value);

  const changeCards = [
    { label: "24h Change", pct: data.change24h },
    { label: "7d Change", pct: data.change7d },
    { label: "30d Change", pct: data.change30d },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <article className="overflow-hidden rounded-xl border border-white/8 bg-[#111113]">
        <div className="p-4">
          <p className="text-xs text-zinc-400">Total Market Value</p>
          <p className="mt-1.5 text-xl font-semibold text-white tabular-nums">
            {money(data.totalValue)}
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            {data.totalCards.toLocaleString("en-US")} cards tracked
          </p>
        </div>
        {trendValues.length > 1 && (
          <Sparkline
            values={trendValues}
            color="#a78bfa"
            width={300}
            height={56}
            className="h-14 w-full"
            label="Collection value over the last 12 months"
          />
        )}
      </article>

      {changeCards.map(({ label, pct }) => {
        const up = (pct ?? 0) >= 0;
        const dollars = pct === null ? null : (data.totalValue * pct) / 100;
        return (
          <article
            key={label}
            className="rounded-xl border border-white/8 bg-[#111113] p-4"
          >
            <p className="text-xs text-zinc-400">{label}</p>
            <p className="mt-1.5 text-xl font-semibold text-white tabular-nums">
              {dollars === null ? "—" : money(dollars)}
            </p>
            {pct !== null && (
              <p
                className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                  up ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {up ? <FiArrowUp /> : <FiArrowDown />}
                {Math.abs(pct).toFixed(2)}%
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
