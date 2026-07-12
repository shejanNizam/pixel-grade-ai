import { FiTrendingUp } from "react-icons/fi";
import { stats } from "./data";

export default function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat) => (
        <article
          key={stat.label}
          className="rounded-xl border border-white/8 bg-[#111113] p-4"
        >
          <p className="flex items-center gap-2 text-xs text-zinc-400">
            <FiTrendingUp className="text-emerald-400" />
            {stat.label}
          </p>

          <p className="mt-4 flex items-center gap-2.5">
            <span className="text-xl font-semibold text-white">
              {stat.value}
            </span>
            <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/12 px-1.5 py-0.5 text-[11px] font-medium text-emerald-400">
              {stat.delta}
              <FiTrendingUp />
            </span>
          </p>
        </article>
      ))}
    </div>
  );
}
