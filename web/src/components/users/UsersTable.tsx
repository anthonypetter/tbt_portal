import { useMemo } from "react";
import { Column, Cell } from "react-table";
import { Table } from "components/Table";
import { UsersPageQuery } from "@generated/graphql";
import { AccountStatusBadge } from "components/AccountStatusBadge";
import { getTextForRole } from "components/RoleText";
import { ContextMenu } from "components/ContextMenu";

type Props = {
  users: NonNullable<UsersPageQuery["users"]>;
};

export function UsersTable({ users }: Props) {
  const { columns, data: tableData } = usePrepUserData(users);
  return <Table columns={columns} data={tableData} />;
}

type UserTableData = {
  id: string;
  email: string;
  role: string;
  accountStatus: string;
};

function usePrepUserData(users: NonNullable<UsersPageQuery["users"]>): {
  data: UserTableData[];
  columns: Column<UserTableData>[];
} {
  const columns: Column<UserTableData>[] = useMemo(() => {
    return [
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Role",
        accessor: "role",
      },
      {
        Header: "Status",
        accessor: "accountStatus",
        Cell: ({ row }: Cell<UserTableData>) => {
          return (
            <AccountStatusBadge accountStatus={row.values.accountStatus} />
          );
        },
      },
      {
        Header: () => null,
        accessor: "id",
        Cell: ({ row }: Cell<UserTableData>) => {
          return (
            <div className="flex justify-end">
              <ContextMenu />
            </div>
          );
        },
      },
    ];
  }, []);

  const emails = users.map((u) => u.email).join();

  const data = useMemo(() => {
    return users.map((user) => {
      const roleText = getTextForRole(user.role);
      return {
        id: user.id,
        email: user.email,
        role: roleText === "Administrator" ? "Admin" : roleText,
        accountStatus: user.accountStatus,
      };
    });
    // Used concatenated emails as a way to determine if users
    // dependency has changed. (instead of stringifying an array of objects)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emails]);

  return { data, columns };
}
