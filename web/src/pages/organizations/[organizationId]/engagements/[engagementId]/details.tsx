import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { EngagementDetail_DetailsQuery } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { parseEngagementId } from "@utils/parsing";
import { AuthedLayout } from "components/AuthedLayout";
import { EngagementDetailsPage } from "components/engagements/EngagementDetailsPage";
import { Tab } from "components/engagements/EngagementDetailsTabs";
import { triggerErrorToast } from "components/Toast";
import type { GetServerSidePropsContext, NextPage } from "next";

const GET_ENGAGEMENT = gql`
  query EngagementDetail_Details($id: ID!) {
    engagement(id: $id) {
      ...EngagementDetailsPage_Details
    }
  }
  ${EngagementDetailsPage.fragments.detailsView}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { engagementId } = parseEngagementId(context.params);
  const { client } = getSession(auth.token);

  const result: ApolloQueryResult<EngagementDetail_DetailsQuery> =
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
  engagement: NonNullable<EngagementDetail_DetailsQuery["engagement"]>;
};

const EngagementDetail: NextPage<Props> = ({ engagement }) => {
  const { data } = useQuery<EngagementDetail_DetailsQuery>(GET_ENGAGEMENT, {
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
          tab: Tab.Details,
          engagement: data?.engagement ?? engagement,
        }}
      />
    </AuthedLayout>
  );
};

export default EngagementDetail;
