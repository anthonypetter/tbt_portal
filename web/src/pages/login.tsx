import type { NextPage, GetServerSidePropsContext } from "next";
import { getServerSideAuth } from "@utils/auth/server-side-auth";
import { LoginPage } from "components/LoginPage";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const auth = await getServerSideAuth(context);
  console.log("auth", auth);

  if (auth.isAuthenticated) {
    console.log(
      `[Auth] - User is already authenticated. Redirecting to Home page.`
    );
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

const Login: NextPage = () => {
  return <LoginPage />;
};

export default Login;
