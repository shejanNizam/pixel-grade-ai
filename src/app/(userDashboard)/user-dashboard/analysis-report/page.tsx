import QuickActions from "../_components/analysis-report/QuickActions";
import RecentInspection from "../_components/analysis-report/RecentInspection";
import RecentReports from "../_components/analysis-report/RecentReports";

export default function AnalysisReport() {
  return (
    <div className="space-y-8">
      <QuickActions />

      <section className="space-y-4">
        <h2 className="text-base font-medium text-white">Recent inspection</h2>
        <RecentInspection />
      </section>

      <RecentReports />
    </div>
  );
}
