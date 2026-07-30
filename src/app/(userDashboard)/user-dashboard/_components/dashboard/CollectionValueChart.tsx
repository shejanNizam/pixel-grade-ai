"use client";

import { useGetCollectionValueOverTimeQuery } from "@/redux/features/collection/collectionApi";
import { chartInk } from "@/utils/chartPalette";
import { useMemo, useRef, useState } from "react";
import { FiCalendar, FiTrendingUp } from "react-icons/fi";

const W = 820;
const H = 380;
const PAD = { top: 20, right: 16, bottom: 32, left: 52 };

const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

const TICK_COUNT = 5;

/**
 * Selectable windows. The server clamps `months` to 1–36 and always returns one
 * bucket per month in range, so every option here is a whole series — there is
 * no client-side slicing and nothing to keep in sync with the response length.
 */
const RANGES = [
  { label: "3M", months: 3 },
  { label: "6M", months: 6 },
  { label: "1Y", months: 12 },
  { label: "2Y", months: 24 },
] as const;

const DEFAULT_MONTHS = 12;

/**
 * Ceiling on x-axis labels. A 24-month window has ~31px per point and "Jul 25"
 * needs more than that, so past this count the labels are thinned rather than
 * left to overlap into a smear.
 */
const MAX_X_LABELS = 12;

/**
 * "2026-07" → "Jul", or "Jul 26" once a window is long enough to contain the
 * same month twice — a bare "Jul ... Jul" axis names two different points
 * identically.
 */
const monthLabel = (key: string, withYear = false) => {
  const [year, month] = key.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    ...(withYear && { year: "2-digit" as const }),
    timeZone: "UTC",
  });
};

/** Round the axis max up to a clean step so ticks land on round numbers. */
const niceMax = (raw: number) => {
  if (raw <= 0) return 100;
  const step = Math.pow(10, Math.floor(Math.log10(raw)));
  return Math.ceil(raw / step) * step;
};

const fmtAxis = (v: number) => (v >= 1000 ? `${v / 1000}K` : String(v));
const fmtValue = (v: number) =>
  v >= 1000 ? `$${(v / 1000).toFixed(1)}K` : `$${v.toFixed(0)}`;

/** Catmull-Rom through every point, emitted as cubic beziers. */
function smoothPath(pts: { x: number; y: number }[]): string {
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

export default function CollectionValueChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [months, setMonths] = useState<number>(DEFAULT_MONTHS);

  // Keyed by `months`, so a window already viewed comes back from cache and
  // switching between two ranges does not re-hit the server each time.
  const { data, isLoading, isFetching } = useGetCollectionValueOverTimeQuery({
    months,
  });

  const series = useMemo(() => data ?? [], [data]);

  const {
    points,
    xLabels,
    showYear,
    ticks,
    yAt,
    rangeLabel,
    latest,
    deltaPct,
  } = useMemo(() => {
    const max = niceMax(Math.max(...series.map((d) => d.value), 0));
    const tickStep = max / TICK_COUNT;
    const ticks = Array.from(
      { length: TICK_COUNT + 1 },
      (_, i) => i * tickStep,
    );

    const yAt = (v: number) => PAD.top + plotH - (v / max) * plotH;
    const xAt = (i: number) =>
      PAD.left + (series.length > 1 ? (i / (series.length - 1)) * plotW : 0);

    const points = series.map((d, i) => ({ ...d, x: xAt(i), y: yAt(d.value) }));

    // Thinned from the right so the newest month always keeps its label — it is
    // the one the headline figure above the chart refers to.
    const stride = Math.ceil(series.length / MAX_X_LABELS) || 1;
    const xLabels = points.filter(
      (_, i) => (series.length - 1 - i) % stride === 0,
    );
    const showYear = series.length > 12;

    const first = series[0];
    const last = series[series.length - 1];
    const rangeLabel =
      first && last
        ? `${monthLabel(first.month)} ${first.month.slice(0, 4)} - ${monthLabel(last.month)} ${last.month.slice(0, 4)}`
        : "";

    const prev = series[series.length - 2];
    // % vs the previous month; a zero baseline has no meaningful percentage.
    const deltaPct =
      prev && prev.value > 0 && last
        ? ((last.value - prev.value) / prev.value) * 100
        : null;

    return {
      points,
      xLabels,
      showYear,
      ticks,
      yAt,
      rangeLabel,
      latest: last,
      deltaPct,
    };
  }, [series]);

  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect || points.length < 2) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((x - PAD.left) / plotW) * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, i)));
  };

  const active = hover === null ? null : points[hover];

  if (isLoading) {
    return (
      <section className="h-full min-h-96 animate-pulse rounded-2xl border border-violet-500/40 bg-[#111113]" />
    );
  }

  const linePath = points.length > 1 ? smoothPath(points) : "";
  const areaPath =
    points.length > 1
      ? `${linePath} L ${points[points.length - 1].x} ${PAD.top + plotH} L ${points[0].x} ${PAD.top + plotH} Z`
      : "";

  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm text-zinc-400">Collection value over time</h2>
          <p className="mt-1.5 flex items-center gap-2.5">
            <span className="text-xl font-semibold text-white">
              {fmtValue(latest?.value ?? 0)}
            </span>
            {deltaPct !== null && (
              <span
                className={`inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${
                  deltaPct >= 0
                    ? "bg-emerald-500/12 text-emerald-400"
                    : "bg-red-500/12 text-red-400"
                }`}
              >
                {deltaPct >= 0 ? "+" : ""}
                {deltaPct.toFixed(1)} %
                <FiTrendingUp />
              </span>
            )}
          </p>
        </div>

        <div className="flex flex-col items-end gap-1.5">
          <div
            role="group"
            aria-label="Chart range"
            className="inline-flex rounded-lg border border-white/10 p-0.5"
          >
            {RANGES.map((range) => {
              const selected = range.months === months;
              return (
                <button
                  key={range.months}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => {
                    setMonths(range.months);
                    // The hovered index belongs to the old series; a shorter
                    // window would otherwise open with a crosshair parked on a
                    // point that no longer exists.
                    setHover(null);
                  }}
                  className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    selected
                      ? "bg-violet-600 text-white"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {range.label}
                </button>
              );
            })}
          </div>

          {/* The buttons say how far back; this says which months that landed
              on, so the axis can stay abbreviated. */}
          {rangeLabel && (
            <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
              <FiCalendar />
              {rangeLabel}
            </span>
          )}
        </div>
      </div>

      {/* isFetching, not isLoading: a range switch keeps the previous series on
          screen, so without this the chart would sit there looking unchanged
          until the new data lands. The full skeleton is for the first load
          only — flashing it on every switch would throw the layout away. */}
      <div
        className={`relative transition-opacity duration-200 ${
          isFetching ? "opacity-40" : "opacity-100"
        }`}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none"
          role="img"
          aria-label={`Collection value per month over the last ${months} months`}
          aria-busy={isFetching}
          onPointerMove={handleMove}
          onPointerLeave={() => setHover(null)}
        >
          <defs>
            <linearGradient id="pg-area" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={chartInk.accent}
                stopOpacity="0.55"
              />
              <stop offset="100%" stopColor={chartInk.accent} stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={yAt(t)}
                y2={yAt(t)}
                stroke={chartInk.grid}
              />
              <text
                x={PAD.left - 12}
                y={yAt(t) + 4}
                textAnchor="end"
                fontSize="11"
                fill={chartInk.axis}
              >
                {fmtAxis(t)}
              </text>
            </g>
          ))}

          {areaPath && <path d={areaPath} fill="url(#pg-area)" />}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke={chartInk.accent}
              strokeWidth="2"
            />
          )}

          {xLabels.map((p) => (
            <text
              key={p.month}
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill={chartInk.axis}
            >
              {monthLabel(p.month, showYear)}
            </text>
          ))}

          {active && (
            <g>
              <line
                x1={active.x}
                x2={active.x}
                y1={PAD.top}
                y2={PAD.top + plotH}
                stroke="rgba(255,255,255,0.25)"
                strokeDasharray="4 4"
              />
              <circle
                cx={active.x}
                cy={active.y}
                r="5"
                fill="#ffffff"
                stroke={chartInk.accent}
                strokeWidth="2"
              />
            </g>
          )}
        </svg>

        {active && (
          <div
            className="pointer-events-none absolute -translate-x-1/2 -translate-y-full rounded-lg bg-violet-600 px-2.5 py-1.5 text-center whitespace-nowrap shadow-lg"
            style={{
              left: `${(active.x / W) * 100}%`,
              top: `${(active.y / H) * 100 - 3}%`,
            }}
          >
            <p className="text-xs font-semibold text-white">
              {fmtValue(active.value)}
            </p>
            <p className="text-[10px] text-violet-200">
              {monthLabel(active.month)} {active.month.slice(0, 4)}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
