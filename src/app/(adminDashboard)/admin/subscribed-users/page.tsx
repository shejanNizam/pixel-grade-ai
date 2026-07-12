import BackHeading from "../_components/BackHeading";
import { subscribedUsers } from "../_components/users/data";
import UsersTable from "../_components/users/UsersTable";

export default function SubscribedUsersPage() {
  return (
    <div>
      <BackHeading label="Subscribed Users" />
      <UsersTable
        heading="Total subscribed users"
        seed={subscribedUsers}
        status="Subscribed"
        showFilter={false}
      />
    </div>
  );
}
