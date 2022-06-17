import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { CohortsPage } from "components/cohorts/CohortsPage";
import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { CohortsPageQuery } from "@generated/graphql";
import { triggerErrorToast } from "components/Toast";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";

const GET_COHORTS = gql`
  query CohortsPage {
    ...Cohorts
  }
  ${CohortsPage.fragments.cohorts}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);

  const result: ApolloQueryResult<CohortsPageQuery> = await client.query({
    query: GET_COHORTS,
  });

  const cohorts = processResult(result, (r) => r.cohorts);

  return {
    props: {
      cohorts,
    },
  };
}

type Props = {
  cohorts: NonNullable<CohortsPageQuery["cohorts"]>;
};

const Cohorts: NextPage<Props> = ({ cohorts }) => {
  const { data } = useQuery<CohortsPageQuery>(GET_COHORTS, {
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
    onError: (error) => {
      console.error(error);
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to fetch cohorts.",
      });
    },
  });

  return (
    <AuthedLayout>
      <CohortsPage cohorts={data?.cohorts ?? cohorts} />
    </AuthedLayout>
  );
};

export default Cohorts;
