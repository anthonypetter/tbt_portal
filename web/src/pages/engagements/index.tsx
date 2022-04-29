import { Header } from "components/Header";
import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";

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

const Engagements: NextPage = () => {
  return (
    <AuthedLayout>
      <Header>Engagements</Header>
    </AuthedLayout>
  );
};

export default Engagements;
