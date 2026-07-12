import type { IconType } from "react-icons";
import {
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiPackage,
  FiStar,
} from "react-icons/fi";
import { impact } from "./data";

const icons: IconType[] = [
  FiCheckCircle,
  FiBarChart2,
  FiAward,
  FiPackage,
  FiStar,
];

export default function YourImpact() {
  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <h2 className="mb-5 text-base font-medium text-white">Your impact</h2>

      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {impact.map((stat, i) => {
          const Icon = icons[i];
          return (
            <div key={stat.label} className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                <Icon />
              </span>
              <div className="min-w-0">
                <dd className="text-sm font-semibold text-white">
                  {stat.value}
                </dd>
                <dt className="truncate text-[11px] text-zinc-500">
                  {stat.label}
                </dt>
              </div>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
