import { useState } from "react";
import { Button } from "../Button";
import { InviteUserModal } from "./InviteUserModal";
import { UsersPageQuery } from "@generated/graphql";
import { gql } from "@apollo/client";
import { triggerSuccessToast } from "../Toast";
import { UsersTable } from "./UsersTable";

type Props = {
  users: NonNullable<UsersPageQuery["users"]>;
  refetchUsers: () => void;
};

UsersPage.fragments = {
  users: gql`
    fragment UsersPage on Query {
      ...UsersTable
    }
    ${UsersTable.fragments.users}
  `,
};

export function UsersPage({ users, refetchUsers }: Props) {
  const [showInviteModal, setShowInviteModal] = useState(false);

  return (
    <>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Users</h1>

      <div className="flex justify-end mb-6">
        <Button onClick={() => setShowInviteModal(true)}>Invite User</Button>
      </div>
      <div className="mb-4 lg:mb-0">
        <UsersTable users={users} />
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
