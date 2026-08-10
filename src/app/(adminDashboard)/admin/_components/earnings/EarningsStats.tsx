"use client";

import { useGetSubscriberStatsQuery } from "@/redux/features/subscription/subscriptionApi";
import { useGetEarningsQuery } from "@/redux/features/transaction/transactionApi";
import type { IconType } from "react-icons";
import { FiStar } from "react-icons/fi";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlineMonetizationOn,
} from "react-icons/md";
import AdminStatCard from "../AdminStatCard";

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });

/** Subscription revenue, not marketplace payouts: money flows from
 *  subscribers to the platform, so there is nothing pending payout. Gross
 *  revenue comes from the transaction ledger; MRR and active-subscription
 *  counts from the subscription stats endpoint. */
export default function EarningsStats() {
  const { data: earnings, isLoading: loadingEarnings } = useGetEarningsQuery();
  const { data: stats, isLoading: loadingStats } = useGetSubscriberStatsQuery();

  if (loadingEarnings || loadingStats) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="h-40 animate-pulse rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black"
          />
        ))}
      </div>
    );
  }

  const cards: {
    label: string;
    value: string;
    delta?: string;
    Icon: IconType;
  }[] = [
    {
      label: "Total earnings",
      value: money(earnings?.grossRevenue ?? 0),
      Icon: MdOutlineMonetizationOn,
    },
    {
      label: "Monthly recurring revenue",
      value: money(stats?.mrr ?? 0),
      Icon: MdOutlineAccountBalanceWallet,
    },
    {
      label: "Slab revenue",
      value: (stats?.activeSubscriptions ?? 0).toLocaleString("en-US"),
      delta:
        stats && stats.newThisMonth > 0
          ? `+${stats.newThisMonth} this month`
          : undefined,
      Icon: FiStar,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map(({ label, value, delta, Icon }) => (
        <AdminStatCard
          key={label}
          value={value}
          label={label}
          delta={delta}
          pill
          Icon={Icon}
        />
      ))}
    </div>
  );
}
