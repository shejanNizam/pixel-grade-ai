import BackHeading from "../_components/BackHeading";
import { users } from "../_components/users/data";
import UsersTable from "../_components/users/UsersTable";

export default function UsersPage() {
  return (
    <div>
      <BackHeading label="Users" />
      <UsersTable heading="Total users" seed={users} status="New users" />
    </div>
  );
}
