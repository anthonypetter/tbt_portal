import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { OrgDetailPageDetailsQuery } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { parseOrgId } from "@utils/parsing";
import { AuthedLayout } from "components/AuthedLayout";
import { OrganizationDetailPage } from "components/organizations/OrganizationDetailPage";
import { Tab } from "components/organizations/OrganizationTabs";
import { triggerErrorToast } from "components/Toast";
import type { GetServerSidePropsContext, NextPage } from "next";

const GET_ORGANIZATION = gql`
  query OrgDetailPageDetails($id: ID!) {
    organization(id: $id) {
      ...OrganizationDetailPage_Details
    }
  }
  ${OrganizationDetailPage.fragments.detailsView}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { organizationId } = parseOrgId(context.params);
  const { client } = getSession(auth.token);
  const result: ApolloQueryResult<OrgDetailPageDetailsQuery> =
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
  organization: NonNullable<OrgDetailPageDetailsQuery["organization"]>;
};

const Organizations: NextPage<Props> = ({ organization }) => {
  const { data } = useQuery<OrgDetailPageDetailsQuery>(GET_ORGANIZATION, {
    variables: { id: organization.id },
    fetchPolicy: "network-only",
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
        tabOrg={{
          tab: Tab.Details,
          organization: data?.organization ?? organization,
        }}
      />
    </AuthedLayout>
  );
};

export default Organizations;
