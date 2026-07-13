import StatCard from "@/components/shared/StatCard";
import type { IconType } from "react-icons";
import {
  FiAward,
  FiBarChart2,
  FiCheckCircle,
  FiPackage,
  FiStar,
} from "react-icons/fi";
import { impact } from "./data";

/** One icon per metric, in the order they appear in `impact`. */
const icons: IconType[] = [
  FiCheckCircle,
  FiBarChart2,
  FiAward,
  FiPackage,
  FiStar,
];

export default function YourImpact() {
  return (
    <section>
      <h2 className="mb-5 text-base font-medium text-white">Your impact</h2>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {impact.map((stat, i) => (
          <StatCard
            key={stat.label}
            value={stat.value}
            label={stat.label}
            Icon={icons[i]}
          />
        ))}
      </div>
    </section>
  );
}
