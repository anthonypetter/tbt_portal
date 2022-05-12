import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { Routes } from "@utils/routes";
import { parseOrgId } from "@utils/parsing";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);

  if (!auth.isAuthenticated) {
    return { redirect: auth.redirect };
  }

  const { organizationId } = parseOrgId(context.params);

  return {
    redirect: {
      destination: Routes.org.engagements.href(organizationId),
      permanent: true,
    },
  };
}

//The redirect happens before this renders, but is still required for the redirect to work.
const Organization: NextPage = () => {
  return <p>Redirecting..</p>;
};

export default Organization;
