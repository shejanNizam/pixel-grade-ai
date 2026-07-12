import { seriesColors } from "@/utils/chartPalette";
import { sets } from "./data";

const fmtUsd = (v: number) =>
  v.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function TotalValueBySet() {
  const max = Math.max(...sets.map((s) => s.value));

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
                className="block h-4 rounded-[4px]"
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
