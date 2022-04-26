import { Header } from "components/Header";
import type { NextPage, GetServerSidePropsContext } from "next";
import { AppLayout } from "components/AppLayout";
import { getAuth } from "@utils/auth";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  console.log("authtoken", auth.token);

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
