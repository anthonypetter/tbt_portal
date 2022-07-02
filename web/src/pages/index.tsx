import { ApolloQueryResult, gql } from "@apollo/client";
import {
  HomePageAdminQuery,
  HomePageMentorQuery,
  HomePageTutorQuery,
  UserRole,
} from "@generated/graphql";
import { getSession } from "@lib/apollo-client";
import { processResult } from "@utils/apollo";
import {
  fetchCurrentUser,
  getServerSideAuth,
} from "@utils/auth/server-side-auth";
import { NotFoundError } from "@utils/errors";
import { Routes } from "@utils/routes";
import { assertUnreachable, fromJust } from "@utils/types";
import { AuthedLayout } from "components/AuthedLayout";
import { MentorTeacherHome } from "components/home/MentorTeacherHome";
import { TutorTeacherHome } from "components/home/TutorTeacherHome";
import type { GetServerSidePropsContext, NextPage } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const currentUser = await fetchCurrentUser(auth.token);

  if (!currentUser) {
    throw new NotFoundError();
  }

  // Temporary redirect from home to organizations if you're an admin.
  if (currentUser.role === UserRole.Admin) {
    return {
      redirect: {
        destination: Routes.organizations.href(),
        permanent: false,
      },
    };
  }

  const homeData = await fetchAccordingToRole(currentUser.role, auth.token);

  return {
    props: {
      homeData,
    },
  };
}

type Props = {
  homeData: HomeResults;
};

const Home: NextPage<Props> = ({ homeData }) => {
  switch (homeData.role) {
    case UserRole.Admin:
      return <AuthedLayout>Admin</AuthedLayout>;

    case UserRole.MentorTeacher:
      return (
        <AuthedLayout>
          <MentorTeacherHome
            currentUser={fromJust(homeData.data.currentUser, "currentUser")}
            teacherEngagements={homeData.data.teacherEngagements}
          />
        </AuthedLayout>
      );

    case UserRole.TutorTeacher:
      return (
        <AuthedLayout>
          <TutorTeacherHome
            currentUser={fromJust(homeData.data.currentUser, "currentUser")}
            teacherEngagements={homeData.data.teacherEngagements}
            teacherCohorts={homeData.data.teacherCohorts}
          />
        </AuthedLayout>
      );

    default:
      assertUnreachable(homeData);
  }
};

export default Home;

type HomeResults =
  | {
      role: UserRole.Admin;
      data: HomePageAdminQuery;
    }
  | {
      role: UserRole.MentorTeacher;
      data: HomePageMentorQuery;
    }
  | {
      role: UserRole.TutorTeacher;
      data: HomePageTutorQuery;
    };

async function fetchAccordingToRole(
  role: UserRole,
  token: string
): Promise<HomeResults> {
  switch (role) {
    case UserRole.Admin: {
      const data = await fetchAdminData(token);
      return { role, data };
    }

    case UserRole.MentorTeacher: {
      const data = await fetchMentorData(token);
      return { role, data };
    }

    case UserRole.TutorTeacher: {
      const data = await fetchTutorData(token);
      return { role, data };
    }

    default:
      assertUnreachable(role);
  }
}

/**
 * Admin Home  fetch
 */

const GET_HOME_DATA_ADMIN = gql`
  query HomePageAdmin {
    currentUser {
      fullName
    }
  }
`;

async function fetchAdminData(token: string) {
  const { client } = getSession(token);

  const result: ApolloQueryResult<HomePageAdminQuery> = await client.query({
    query: GET_HOME_DATA_ADMIN,
  });

  return processResult(result, (r) => r);
}

/**
 * Mentor Tutor fetch
 */

const GET_HOME_DATA_MENTOR = gql`
  query HomePageMentor {
    ...MentorTeacherHome_Home
  }
  ${MentorTeacherHome.fragments.mentorHome}
`;

async function fetchMentorData(token: string) {
  const { client } = getSession(token);

  const result: ApolloQueryResult<HomePageMentorQuery> = await client.query({
    query: GET_HOME_DATA_MENTOR,
  });

  return processResult(result, (r) => r);
}

/**
 * Tutor Teacher fetch
 */

const GET_HOME_DATA_TUTOR = gql`
  query HomePageTutor {
    ...TutorTeacherHome_Home
  }
  ${TutorTeacherHome.fragments.tutorHome}
`;

async function fetchTutorData(token: string) {
  const { client } = getSession(token);

  const result: ApolloQueryResult<HomePageTutorQuery> = await client.query({
    query: GET_HOME_DATA_TUTOR,
  });

  return processResult(result, (r) => r);
}
