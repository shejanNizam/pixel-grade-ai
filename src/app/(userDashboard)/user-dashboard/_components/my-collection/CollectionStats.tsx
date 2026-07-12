import type { IconType } from "react-icons";
import { FiTrendingUp } from "react-icons/fi";
import {
  MdOutlineBarChart,
  MdOutlineDiamond,
  MdOutlineFavoriteBorder,
  MdOutlineStyle,
} from "react-icons/md";

interface Stat {
  value: string;
  label: string;
  caption: string;
  delta?: string;
  Icon: IconType;
}

interface CollectionStatsProps {
  totalCards: number;
  favorites: number;
}

export default function CollectionStats({
  totalCards,
  favorites,
}: CollectionStatsProps) {
  const stats: Stat[] = [
    {
      value: String(totalCards),
      label: "Total Cards",
      caption: "Across 28 sets",
      Icon: MdOutlineStyle,
    },
    {
      value: "$ 6762",
      label: "Estimated value",
      caption: "Total market value",
      Icon: MdOutlineDiamond,
    },
    {
      value: "$ 874",
      label: "Collection Gain",
      caption: "vs Last Month",
      delta: "11.3 %",
      Icon: MdOutlineBarChart,
    },
    {
      value: String(favorites),
      label: "Favorites",
      caption: "Mark as favorite",
      Icon: MdOutlineFavoriteBorder,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="flex items-center gap-4 rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black p-4"
        >
          <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/15 text-xl text-violet-300">
            <stat.Icon />
          </span>

          <div className="min-w-0">
            <p className="text-xl font-semibold text-white tabular-nums">
              {stat.value}
            </p>
            <p className="text-sm text-white">{stat.label}</p>
            <p className="mt-1 flex items-center gap-1.5 text-[11px] text-zinc-500">
              {stat.delta && (
                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/12 px-1.5 py-0.5 font-medium text-emerald-400">
                  {stat.delta}
                  <FiTrendingUp />
                </span>
              )}
              {stat.caption}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
