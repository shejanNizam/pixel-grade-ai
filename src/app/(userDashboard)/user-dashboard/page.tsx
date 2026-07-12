import CollectionBySet from "./_components/dashboard/CollectionBySet";
import CollectionValueChart from "./_components/dashboard/CollectionValueChart";
import RecentScans from "./_components/dashboard/RecentScans";
import StatCards from "./_components/dashboard/StatCards";
import TotalValueBySet from "./_components/dashboard/TotalValueBySet";

export default function UserDashboard() {
  return (
    <div className="space-y-8">
      <StatCards />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <CollectionValueChart />
        <RecentScans />
      </div>

      <div className="grid gap-10 lg:grid-cols-2">
        <CollectionBySet />
        <TotalValueBySet />
      </div>
    </div>
  );
}
