import AdvancedImport from "../_components/new-analysis/AdvancedImport";
import BestResultTips from "../_components/new-analysis/BestResultTips";
import CreditBalanceCard from "../_components/new-analysis/CreditBalanceCard";
import { demoPlan } from "../_components/new-analysis/demoAccount";
import QuickImport from "../_components/new-analysis/QuickImport";
import ScanSettings from "../_components/new-analysis/ScanSettings";

export default function NewAnalysis() {
  // PixelScope (Advanced multi-image scan) is a paid feature — Free is locked
  // out of it and the Pixel Verified badge that comes with it.
  const pixelscopeLocked = !demoPlan.pixelscope;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="text-2xl font-medium text-white">Scan Your Card</h2>
          <p className="mt-1.5 text-xs text-zinc-500">
            Get AI-powered analysis and a professional grade estimate in seconds
          </p>
        </div>

        <CreditBalanceCard />
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-12">
          <QuickImport />
          <AdvancedImport locked={pixelscopeLocked} />
        </div>

        <div className="space-y-10">
          <ScanSettings />
          <BestResultTips />
        </div>
      </div>
    </div>
  );
}
