import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { CohortDetailsPageQuery } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { parseCohortId } from "@utils/parsing";
import { AuthedLayout } from "components/AuthedLayout";
import { CohortDetailsPage } from "components/cohorts/CohortDetailsPage";
import { Tab } from "components/cohorts/CohortDetailsPage/CohortDetailsTabs";
import { triggerErrorToast } from "components/Toast";
import { GetServerSidePropsContext, NextPage } from "next";

const GET_COHORT = gql`
  query CohortDetailsPage($id: ID!) {
    cohort(id: $id) {
      ...CohortDetailsPageDetails_Cohort
    }
  }
  ${CohortDetailsPage.fragments.cohort}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { cohortId } = parseCohortId(context.params);
  const { client } = getSession(auth.token);

  const result: ApolloQueryResult<CohortDetailsPageQuery> = await client.query({
    query: GET_COHORT,
    variables: { id: cohortId },
    fetchPolicy: "no-cache",
  });

  const cohort = processResult(result, (r) => r.cohort);

  return {
    props: { cohort },
  };
}

type Props = {
  cohort: NonNullable<CohortDetailsPageQuery["cohort"]>;
};

const CohortDetail: NextPage<Props> = ({ cohort }) => {
  const { data } = useQuery<CohortDetailsPageQuery>(GET_COHORT, {
    variables: { id: cohort.id },
    fetchPolicy: "network-only",
    onError: (error) => {
      console.error(error);
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to fetch this cohort.",
      });
    },
  });

  return (
    <AuthedLayout>
      <CohortDetailsPage
        tabCohort={{
          tab: Tab.Details,
          cohort: data?.cohort ?? cohort,
        }}
      />
    </AuthedLayout>
  );
};

export default CohortDetail;
