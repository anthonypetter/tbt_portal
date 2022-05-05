import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  from,
  NormalizedCacheObject,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";

export type Session = {
  client: ApolloClient<NormalizedCacheObject>;
  token: string;
};

let __session: Session;

function cacheSession(session: Session) {
  __session = session;
}

function getSessionFromMemory() {
  return __session;
}

export function getSession(token: string) {
  const session = getSessionFromMemory();

  /**
   * If we dont have a client in memory, let's create one.
   */
  if (!session?.client) {
    console.log(
      "[🚀 ApolloClient]: No client found in cache. Creating new apollo client"
    );

    // create new client
    const client = createApolloClient({ token });

    // cache the client in session object
    const session = { client, token };
    cacheSession(session);

    // return it
    return session;
  }

  /**
   * If we had a token before but a new one comes in, this is a
   * refresh operation.  let's spin up a new client with the new token.
   */

  if (session.token !== token) {
    console.log(
      "[🚀 ApolloClient]: Session refresh. Spinning up client with new refreshed token."
    );

    // create new client
    const client = createApolloClient({ token });

    // cache the client in session object
    const newSession = { client, token };
    cacheSession(newSession);

    // return it
    return newSession;
  }

  console.log("[🚀 ApolloClient]: Returning previously cached client.");
  return session;
}

function createApolloClient({ token }: { token?: string | null }) {
  const authHeader = token
    ? { headers: { authorization: `Bearer ${token}` } }
    : {};

  const httpLink = new HttpLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    ...authHeader,
  });

  // Log any GraphQL errors or network error that occurred
  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.forEach(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
        )
      );
    }

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  return new ApolloClient({
    ssrMode: true,
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
}
