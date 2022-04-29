import { useMemo, useState } from "react";
// import { User } from "@generated/graphql";
import { Column } from "react-table";
import { Table } from "components/Table";
import { Button } from "./Button";
import { InviteUserModal } from "./InviteUserModal";

type User = {
  email: string;
  role: string;
  status: string;
};

type Props = {
  users: User[];
};

export function UsersPage({ users }: Props) {
  const { columns, data } = usePrepUserData(users);
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users</h1>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowInviteModal(true)}>Invite User</Button>
      </div>
      <div className="mb-4 lg:mb-0">
        <Table columns={columns} data={data} />
      </div>

      <InviteUserModal
        show={showInviteModal}
        onCancel={() => setShowInviteModal(false)}
      />
    </>
  );
}

type UserTableData = {
  email: string;
  role: string;
  status: string;
};

function usePrepUserData(users: User[]): {
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
        accessor: "status",
      },
    ];
  }, []);

  const data = useMemo(() => {
    return users.map((user, i) => {
      return {
        email: user.email,
        role: user.role,
        status: user.status,
      };
    });
  }, [users.length]); //TODO: not right.

  return { data, columns };
}
