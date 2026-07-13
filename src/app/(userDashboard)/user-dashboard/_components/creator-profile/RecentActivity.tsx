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

export default function RecentActivity() {
  return (
    <section className="rounded-2xl border border-violet-500/40 bg-[#111113] p-6 sm:p-8">
      <h2 className="mb-5 text-base font-medium text-white">Recent activity</h2>

      <ul className="space-y-3">
        {creator.activity.map((item, i) => {
          const Icon = activityIcons[i];
          return (
            <li
              key={item.text}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-violet-500/15 text-violet-300">
                <Icon size={14} />
              </span>
              <span className="min-w-0 flex-1 truncate text-sm text-zinc-300">
                {item.text}
              </span>
              <span className="shrink-0 text-xs text-zinc-500">
                {item.when}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
