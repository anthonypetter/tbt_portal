import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "components/auth/AuthProvider";
import { configureAmplify } from "@lib/amplify";
import { Layout } from "components/Layout";
import Head from "next/head";

configureAmplify();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </AuthProvider>
    </>
  );
}

export default MyApp;
