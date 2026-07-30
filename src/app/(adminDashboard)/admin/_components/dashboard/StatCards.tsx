"use client";

import {
  useGetAdminOverviewQuery,
  type TStatCard,
} from "@/redux/features/dashboard/dashboardApi";
import type { IconType } from "react-icons";
import { FiDollarSign, FiExternalLink } from "react-icons/fi";
import { MdOutlineGroups, MdOutlineHowToReg } from "react-icons/md";
import AdminStatCard from "../AdminStatCard";

/** null delta → no chip: growth from a zero baseline has no percentage. */
const formatDelta = (delta: number | null): string | undefined => {
  if (delta === null) return undefined;
  const sign = delta >= 0 ? "+" : "";
  return `${sign}${delta}% from last month`;
};

const formatCount = (value: number) => value.toLocaleString("en-US");

const formatMoney = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

export default function StatCards() {
  const { data, isLoading, isError } = useGetAdminOverviewQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-sm text-red-400">
        Couldn&apos;t load dashboard stats. Refresh to try again.
      </p>
    );
  }

  const cards: {
    label: string;
    stat: TStatCard;
    money?: boolean;
    Icon: IconType;
  }[] = [
    { label: "Total users", stat: data.totalUsers, Icon: MdOutlineGroups },
    {
      label: "Subscribed users",
      stat: data.subscribedUsers,
      Icon: MdOutlineHowToReg,
    },
    {
      label: "New subscribers",
      stat: data.newSubscribers,
      Icon: FiExternalLink,
    },
    {
      label: "Total earnings",
      stat: data.totalEarnings,
      money: true,
      Icon: FiDollarSign,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(({ label, stat, money, Icon }) => (
        <AdminStatCard
          key={label}
          value={money ? formatMoney(stat.value) : formatCount(stat.value)}
          label={label}
          delta={formatDelta(stat.delta)}
          Icon={Icon}
        />
      ))}
    </div>
  );
}
