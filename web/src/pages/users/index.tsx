import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { UsersPage } from "components/UsersPage";
import { gql, ApolloQueryResult } from "@apollo/client";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { GetUsersQuery } from "@generated/graphql";

const GET_USERS = gql`
  query GetUsers {
    users {
      email
      role
      accountStatus
    }
  }
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);

  const usersResult: ApolloQueryResult<GetUsersQuery> = await client.query({
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
  users: NonNullable<GetUsersQuery["users"]>;
};

const Users: NextPage<Props> = ({ users }: Props) => {
  return (
    <AuthedLayout>
      <UsersPage users={users} />
    </AuthedLayout>
  );
};

export default Users;
