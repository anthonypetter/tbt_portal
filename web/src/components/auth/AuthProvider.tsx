import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Auth } from "@aws-amplify/auth";
import { getSession, Session } from "@lib/apollo-client";
import { ApolloProvider, gql, ApolloQueryResult } from "@apollo/client";
import { fromJust } from "@utils/types";
import { useRouter } from "next/router";
import { getUnauthenticatedRoutes, Routes } from "@utils/routes";
import { CurrentUserQuery, User } from "@generated/graphql";
import { AuthContext, LoginStatus } from "./AuthContext";
import { useInterval } from "@utils/useInterval";
import { Spinner } from "components/Spinner";
import { Layout } from "components/Layout";

const REFRESH_INTERVAL = 30 * 60 * 1000; //refresh every half hour

/**
 * AuthProvider
 */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [didPasswordChangeComplete, setDidPasswordChangeComplete] =
    useState(false);

  const [authState, setAuthState] = useState<{
    user: User | null;
    token: string | null;
    isAuthenticating: boolean;
  }>({
    user: null,
    token: null,
    isAuthenticating: true,
  });

  useInterval(() => {
    const refreshToken = async () => {
      const cognitoUser = await Auth.currentAuthenticatedUser();
      const session = cognitoUser.getSignInUserSession();
      const refreshToken = session.getRefreshToken();

      const onRefreshSuccess = (user: User, token: string) => {
        setAuthState({ user, token, isAuthenticating: false });
      };

      cognitoUser.refreshSession(
        refreshToken,
        await getRefreshTokenCallback(onRefreshSuccess)
      );
    };

    refreshToken();
  }, REFRESH_INTERVAL);

  /**
   * On browser refresh (on mount)
   */

  useEffect(() => {
    /**
     *
     * 1. Fetch session from cognito
     * 2. If successful, refresh and set token to state
     * 3. Create a new apollo client with token in header.
     */

    async function setAuthStatus() {
      try {
        const cognitoUser = await Auth.currentAuthenticatedUser();
        const session = cognitoUser.getSignInUserSession();
        const refreshToken = session.getRefreshToken();

        if (session.isValid()) {
          const onRefreshSuccess = (user: User, token: string) => {
            setAuthState({ user, token, isAuthenticating: false });
          };

          const onRefreshError = () => setAuthState(unauthenticated());

          cognitoUser.refreshSession(
            refreshToken,
            await getRefreshTokenCallback(onRefreshSuccess, onRefreshError)
          );
        } else {
          console.log("[AuthProvider] - Current session is not valid");
          setAuthState(unauthenticated());
        }
      } catch (error) {
        console.error(error);
        console.log("[AuthProvider] - No current session");
        setAuthState(unauthenticated());
      }
    }

    setAuthStatus();
  }, [didPasswordChangeComplete]);

  /**
   * login
   */

  const login = useCallback(async (email: string, password: string) => {
    try {
      const cognitoUser = await Auth.signIn(email, password);
      if (cognitoUser.challengeName === "NEW_PASSWORD_REQUIRED") {
        return {
          cognitoUser: cognitoUser,
          status: LoginStatus.ChangePassword,
          message: "Login successful. Password change required.",
        };
      }

      const token = cognitoUser.signInUserSession
        .getAccessToken()
        .getJwtToken();

      const user = await fetchUser(token);

      if (user) {
        setAuthState({ user, token: token, isAuthenticating: false });
        return {
          cognitoUser,
          status: LoginStatus.Success,
          message: "Login successful",
        };
      } else {
        setAuthState(unauthenticated());
        return {
          cognitoUser,
          status: LoginStatus.Failure,
          message: "User not found.",
        };
      }
    } catch (error: unknown) {
      console.error(error);
      setAuthState(unauthenticated());

      return {
        cognitoUser: null,
        status: LoginStatus.Failure,
        message: error instanceof Error ? error.message : "Login failed.",
      };
    }
  }, []);

  /**
   * Signout
   */

  const signOut = useCallback(async () => {
    try {
      // purgeStorage();
      console.log("purge storage");
    } catch (error) {
      console.error(error);
    } finally {
      setAuthState(unauthenticated());
      await Auth.signOut();
      router.push(Routes.login.href());
    }
  }, [router]);

  const onPasswordChange = useCallback(async () => {
    setDidPasswordChangeComplete(true);
  }, []);

  const context = useMemo(
    () => ({
      user: authState.user,
      login,
      signOut,
      isAuthenticating: authState.isAuthenticating,
      onPasswordChange,
    }),
    [
      authState.user,
      login,
      signOut,
      authState.isAuthenticating,
      onPasswordChange,
    ]
  );

  const session = authState.token ? getSession(authState.token) : null;

  return (
    <AuthContext.Provider value={context}>
      {getUnauthenticatedRoutes()
        .map((r) => r.path())
        .includes(router.pathname) ? (
        <>{children}</>
      ) : (
        <ApolloWrapper session={session}>{children}</ApolloWrapper>
      )}
    </AuthContext.Provider>
  );
}

function ApolloWrapper({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  return session ? (
    <ApolloProvider client={session.client}>{children}</ApolloProvider>
  ) : (
    <Layout>
      <div className="flex h-screen justify-center">
        <Spinner color="border-blue-700" />
      </div>
    </Layout>
  );
}

/**
 * Helpers
 */

function unauthenticated() {
  return {
    cognitoUser: null,
    user: null,
    token: null,
    isAuthenticating: false,
  };
}

async function getRefreshTokenCallback(
  onSuccess: (user: User, token: string) => void,
  onError?: () => void
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return async (err: unknown, session: any) => {
    if (err) {
      console.error("[AuthProvider] - Error Refreshing session.", err);
      if (onError) {
        onError();
      }
    } else {
      const refreshedAccessToken = session.getAccessToken().getJwtToken();
      const user = await fetchUser(refreshedAccessToken);

      if (!user) {
        throw new Error("User not found in refresh operation.");
      }

      console.log("[AuthProvider] - Token refresh success:", {
        email: user.email,
        token: refreshedAccessToken,
      });

      onSuccess(user, refreshedAccessToken);
    }
  };
}

/**
 * Hooks
 */

export function useAuth() {
  const mAuthContext = useContext(AuthContext);
  const auth = fromJust(mAuthContext, "AuthContext");
  return auth;
}

/**
 * API
 */

export const GET_CURRENT_USER = gql`
  query CurrentUser {
    currentUser {
      email
      accountStatus
      role
    }
  }
`;

async function fetchUser(accessToken: string): Promise<User | null> {
  const { client } = getSession(accessToken);

  const result: ApolloQueryResult<CurrentUserQuery> = await client.query({
    query: GET_CURRENT_USER,
    fetchPolicy: "no-cache",
  });

  return result.data.currentUser ?? null;
}
