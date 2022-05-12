import type { NextPage, GetServerSidePropsContext } from "next";
import { AuthedLayout } from "components/AuthedLayout";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { OrganizationDetailPage } from "components/organizations/OrganizationDetailPage";
import { gql, useQuery, ApolloQueryResult } from "@apollo/client";
import { OrganizationDetailPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { parseOrgId } from "@utils/parsing";

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

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { organizationId } = parseOrgId(context.params);
  const { client } = getSession(auth.token);
  const result: ApolloQueryResult<OrganizationDetailPageQuery> =
    await client.query({
      query: GET_ORGANIZATION,
      variables: { id: organizationId },
      fetchPolicy: "no-cache",
    });

  const organization = processResult(result, (r) => r.organization);

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

  // To avoid loading flash, we'll preload the table using server-side fetched orgs.
  return (
    <AuthedLayout>
      <OrganizationDetailPage
        organization={data?.organization ?? organization}
      />
    </AuthedLayout>
  );
};

export default Organizations;
