import type { IconType } from "react-icons";
import { FiTrendingUp } from "react-icons/fi";

export interface AdminStatCardProps {
  value: string;
  label: string;
  /** Rendered under the label — a plain violet caption, or a green pill when `pill`. */
  delta?: string;
  /** Shows the delta as a green trending pill instead of violet caption text. */
  pill?: boolean;
  Icon: IconType;
}

/** The admin stat tile — icon on its own line, then figure, label, delta. */
export default function AdminStatCard({
  value,
  label,
  delta,
  pill = false,
  Icon,
}: AdminStatCardProps) {
  return (
    <article className="rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-5">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 text-lg text-white">
        <Icon />
      </span>

      <p className="mt-6 text-2xl font-semibold text-white tabular-nums">
        {value}
      </p>
      <p className="mt-1 text-sm text-white">{label}</p>

      {delta &&
        (pill ? (
          <span className="mt-2 inline-flex items-center gap-1 rounded bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
            {delta}
            <FiTrendingUp />
          </span>
        ) : (
          <p className="mt-2 text-[11px] text-violet-400">{delta}</p>
        ))}
    </article>
  );
}
