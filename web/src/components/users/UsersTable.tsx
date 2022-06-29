import { useMemo } from "react";
import { gql } from "@apollo/client";
import { Column, Cell } from "react-table";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { UsersPageQuery } from "@generated/graphql";
import { AccountStatusBadge } from "components/AccountStatusBadge";
import { getTextForRole } from "components/RoleText";
import { ContextMenu } from "components/ContextMenu";

UsersTable.fragments = {
  users: gql`
    fragment UsersTable on Query {
      users {
        id
        fullName
        email
        role
        accountStatus
        inviteSentAt
      }
    }
  `,
};

type Props = {
  users: NonNullable<UsersPageQuery["users"]>;
};

export function UsersTable({ users }: Props) {
  const { columns, data: tableData } = usePrepUserData(users);
  return <Table columns={columns} data={tableData} />;
}

export type UserTableData = {
  id: string;
  fullName: string;
  email: string;
  role: string;
  accountStatus: string;
  inviteSentAt?: Date | undefined;
};

function usePrepUserData(users: NonNullable<UsersPageQuery["users"]>): {
  data: UserTableData[];
  columns: Column<UserTableData>[];
} {
  const columns: Column<UserTableData>[] = useMemo(() => {
    return [
      {
        Header: "Name",
        accessor: "fullName",
      },
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
        Header: "invite Sent At",
        accessor: "inviteSentAt",
        Cell: ({ row }) => {
          console.log(row.values)
          return row.values.inviteSentAt
            ? new Date(row.values.inviteSentAt).toLocaleString("en-US")
            : ""
        }
      },
      {
        Header: () => null,
        accessor: "id",
        id: CONTEXT_MENU_ID,
        Cell: ({ row }: Cell<UserTableData>) => {
          const userData: UserTableData = {
            id: row.values.id,
            email: row.values.email,
            fullName: row.values.fullName,
            role: row.values.role,
            accountStatus: row.values.accountStatus,
            inviteSentAt: row.values.inviteSentAt
          }

          return <ContextMenu userData={userData} />;
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
        fullName: user.fullName,
        email: user.email,
        role: roleText === "Administrator" ? "Admin" : roleText,
        accountStatus: user.accountStatus,
        inviteSentAt: user.inviteSentAt || undefined
      };
    });
    // Used concatenated emails as a way to determine if users
    // dependency has changed. (instead of stringifying an array of objects)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emails]);

  return { data, columns };
}
