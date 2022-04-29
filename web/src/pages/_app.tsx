import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "components/auth/AuthProvider";
import { configureAmplify } from "@lib/amplify";
import { Layout } from "components/Layout";

configureAmplify();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  );
}

export default MyApp;
