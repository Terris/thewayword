import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@repo/ui";
import type { OrganizationUserWithUserDoc } from "./types";

type OrganizationUserRow = OrganizationUserWithUserDoc;

const columns: ColumnDef<OrganizationUserRow>[] = [
  {
    accessorKey: "user._id",
    header: "User ID",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
];

export function OrganizationUsersTable({
  organizationUsers,
}: {
  organizationUsers: OrganizationUserRow[];
}) {
  return <DataTable columns={columns} data={organizationUsers} />;
}
