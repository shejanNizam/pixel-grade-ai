import BackHeading from "./_components/BackHeading";
import RecentUsers from "./_components/dashboard/RecentUsers";
import StatCards from "./_components/dashboard/StatCards";

export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <BackHeading label="Dashboard" />
      <StatCards />
      <RecentUsers />
    </div>
  );
}
