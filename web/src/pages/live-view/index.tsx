import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { AuthedLayout } from "components/AuthedLayout";
import { PageHeader } from "components/PageHeader";
import { breadcrumbs } from "@utils/breadcrumbs";
import queryString from "query-string";
import { WherebyRoom } from "components/cohorts/WherebyRoom";
import { useRouter } from "next/router";

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
  const { asPath } = useRouter();
  const query = queryString.parse(asPath.split(/\?/)[1]);
  return (
    <AuthedLayout>
      <PageHeader
        title="Live View"
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.liveView({ current: true }),
        ]}
      />
      <WherebyRoom
        roomUrl={`${query.roomUrl}`}
      />{" "}
    </AuthedLayout>
  );
};

export default LiveView;
