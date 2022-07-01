import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { UsersPageQuery } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { triggerErrorToast } from "components/Toast";
import { UsersPage } from "components/users/UsersPage";
import type { GetServerSidePropsContext, NextPage } from "next";

const GET_USERS = gql`
  query UsersPage {
    ...UsersPage
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

const Users: NextPage<Props> = ({ users }: Props) => {
  const { data, refetch } = useQuery<UsersPageQuery>(GET_USERS, {
    fetchPolicy: "no-cache",
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
      <UsersPage users={data?.users ?? users} refetchUsers={refetch} />
    </AuthedLayout>
  );
};

export default Users;
