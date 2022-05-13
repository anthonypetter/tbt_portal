import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { AuthProvider } from "components/auth/AuthProvider";
import { configureAmplify } from "@lib/amplify";
import { Layout } from "components/Layout";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "components/ThemeProvider";
import "react-datepicker/dist/react-datepicker.css";
import "components/DatePicker/datepicker.css";

configureAmplify();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Layout>
          <Toaster position="top-right" />
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default MyApp;
