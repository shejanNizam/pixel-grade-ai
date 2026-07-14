import StatCard from "@/components/shared/StatCard";
import type { IconType } from "react-icons";
import { FiAward, FiDollarSign } from "react-icons/fi";
import {
  MdOutlineQrCodeScanner,
  MdOutlineStyle,
  MdOutlineVerified,
} from "react-icons/md";
import { stats } from "./data";

/** One icon per metric, in the order they appear in `stats`. */
const icons: IconType[] = [
  FiDollarSign,
  MdOutlineStyle,
  MdOutlineVerified,
  MdOutlineQrCodeScanner,
  FiAward,
];

export default function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {stats.map((stat, i) => (
        <StatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          delta={stat.delta}
          Icon={icons[i]}
        />
      ))}
    </div>
  );
}
