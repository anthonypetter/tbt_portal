import { useState } from "react";
import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { UsersPage } from "components/users/UsersPage";
import { gql, ApolloQueryResult } from "@apollo/client";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { UsersPageQuery, useUsersPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";

const GET_USERS = gql`
  query UsersPage {
    ...Users
  }
  ${UsersPage.fragments.users}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);

  const usersResult: ApolloQueryResult<UsersPageQuery> = await client.query({
    query: GET_USERS,
  });

  const users = processResult(usersResult, (r) => r.users);

  return {
    props: {
      users,
    },
  };
}

type Props = {
  users: NonNullable<UsersPageQuery["users"]>;
};

const Users: NextPage<Props> = (props: Props) => {
  const [users, setUsers] = useState(props.users);

  const { refetch } = useUsersPageQuery({
    fetchPolicy: "no-cache",
    skip: true,
    onCompleted: (data) => {
      if (data.users) {
        setUsers(data.users);
      }
    },
    onError: (error) => {
      console.error(error);

      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to refresh the users. We're on it.",
      });
    },
  });

  return (
    <AuthedLayout>
      <UsersPage users={users} refetchUsers={refetch} />
    </AuthedLayout>
  );
};

export default Users;
