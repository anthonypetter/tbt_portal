import type { NextPage, GetServerSidePropsContext } from "next";
import { AuthedLayout } from "components/AuthedLayout";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { OrganizationsPage } from "components/organizations/OrganizationsPage";
import { gql, useQuery, ApolloQueryResult } from "@apollo/client";
import { OrganizationsPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";

export const GET_ORGANIZATIONS_QUERY_NAME = "OrganizationsPage";
const GET_ORGANIZATIONS = gql`
  query OrganizationsPage {
    ...Organizations
  }
  ${OrganizationsPage.fragments.organizations}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);
  const result: ApolloQueryResult<OrganizationsPageQuery> = await client.query({
    query: GET_ORGANIZATIONS,
  });

  const organizations = processResult(result, (r) => r.organizations);
  console.log("server side orgs", organizations);

  return {
    props: { organizations },
  };
}

type Props = {
  organizations: NonNullable<OrganizationsPageQuery["organizations"]>;
};

const Organizations: NextPage<Props> = ({ organizations }) => {
  const { data } = useQuery<OrganizationsPageQuery>(GET_ORGANIZATIONS, {
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
    onError: (error) => {
      console.error(error);
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to fetch organizations.",
      });
    },
  });

  // To avoid loading flash, we'll preload the table using server-side fetched orgs.
  return (
    <AuthedLayout>
      <OrganizationsPage organizations={data?.organizations ?? organizations} />
    </AuthedLayout>
  );
};

export default Organizations;
