import MarketStats from "../_components/price-tracker/MarketStats";
import PriceTable from "../_components/price-tracker/PriceTable";

export default function PriceTracker() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-medium text-white">Price Tracker</h2>
        <p className="mt-1.5 text-xs text-zinc-500">
          Track card prices, monitor market trends
        </p>
      </div>

      <MarketStats />
      <PriceTable />
    </div>
  );
}
