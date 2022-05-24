import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { Routes } from "@utils/routes";
import { parseEngagementId, parseOrgId } from "@utils/parsing";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { organizationId } = parseOrgId(context.params);
  const { engagementId } = parseEngagementId(context.params);

  return {
    redirect: {
      destination: Routes.engagement.cohorts.href(organizationId, engagementId),
      permanent: true,
    },
  };
}

//The redirect happens before this renders, but is still required for the redirect to work.
const Engagement: NextPage = () => {
  return <p>Redirecting..</p>;
};

export default Engagement;
