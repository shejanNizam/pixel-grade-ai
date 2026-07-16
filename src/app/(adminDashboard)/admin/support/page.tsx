import BackHeading from "../_components/BackHeading";
import TicketsTable from "../_components/support/TicketsTable";

export default function AdminSupportPage() {
  return (
    <div>
      <BackHeading label="Support" />
      <TicketsTable />
    </div>
  );
}
