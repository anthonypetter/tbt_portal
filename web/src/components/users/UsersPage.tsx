import { useState } from "react";
import { Button } from "../Button";
import { InviteUserModal } from "./InviteUserModal";
import { UsersPageQuery } from "@generated/graphql";
import { gql } from "@apollo/client";
import { triggerSuccessToast } from "../Toast";
import { UsersTable } from "./UsersTable";
import { Routes } from "@utils/routes";
import { PageHeader } from "components/PageHeader";
import { HomeIcon } from "@heroicons/react/solid";

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
      <PageHeader
        title="Users"
        breadcrumbs={[
          { name: "Home", href: Routes.home.href(), icon: HomeIcon },
          {
            name: "Users",
            href: Routes.users.href(),
            current: true,
          },
        ]}
      />

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
