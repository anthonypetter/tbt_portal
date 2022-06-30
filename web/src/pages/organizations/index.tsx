import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { OrganizationsPageQuery } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { OrganizationsPage } from "components/organizations/OrganizationsPage";
import { triggerErrorToast } from "components/Toast";
import type { GetServerSidePropsContext, NextPage } from "next";

const GET_ORGANIZATIONS = gql`
  query OrganizationsPage {
    ...OrganizationsPage_Organizations
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

  return {
    props: { organizations },
  };
}

type Props = {
  organizations: NonNullable<OrganizationsPageQuery["organizations"]>;
};

const Organizations: NextPage<Props> = ({ organizations }) => {
  const { data, refetch } = useQuery<OrganizationsPageQuery>(
    GET_ORGANIZATIONS,
    {
      fetchPolicy: "network-only", // Used for first execution
      onError: (error) => {
        console.error(error);
        triggerErrorToast({
          message: "Looks like something went wrong.",
          sub: "We weren't able to fetch organizations.",
        });
      },
    }
  );

  // To avoid loading flash, we'll preload the table using server-side fetched orgs.
  return (
    <AuthedLayout>
      <OrganizationsPage
        organizations={data?.organizations ?? organizations}
        refetch={() => refetch()}
      />
    </AuthedLayout>
  );
};

export default Organizations;
