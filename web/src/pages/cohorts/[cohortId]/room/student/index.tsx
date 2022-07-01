import { gql } from "@apollo/client";
import { CohortDetailsRoomFragment } from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { parseCohortId, parseMeetingUrl } from "@utils/parsing";
import { Routes } from "@utils/routes";
import { CohortRoomPage } from "components/cohorts/CohortRoomPage";
import { GetServerSidePropsContext, NextPage } from "next";

const GET_COHORT = gql`
  query CohortDetailsRoomPage($id: ID!) {
    cohort(id: $id) {
      ...CohortDetailsRoom
    }
  }
  ${CohortRoomPage.fragments.roomCohort}
`;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);
  const { meetingUrl } = parseMeetingUrl(context.query);
  console.log("the meeting url is", meetingUrl);

  if (!auth.isAuthenticated) {
    return {
      redirect: {
        destination: Routes.studentRoomUnAuthenticated.href(meetingUrl),
      },
    };
  }

  const { cohortId } = parseCohortId(context.params);

  const { client } = getSession(auth.token);

  const result = await client.query({
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
  cohort: NonNullable<CohortDetailsRoomFragment>;
};

const CohortRoom: NextPage<Props> = ({ cohort }) => {
  return <CohortRoomPage roomType="student" cohort={cohort} />;
};

export default CohortRoom;
