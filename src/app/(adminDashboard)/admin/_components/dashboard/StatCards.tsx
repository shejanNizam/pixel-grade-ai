import type { IconType } from "react-icons";
import { FiDollarSign, FiExternalLink } from "react-icons/fi";
import { MdOutlineGroups, MdOutlineHowToReg } from "react-icons/md";
import AdminStatCard from "../AdminStatCard";
import { stats } from "./data";

/** One icon per metric, in the order they appear in `stats`. */
const icons: IconType[] = [
  MdOutlineGroups,
  MdOutlineHowToReg,
  FiExternalLink,
  FiDollarSign,
];

export default function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat, i) => (
        <AdminStatCard
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
