import { withSSRContext } from "aws-amplify";
import type { GetServerSidePropsContext } from "next";
import { Routes } from "../routes";

type ServerSideAuthState =
  | { isAuthenticated: true; token: string }
  | {
      isAuthenticated: false;
      redirect: {
        destination: string;
        permanent: boolean;
      };
    };

/**
 * Server side cognito authentication
 *
 * @param context GetServerSidePropsContext
 * @returns Serverside authentication state
 */
export async function getServerSideAuth(
  context: GetServerSidePropsContext
): Promise<ServerSideAuthState> {
  const { Auth } = withSSRContext(context);

  try {
    const cognitoUser = await Auth.currentAuthenticatedUser();
    const session = cognitoUser.getSignInUserSession();
    const token = session.getAccessToken().getJwtToken();
    return { token: token, isAuthenticated: true };
  } catch (error) {
    return {
      isAuthenticated: false,
      redirect: {
        destination: Routes.login.href(),
        permanent: false,
      },
    };
  }
}
