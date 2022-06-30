import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import { FlatCohortsPageQuery } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { FlatCohortsPage } from "components/cohorts/FlatCohortsPage";
import { triggerErrorToast } from "components/Toast";
import type { GetServerSidePropsContext, NextPage } from "next";

const GET_FLAT_COHORTS = gql`
  query FlatCohortsPage {
    ...FlatCohortsPage_Cohorts
  }
  ${FlatCohortsPage.fragments.cohorts}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);

  const result: ApolloQueryResult<FlatCohortsPageQuery> = await client.query({
    query: GET_FLAT_COHORTS,
  });

  const cohorts = processResult(result, (r) => r.cohorts);

  return {
    props: {
      cohorts,
    },
  };
}

type Props = {
  cohorts: NonNullable<FlatCohortsPageQuery["cohorts"]>;
};

const Cohorts: NextPage<Props> = ({ cohorts }) => {
  const { data, refetch } = useQuery<FlatCohortsPageQuery>(GET_FLAT_COHORTS, {
    fetchPolicy: "network-only", // Used for first execution
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
      <FlatCohortsPage
        cohorts={data?.cohorts ?? cohorts}
        refetch={refetch}
      />
    </AuthedLayout>
  );
};

export default Cohorts;
