import { ApolloQueryResult, gql, useQuery } from "@apollo/client";
import type { GetServerSidePropsContext, NextPage } from "next";

import { MySchedulePageQuery } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { CohortsScheduleCalendar } from "components/cohorts/scheduleCalendar/CohortsScheduleCalendar";
import { MySchedulePage } from "components/schedule/MySchedulePage";
import { triggerErrorToast } from "components/Toast";

const GET_TEACHER_COHORTS = gql`
  query MySchedulePage {
    teacherCohorts {
      ...CohortForScheduleCalendar
    }
    ...CurrentUserQueryForMySchedulePage
  }
  ${CohortsScheduleCalendar.fragments.cohort}
  ${MySchedulePage.fragments.query}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { client } = getSession(auth.token);
  const result: ApolloQueryResult<MySchedulePageQuery> = await client.query({
    query: GET_TEACHER_COHORTS,
  });

  const cohorts = processResult(result, (r) => r.teacherCohorts);
  const currentUser = processResult(result, r => r.currentUser);

  return {
    props: { cohorts, currentUser },
  };
}

type Props = {
  cohorts: NonNullable<MySchedulePageQuery["teacherCohorts"]>;
  currentUser: NonNullable<MySchedulePageQuery["currentUser"]>;
};

const MySchedule: NextPage<Props> = ({ cohorts, currentUser }) => {
  const { data } = useQuery<MySchedulePageQuery>(GET_TEACHER_COHORTS, {
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
    onError: (error) => {
      console.error(error);
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to fetch the schedule.",
      });
    },
  });

  // To avoid loading flash, we'll preload the table using server-side fetched cohorts.
  return (
    <AuthedLayout>
      <MySchedulePage
        cohorts={data?.teacherCohorts ?? cohorts}
        targetUserIds={[data?.currentUser?.id ?? currentUser.id]}
      />
    </AuthedLayout>
  );
};

export default MySchedule;
