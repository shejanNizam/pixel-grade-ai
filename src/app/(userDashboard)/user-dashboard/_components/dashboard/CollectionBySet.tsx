import { seriesColors } from "@/utils/chartPalette";
import { sets } from "./data";

const R = 70;
const STROKE = 40;
const C = 2 * Math.PI * R;
const GAP = 3; // surface gap between segments

export default function CollectionBySet() {
  const total = sets.reduce((sum, s) => sum + s.count, 0);

  let offset = 0;
  const arcs = sets.map((set, i) => {
    const len = (set.count / total) * C;
    const dash = Math.max(len - GAP, 1);
    const arc = {
      ...set,
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
