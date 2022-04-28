import { Header } from "components/Header";
import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AppLayout } from "components/AppLayout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  return {
    props: {
      hello: "world",
    },
  };
}

const MySchedule: NextPage = () => {
  return (
    <AppLayout>
      <Header>My Schedule</Header>
    </AppLayout>
  );
};

export default MySchedule;
