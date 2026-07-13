import ProfileCard from "../_components/creator-profile/ProfileCard";
import RecentActivity from "../_components/creator-profile/RecentActivity";
import YourImpact from "../_components/creator-profile/YourImpact";

export default function CreatorProfile() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-white">
          Your creator profile
        </h2>
        <p className="mt-1.5 text-xs text-zinc-500">
          Your slab creator standing, reach and recent activity
        </p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <ProfileCard />
        <RecentActivity />
      </div>

      <YourImpact />
    </div>
  );
}
