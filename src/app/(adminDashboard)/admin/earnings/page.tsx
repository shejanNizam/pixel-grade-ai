import BackHeading from "../_components/BackHeading";
import EarningsStats from "../_components/earnings/EarningsStats";
import TransactionsTable from "../_components/earnings/TransactionsTable";

export default function EarningsPage() {
  return (
    <div className="space-y-10">
      <BackHeading label="Earnings" />
      <EarningsStats />
      <TransactionsTable />
    </div>
  );
}
