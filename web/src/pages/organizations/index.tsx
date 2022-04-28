import { Header } from "components/Header";
import type { NextPage, GetServerSidePropsContext } from "next";
import { AppLayout } from "components/AppLayout";
import { getServerSideAuth } from "@utils/auth/server-side-auth";

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

type Props = {
  hello: string;
};

const Organizations: NextPage<Props> = () => {
  return (
    <AppLayout>
      <Header>Organizations</Header>
    </AppLayout>
  );
};

export default Organizations;
