import BackHeading from "../_components/BackHeading";
import SubscribersTable from "../_components/users/SubscribersTable";

export default function SubscribedUsersPage() {
  return (
    <div>
      <BackHeading label="Subscribed Users" />
      <SubscribersTable />
    </div>
  );
}
