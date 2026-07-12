import StatCard, { type StatCardProps } from "@/components/shared/StatCard";
import {
  MdOutlineBarChart,
  MdOutlineDiamond,
  MdOutlineFavoriteBorder,
  MdOutlineStyle,
} from "react-icons/md";

interface CollectionStatsProps {
  totalCards: number;
  favorites: number;
}

export default function CollectionStats({
  totalCards,
  favorites,
}: CollectionStatsProps) {
  const stats: StatCardProps[] = [
    {
      value: String(totalCards),
      label: "Total Cards",
      caption: "Across 28 sets",
      Icon: MdOutlineStyle,
    },
    {
      value: "$ 6762",
      label: "Estimated value",
      caption: "Total market value",
      Icon: MdOutlineDiamond,
    },
    {
      value: "$ 874",
      label: "Collection Gain",
      caption: "vs Last Month",
      delta: "11.3 %",
      Icon: MdOutlineBarChart,
    },
    {
      value: String(favorites),
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
