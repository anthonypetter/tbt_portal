import { useMemo, useState } from "react";
import { Column, Cell } from "react-table";
import { Table } from "components/Table";
import { Button } from "./Button";
import { InviteUserModal } from "./InviteUserModal";
import { UsersPageQuery, UserRole } from "@generated/graphql";
import { AccountStatusBadge } from "components/AccountStatusBadge";
import { gql } from "@apollo/client";
import { assertUnreachable } from "@utils/types";
import { triggerSuccessToast } from "./Toast";

type Props = {
  users: NonNullable<UsersPageQuery["users"]>;
  refetchUsers: () => void;
};

UsersPage.fragments = {
  users: gql`
    fragment Users on Query {
      users {
        email
        role
        accountStatus
      }
    }
  `,
};

export function UsersPage({ users, refetchUsers }: Props) {
  const { columns, data: tableData } = usePrepUserData(users);

  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users</h1>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowInviteModal(true)}>Invite User</Button>
      </div>
      <div className="mb-4 lg:mb-0">
        <Table columns={columns} data={tableData} />
      </div>

      <InviteUserModal
        show={showInviteModal}
        onCancel={() => setShowInviteModal(false)}
        onSuccess={() => {
          refetchUsers();
          setShowInviteModal(false);
          triggerSuccessToast({ message: "User successfully invited!" });
        }}
      />
    </>
  );
}

type UserTableData = {
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
    ];
  }, []);

  const emails = users.map((u) => u.email).join();

  const data = useMemo(() => {
    return users.map((user) => {
      return {
        email: user.email,
        role: getTextForRole(user.role),
        accountStatus: user.accountStatus,
      };
    });
    // Used concatenated emails as a way to determine if users
    // dependency has changed. (instead of stringifying an array of objects)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [emails]);

  return { data, columns };
}

function getTextForRole(role: UserRole): string {
  switch (role) {
    case UserRole.Admin:
      return "Admin";

    case UserRole.MentorTeacher:
      return "Mentor Teacher";

    case UserRole.TutorTeacher:
      return "Tutor Teacher";

    default:
      return assertUnreachable(role, "role");
  }
}
