import type { IconType } from "react-icons";
import {
  FiCheckCircle,
  FiMessageSquare,
  FiPackage,
  FiUserPlus,
} from "react-icons/fi";
import { creator } from "./data";

const activityIcons: IconType[] = [
  FiPackage,
  FiMessageSquare,
  FiCheckCircle,
  FiUserPlus,
];

export default function CreatorProfile() {
  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-5">
      <h2 className="mb-5 text-center text-base font-medium text-white">
        Your creator profile
      </h2>

      <div className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-violet-500 to-cyan-400 text-sm font-semibold text-white">
          DJ
        </span>
        <div>
          <p className="text-sm font-medium text-white">{creator.name}</p>
          <span className="mt-1 inline-flex rounded-md bg-violet-500/15 px-2 py-0.5 text-[11px] text-violet-300">
            {creator.badge}
          </span>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 gap-2 text-center">
        {creator.stats.map((stat) => (
          <div key={stat.label}>
            <dd className="text-sm font-semibold text-violet-300 tabular-nums">
              {stat.value}
            </dd>
            <dt className="mt-0.5 text-[11px] text-zinc-500">{stat.label}</dt>
          </div>
        ))}
      </dl>

      <h3 className="mt-7 mb-3 text-sm text-white">Recent activity</h3>
      <ul className="space-y-3">
        {creator.activity.map((item, i) => {
          const Icon = activityIcons[i];
          return (
            <li key={item.text} className="flex items-center gap-3">
              <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-300">
                <Icon size={13} />
              </span>
              <span className="min-w-0 flex-1 truncate text-xs text-zinc-300">
                {item.text}
              </span>
              <span className="shrink-0 text-[11px] text-zinc-500">
                {item.when}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
