"use client";

import StatCard, { type StatCardProps } from "@/components/shared/StatCard";
import {
  useGetCollectionBySetQuery,
  useGetCollectionSummaryQuery,
  useGetCollectionValueOverTimeQuery,
  useGetMyCollectionQuery,
} from "@/redux/features/collection/collectionApi";
import {
  MdOutlineBarChart,
  MdOutlineDiamond,
  MdOutlineFavoriteBorder,
  MdOutlineStyle,
} from "react-icons/md";

const money = (value: number) =>
  value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export default function CollectionStats() {
  const { data: summary, isLoading } = useGetCollectionSummaryQuery();
  const { data: bySet } = useGetCollectionBySetQuery();
  const { data: valueSeries } = useGetCollectionValueOverTimeQuery({
    months: 2,
  });
  // A one-row query whose meta.total is the favorites count.
  const { data: favorites } = useGetMyCollectionQuery({
    favorite: true,
    limit: 1,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-2xl border border-violet-500/30 bg-linear-to-br from-violet-950/50 to-black"
          />
        ))}
      </div>
    );
  }

  const setCount = bySet?.length ?? 0;

  // This month's value minus last month's — only meaningful with both points.
  const [prev, current] = valueSeries ?? [];
  const gain =
    prev !== undefined && current !== undefined
      ? current.value - prev.value
      : null;

  const stats: StatCardProps[] = [
    {
      value: (summary?.totalCards ?? 0).toLocaleString("en-US"),
      label: "Total Cards",
      caption: `Across ${setCount} set${setCount === 1 ? "" : "s"}`,
      Icon: MdOutlineStyle,
    },
    {
      value: money(summary?.totalValue ?? 0),
      label: "Estimated value",
      caption: "Total market value",
      Icon: MdOutlineDiamond,
    },
    {
      value: gain === null ? "—" : money(gain),
      label: "Collection Gain",
      caption: "vs Last Month",
      Icon: MdOutlineBarChart,
    },
    {
      value: String(favorites?.meta?.total ?? 0),
      label: "Favorites",
      caption: "Mark as favorite",
      Icon: MdOutlineFavoriteBorder,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
