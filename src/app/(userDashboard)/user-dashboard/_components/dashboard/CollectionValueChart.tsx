"use client";

import { chartInk } from "@/utils/chartPalette";
import { useRef, useState } from "react";
import { FiCalendar, FiChevronDown, FiTrendingUp } from "react-icons/fi";
import { collectionValue } from "./data";

const W = 820;
const H = 380;
const PAD = { top: 20, right: 16, bottom: 32, left: 52 };

const MAX = 250_000;
const TICKS = [0, 50_000, 100_000, 150_000, 200_000, 250_000];

const plotW = W - PAD.left - PAD.right;
const plotH = H - PAD.top - PAD.bottom;

const xAt = (i: number) =>
  PAD.left + (i / (collectionValue.length - 1)) * plotW;
const yAt = (v: number) => PAD.top + plotH - (v / MAX) * plotH;

const points = collectionValue.map((d, i) => ({
  ...d,
  x: xAt(i),
  y: yAt(d.value),
}));

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

const linePath = smoothPath(points);
const areaPath = `${linePath} L ${points[points.length - 1].x} ${
  PAD.top + plotH
} L ${points[0].x} ${PAD.top + plotH} Z`;

const fmtAxis = (v: number) => `${v / 1000}K`;
const fmtValue = (v: number) => `$${(v / 1000).toFixed(1)}K`;

export default function CollectionValueChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  // Map the pointer's client x into viewBox units, then snap to the nearest month.
  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const i = Math.round(((x - PAD.left) / plotW) * (points.length - 1));
    setHover(Math.min(points.length - 1, Math.max(0, i)));
  };

  const active = hover === null ? null : points[hover];

  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-sm text-zinc-400">Collection value over time</h2>
          <p className="mt-1.5 flex items-center gap-2.5">
            <span className="text-xl font-semibold text-white">$ 5.2K</span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/12 px-1.5 py-0.5 text-[11px] font-medium text-emerald-400">
              24.6 %
              <FiTrendingUp />
            </span>
          </p>
        </div>

        {/* Range picker is presentational until there's more than one range of data. */}
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300"
        >
          <FiCalendar />
          Jan 2026 - Dec 2026
          <FiChevronDown />
        </button>
      </div>

      <div className="relative">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${W} ${H}`}
          className="w-full touch-none"
          role="img"
          aria-label="Collection value per month, January to December 2026"
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

          {TICKS.map((t) => (
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

          <path d={areaPath} fill="url(#pg-area)" />
          <path
            d={linePath}
            fill="none"
            stroke={chartInk.accent}
            strokeWidth="2"
          />

          {points.map((p) => (
            <text
              key={p.month}
              x={p.x}
              y={H - 8}
              textAnchor="middle"
              fontSize="11"
              fill={chartInk.axis}
            >
              {p.month}
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
            <p className="text-[10px] text-violet-200">{active.month} 2026</p>
          </div>
        )}
      </div>
    </section>
  );
}
