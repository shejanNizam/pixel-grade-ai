"use client";

import { useGetCollectionBySetQuery } from "@/redux/features/collection/collectionApi";
import { seriesColors } from "@/utils/chartPalette";

const R = 70;
const STROKE = 40;
const C = 2 * Math.PI * R;
const GAP = 3; // surface gap between segments

/** The donut caps at the palette size; smaller sets collapse into "Other". */
const MAX_SLICES = 6;

export default function CollectionBySet() {
  const { data, isLoading } = useGetCollectionBySetQuery();

  if (isLoading) {
    return (
      <section>
        <h2 className="mb-6 text-lg font-medium text-white">
          Collection by set
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
          Collection by set
        </h2>
        <p className="rounded-2xl border border-white/8 p-5 text-xs text-zinc-400">
          Nothing in your collection yet.
        </p>
      </section>
    );
  }

  const head = buckets.slice(0, MAX_SLICES - 1);
  const tail = buckets.slice(MAX_SLICES - 1);
  const sets = [
    ...head.map((bucket) => ({
      name: bucket._id ?? "Unknown set",
      count: bucket.count,
    })),
    ...(tail.length > 0
      ? [
          {
            name: "Other",
            count: tail.reduce((sum, bucket) => sum + bucket.count, 0),
          },
        ]
      : []),
  ];

  const total = sets.reduce((sum, s) => sum + s.count, 0);

  let offset = 0;
  const arcs = sets.map((set, i) => {
    const len = (set.count / total) * C;
    const dash = Math.max(len - GAP, 1);
    const arc = {
      ...set,
      share: Math.round((set.count / total) * 100),
      color: seriesColors[i],
      dash,
      gap: C - dash,
      offset: -offset,
    };
    offset += len;
    return arc;
  });

  return (
    <section>
      <h2 className="mb-6 text-lg font-medium text-white">Collection by set</h2>

      <div className="flex flex-wrap items-center gap-8">
        <div className="relative shrink-0">
          <svg
            viewBox="0 0 200 200"
            className="h-44 w-44"
            role="img"
            aria-label={`Collection by set, ${total} cards total`}
          >
            <g transform="rotate(-90 100 100)">
              {arcs.map((arc) => (
                <circle
                  key={arc.name}
                  cx="100"
                  cy="100"
                  r={R}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth={STROKE}
                  strokeDasharray={`${arc.dash} ${arc.gap}`}
                  strokeDashoffset={arc.offset}
                >
                  <title>{`${arc.name}: ${arc.count} cards`}</title>
                </circle>
              ))}
            </g>
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="central"
              className="fill-white text-xl font-semibold"
            >
              {total}
            </text>
          </svg>
        </div>

        {/* Direct labels — identity never rests on color alone. */}
        <ul className="min-w-0 flex-1 space-y-2.5">
          {arcs.map((arc) => (
            <li
              key={arc.name}
              className="flex items-center gap-3 text-xs text-zinc-300"
            >
              <span
                aria-hidden
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: arc.color }}
              />
              <span className="flex-1 truncate">{arc.name}</span>
              <span className="w-10 text-right tabular-nums text-zinc-400">
                {arc.count}
              </span>
              <span className="w-12 text-right tabular-nums text-zinc-400">
                {arc.share} %
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
