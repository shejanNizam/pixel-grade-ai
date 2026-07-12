import type { IconType } from "react-icons";
import { FiTrendingUp } from "react-icons/fi";

export interface StatCardProps {
  value: string;
  label: string;
  /** Muted line under the label. */
  caption?: string;
  /** Positive-change pill shown before the caption. */
  delta?: string;
  Icon: IconType;
}

/** The dashboard stat tile — icon at the left, figure and label at the right. */
export default function StatCard({
  value,
  label,
  caption,
  delta,
  Icon,
}: StatCardProps) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4">
      <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
        <Icon />
      </span>

      <div className="min-w-0">
        <p className="text-xl font-semibold text-white tabular-nums">{value}</p>
        <p className="truncate text-sm text-white">{label}</p>

        {(delta || caption) && (
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
            {delta && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/12 px-1.5 py-0.5 font-medium text-emerald-400">
                {delta}
                <FiTrendingUp />
              </span>
            )}
            {caption}
          </p>
        )}
      </div>
    </article>
  );
}
