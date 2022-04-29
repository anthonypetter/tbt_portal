import { Header } from "components/Header";
import type { NextPage, GetServerSidePropsContext } from "next";
import { AuthedLayout } from "components/AuthedLayout";
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
    <AuthedLayout>
      <Header>Organizations</Header>
    </AuthedLayout>
  );
};

export default Organizations;
