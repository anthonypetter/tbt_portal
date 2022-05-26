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

const Cohorts: NextPage = () => {
  return (
    <AuthedLayout>
      <PageHeader
        title="Cohorts"
        breadcrumbs={[
          breadcrumbs.home(),
          breadcrumbs.cohorts({ current: true }),
        ]}
      />
    </AuthedLayout>
  );
};

export default Cohorts;
