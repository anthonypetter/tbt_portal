import type { NextPage, GetServerSidePropsContext } from "next";
import { AuthedLayout } from "components/AuthedLayout";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { OrganizationDetailPage } from "components/organizations/OrganizationDetailPage";
import { gql, useQuery, ApolloQueryResult } from "@apollo/client";
import { OrganizationDetailPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { fromJust } from "@utils/types";

const GET_ORGANIZATION = gql`
  query OrganizationDetailPage($id: ID!) {
    organization(id: $id) {
      ...OrganizationDetails
    }
  }
  ${OrganizationDetailPage.fragments.details}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  const params = fromJust(context.params, "context.params");
  console.log("params", params);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);
  const result: ApolloQueryResult<OrganizationDetailPageQuery> =
    await client.query({
      query: GET_ORGANIZATION,
      variables: { id: params.id },
      fetchPolicy: "no-cache",
    });

  const organization = processResult(result, (r) => r.organization);
  console.log("server side single org", organization);

  return {
    props: { organization },
  };
}

type Props = {
  organization: NonNullable<OrganizationDetailPageQuery["organization"]>;
};

const Organizations: NextPage<Props> = ({ organization }) => {
  const { data } = useQuery<OrganizationDetailPageQuery>(GET_ORGANIZATION, {
    variables: { id: organization.id },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
    onError: (error) => {
      console.error(error);
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to fetch this organization.",
      });
    },
  });

  console.log("client-side org", data?.organization);

  // To avoid loading flash, we'll preload the table using server-side fetched orgs.
  return (
    <AuthedLayout>
      <OrganizationDetailPage organization={organization} />
    </AuthedLayout>
  );
};

export default Organizations;
