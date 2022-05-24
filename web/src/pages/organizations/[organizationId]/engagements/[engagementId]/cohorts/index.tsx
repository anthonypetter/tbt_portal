import type { NextPage, GetServerSidePropsContext } from "next";
import { AuthedLayout } from "components/AuthedLayout";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { gql, useQuery, ApolloQueryResult } from "@apollo/client";
import { EngagementDetailPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { parseEngagementId } from "@utils/parsing";
import { EngagementDetailPage } from "components/engagements/EngagementDetailPage";
import { Tab } from "components/engagements/EngagementTabs";

const GET_ENGAGEMENT = gql`
  query EngagementDetailPage($id: ID!) {
    engagement(id: $id) {
      ...EngagementDetailPageCohorts
    }
  }
  ${EngagementDetailPage.fragments.cohortsView}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { engagementId } = parseEngagementId(context.params);
  const { client } = getSession(auth.token);

  const result: ApolloQueryResult<EngagementDetailPageQuery> =
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
  engagement: NonNullable<EngagementDetailPageQuery["engagement"]>;
};

const EngagementDetail: NextPage<Props> = ({ engagement }) => {
  const { data } = useQuery<EngagementDetailPageQuery>(GET_ENGAGEMENT, {
    variables: { id: engagement.id },
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-first",
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
      <EngagementDetailPage
        tabEng={{
          tab: Tab.Cohorts,
          engagement: data?.engagement ?? engagement,
        }}
      />
    </AuthedLayout>
  );
};

export default EngagementDetail;
