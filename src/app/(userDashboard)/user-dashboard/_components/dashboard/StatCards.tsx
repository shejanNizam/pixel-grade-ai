"use client";

import StatCard from "@/components/shared/StatCard";
import {
  useGetUserOverviewQuery,
  type TStatCard,
} from "@/redux/features/dashboard/dashboardApi";
import type { IconType } from "react-icons";
import { FiAward, FiDollarSign } from "react-icons/fi";
import {
  MdOutlineQrCodeScanner,
  MdOutlineStyle,
  MdOutlineVerified,
} from "react-icons/md";

/** null delta → no pill: growth from a zero baseline has no percentage. */
const formatDelta = (delta: number | null): string | undefined =>
  delta === null ? undefined : `${delta >= 0 ? "+" : ""}${delta} %`;

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function StatCards() {
  const { data, isLoading, isError } = useGetUserOverviewQuery();

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black"
          />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return (
      <p className="rounded-2xl border border-red-500/30 bg-red-950/20 p-5 text-sm text-red-400">
        Couldn&apos;t load your dashboard stats. Refresh to try again.
      </p>
    );
  }

  const cards: {
    label: string;
    stat: TStatCard | null;
    money?: boolean;
    Icon: IconType;
  }[] = [
    {
      label: "Total collection value",
      stat: data.collectionValue,
      money: true,
      Icon: FiDollarSign,
    },
    {
      label: "Cards in collection",
      stat: data.cardsInCollection,
      Icon: MdOutlineStyle,
    },
    { label: "Slabs ordered", stat: data.slabsOrdered, Icon: MdOutlineVerified },
    { label: "Total scans", stat: data.totalScans, Icon: MdOutlineQrCodeScanner },
    // Null when nothing is graded yet — an ungraded collection has no average.
    { label: "Average grade", stat: data.averageGrade, Icon: FiAward },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {cards.map(({ label, stat, money: isMoney, Icon }) => (
        <StatCard
          key={label}
          value={
            stat === null
              ? "—"
              : isMoney
                ? money(stat.value)
                : stat.value.toLocaleString("en-US")
          }
          label={label}
          delta={stat === null ? undefined : formatDelta(stat.delta)}
          Icon={Icon}
        />
      ))}
    </div>
  );
}
