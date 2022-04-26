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

const Engagements: NextPage = () => {
  return (
    <AppLayout>
      <Header>Engagements</Header>
    </AppLayout>
  );
};

export default Engagements;
