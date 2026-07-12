import type { IconType } from "react-icons";
import { FiStar } from "react-icons/fi";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineMonetizationOn,
} from "react-icons/md";
import AdminStatCard from "../AdminStatCard";
import { earnings } from "./data";

/** One icon per metric, in the order they appear in `earnings`. */
const icons: IconType[] = [
  MdOutlineMonetizationOn,
  MdOutlineAccountBalanceWallet,
  FiStar,
];

export default function EarningsStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {earnings.map((stat, i) => (
        <AdminStatCard
          key={stat.label}
          value={stat.value}
          label={stat.label}
          delta={stat.delta}
          pill
          Icon={icons[i]}
        />
      ))}
    </div>
  );
}
