import type { NextPage, GetServerSidePropsContext } from "next";
import { AuthedLayout } from "components/AuthedLayout";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { gql, useQuery, ApolloQueryResult } from "@apollo/client";
import { EngagementDetailsPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { parseEngagementId } from "@utils/parsing";
import { EngagementDetailsPage } from "components/engagements/EngagementDetailsPage";
import { Tab } from "components/engagements/EngagementDetailsTabs";

const GET_ENGAGEMENT = gql`
  query EngagementDetailsPage($id: ID!) {
    engagement(id: $id) {
      ...EngagementDetailsPageCohorts
    }
  }
  ${EngagementDetailsPage.fragments.cohortsView}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { engagementId } = parseEngagementId(context.params);
  const { client } = getSession(auth.token);

  const result: ApolloQueryResult<EngagementDetailsPageQuery> =
    await client.query({
      query: GET_ENGAGEMENT,
      variables: { id: engagementId },
      fetchPolicy: "no-cache",
    });

  const engagement = processResult(result, (r) => r.engagement);

  return {
    props: { engagement },
  };
}

type Props = {
  engagement: NonNullable<EngagementDetailsPageQuery["engagement"]>;
};

const EngagementDetail: NextPage<Props> = ({ engagement }) => {
  const { data } = useQuery<EngagementDetailsPageQuery>(GET_ENGAGEMENT, {
    variables: { id: engagement.id },
    fetchPolicy: "network-only",
    onError: (error) => {
      console.error(error);
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to fetch this engagement.",
      });
    },
  });

  return (
    <AuthedLayout>
      <EngagementDetailsPage
        tabEng={{
          tab: Tab.Cohorts,
          engagement: data?.engagement ?? engagement,
        }}
      />
    </AuthedLayout>
  );
};

export default EngagementDetail;
