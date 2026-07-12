import Sparkline from "@/components/charts/Sparkline";
import { FiArrowDown, FiArrowUp } from "react-icons/fi";
import { marketStats } from "./data";

export default function MarketStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {marketStats.map((stat) => (
        <article
          key={stat.label}
          className="overflow-hidden rounded-xl border border-white/8 bg-[#111113]"
        >
          <div className="p-4">
            <p className="text-xs text-zinc-400">{stat.label}</p>
            <p className="mt-1.5 text-xl font-semibold text-white tabular-nums">
              {stat.value}
            </p>
            <p
              className={`mt-1 flex items-center gap-1 text-xs font-medium ${
                stat.up ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {stat.up ? <FiArrowUp /> : <FiArrowDown />}
              {stat.up ? "" : "-"}
              {stat.delta}
              {stat.caption && (
                <span className="text-zinc-500">{stat.caption}</span>
              )}
            </p>
          </div>

          <Sparkline
            values={stat.data}
            color={stat.color}
            width={300}
            height={56}
            className="h-14 w-full"
          />
        </article>
      ))}
    </div>
  );
}
