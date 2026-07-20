"use client";

import { useGetCollectionBySetQuery } from "@/redux/features/collection/collectionApi";
import { seriesColors } from "@/utils/chartPalette";

const fmtUsd = (v: number) =>
  v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

/** Matches the donut's cap so the two panels name the same sets. */
const MAX_ROWS = 6;

export default function TotalValueBySet() {
  const { data, isLoading } = useGetCollectionBySetQuery();

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-6 text-lg font-medium text-white">
          Total value by set
        </h2>
        <div className="h-44 animate-pulse rounded-2xl border border-white/8" />
      </section>
    );
  }

  const buckets = data ?? [];

  if (buckets.length === 0) {
    return (
      <section>
        <h2 className="mb-6 text-lg font-medium text-white">
          Total value by set
        </h2>
        <p className="rounded-2xl border border-white/8 p-5 text-xs text-zinc-400">
          Nothing in your collection yet.
        </p>
      </section>
    );
  }

  const head = buckets.slice(0, MAX_ROWS - 1);
  const tail = buckets.slice(MAX_ROWS - 1);
  const sets = [
    ...head.map((bucket) => ({
      name: bucket._id ?? "Unknown set",
      value: bucket.value,
    })),
    ...(tail.length > 0
      ? [
          {
            name: "Other",
            value: tail.reduce((sum, bucket) => sum + bucket.value, 0),
          },
        ]
      : []),
  ];

  const max = Math.max(...sets.map((s) => s.value), 1);

  return (
    <section>
      <h2 className="mb-6 text-lg font-medium text-white">
        Total value by set
      </h2>

      <ul className="space-y-3.5">
        {sets.map((set, i) => (
          <li key={set.name} className="flex items-center gap-4 text-xs">
            <span className="w-28 shrink-0 truncate text-zinc-300">
              {set.name}
            </span>

            <span className="flex-1">
              <span
                role="img"
                aria-label={`${set.name}: $${fmtUsd(set.value)}`}
                className="block h-4 rounded-sm"
                style={{
                  width: `${Math.max((set.value / max) * 100, 2)}%`,
                  backgroundColor: seriesColors[i],
                }}
              />
            </span>

            <span className="w-20 shrink-0 text-right tabular-nums text-zinc-300">
              $ {fmtUsd(set.value)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
