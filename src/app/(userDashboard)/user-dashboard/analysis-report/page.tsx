import BuyCustomSlab from "../_components/analysis-report/BuyCustomSlab";
import CreatorProfile from "../_components/analysis-report/CreatorProfile";
import QuickActions from "../_components/analysis-report/QuickActions";
import RecentInspection from "../_components/analysis-report/RecentInspection";
import RecentReports from "../_components/analysis-report/RecentReports";
import YourImpact from "../_components/analysis-report/YourImpact";

export default function AnalysisReport() {
  return (
    <div className="space-y-8">
      <QuickActions />

      <section className="space-y-4">
        <h2 className="text-base font-medium text-white">Recent inspection</h2>

        <div className="grid gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <RecentInspection />
          <BuyCustomSlab />
        </div>
      </section>

      <YourImpact />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <RecentReports />
        <CreatorProfile />
      </div>
    </div>
  );
}
