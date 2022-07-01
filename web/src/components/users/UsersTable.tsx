import { ApolloError, gql, useMutation } from "@apollo/client";
import {
  InviteUserMutation,
  UserRole,
  UsersPageQuery,
} from "@generated/graphql";
import { fromJust } from "@utils/types";
import { AccountStatusBadge } from "components/AccountStatusBadge";
import { ContextMenu } from "components/ContextMenu";
import { getTextForRole } from "components/RoleText";
import { CONTEXT_MENU_ID, Table } from "components/Table";
import { triggerErrorToast, triggerSuccessToast } from "components/Toast";
import { useMemo } from "react";
import { Cell, Column } from "react-table";

const USERS_PAGE_QUERY_NAME = "UsersPage";

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

const INVITE_USER = gql`
  mutation InviteUser($input: InviteUserInput!) {
    inviteUser(input: $input) {
      id
    }
  }
`;

type Props = {
  users: NonNullable<UsersPageQuery["users"]>;
};

export function UsersTable({ users }: Props) {
  const [inviteUser] = useMutation<InviteUserMutation>(INVITE_USER, {
    onError: (error: ApolloError) => {
      triggerErrorToast({
        message: "Something went wrong.",
        sub: error.message,
      });
    },
    onCompleted: () => triggerSuccessToast({ message: "Invite sent" }),
    refetchQueries: [USERS_PAGE_QUERY_NAME],
    onQueryUpdated(observableQuery) {
      observableQuery.refetch();
    },
  });

  const contextMenu = useMemo(() => {
    return {
      onClickInviteUser(userData: UserTableData) {
        inviteUser({
          variables: {
            input: {
              email: fromJust(userData.email, "email"),
              fullName: fromJust(userData.fullName, "fullName"),
              role: fromJust(userData.role, "role"),
            },
          },
        });
      },
    };
  }, [inviteUser]);

  const { columns, data: tableData } = usePrepUserData(users, contextMenu);
  return <Table columns={columns} data={tableData} />;
}

type UserTableData = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  accountStatus: string;
  inviteSentAt?: Date | undefined;
};

function usePrepUserData(
  users: NonNullable<UsersPageQuery["users"]>,
  contextMenu: {
    onClickInviteUser: (userData: UserTableData) => void;
  }
): {
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
        Cell: ({ row }: Cell<UserTableData>) => {
          return getTextForRole(row.values.role);
        },
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
          return row.values.inviteSentAt
            ? new Date(row.values.inviteSentAt).toLocaleString("en-US")
            : "";
        },
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
            inviteSentAt: row.values.inviteSentAt,
          };

          const context = userData.inviteSentAt ? (
            <ContextMenu />
          ) : (
            <ContextMenu
              onClickInviteUser={() => contextMenu.onClickInviteUser(userData)}
            />
          );

          return context;
        },
      },
    ];
  }, [contextMenu]);

  const stringifiedUsers = JSON.stringify(users);

  const data = useMemo(() => {
    return users.map((user) => {
      return {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        accountStatus: user.accountStatus,
        inviteSentAt: user.inviteSentAt || undefined,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stringifiedUsers]);

  return { data, columns };
}
