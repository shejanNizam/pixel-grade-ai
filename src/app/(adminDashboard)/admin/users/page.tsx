import BackHeading from "../_components/BackHeading";
import UsersTable from "../_components/users/UsersTable";

export default function UsersPage() {
  return (
    <div>
      <BackHeading label="Users" />
      <UsersTable heading="Total users" />
    </div>
  );
}
