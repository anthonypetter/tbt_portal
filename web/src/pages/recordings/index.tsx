import { Header } from "components/Header";
import type { NextPage, GetServerSidePropsContext } from "next";
import { getAuth } from "@utils/auth";
import { AppLayout } from "components/AppLayout";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  return {
    props: {
      hello: "world",
    },
  };
}

const Recordings: NextPage = () => {
  return (
    <AppLayout>
      <Header>Recordings</Header>
    </AppLayout>
  );
};

export default Recordings;
