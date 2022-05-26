import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { PageHeader } from "components/PageHeader";
import { breadcrumbs } from "@utils/breadcrumbs";

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

const LiveView: NextPage = () => {
  return (
    <AuthedLayout>
      <PageHeader
        title="Live View"
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.liveView({ current: true }),
        ]}
      />
    </AuthedLayout>
  );
};

export default LiveView;
