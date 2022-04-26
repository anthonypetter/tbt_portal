import { useState, FormEvent } from "react";
import { useAuth } from "components/auth/AuthProvider";
import { useRouter } from "next/router";
import Head from "next/head";
import { Routes } from "@utils/routes";
import { Button } from "components/Button";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { Spinner } from "components/Spinner";
import { assertUnreachable } from "@utils/types";
import Image from "next/image";

type IconT = "locked" | "unlocked" | "loading";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [icon, setIcon] = useState<IconT>("locked");
  const router = useRouter();
  const auth = useAuth();

  //TODO: replace with proper form handling/validation (probably react-hook-form)
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setIcon("loading");
      const result = await auth.login(email, password);

      if (result?.success) {
        setIcon("unlocked");
        router.push(Routes.home.href());
      } else {
        setIcon("locked");
        alert(`Sign in failed: ${result?.message}`);
      }
    } catch {
      setIcon("locked");
      //TODO: replace
      alert("login failed");
    }
  }

  return (
    <>
      <Head>
        <title>Log in</title>
        <meta name="description" content="Log in to CourseUp!" />
      </Head>

      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <Image
              width={112}
              height={60}
              src={"/tbt-logo.png"}
              alt=""
              className="rounded-md mx-auto border-2"
              layout="fixed"
            />
          </div>

          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-gray-600 hover:text-gray-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>

              <div>
                <Button
                  className="group relative flex items-center w-full h-10"
                  type="submit"
                >
                  {icon === "locked" ? (
                    <>
                      <SignInIcon icon={icon} />
                      <span className="ml-1">Sign in</span>
                    </>
                  ) : (
                    <SignInIcon icon={icon} />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

function SignInIcon({ icon }: { icon: IconT }) {
  switch (icon) {
    case "locked":
      return (
        <FaLock
          className="w-5 h-5 group-hover:text-blue-400 text-blue-700"
          aria-hidden="true"
        />
      );

    case "unlocked":
      return <FaLockOpen className="h-5" />;

    case "loading":
      return <Spinner />;

    default:
      return assertUnreachable(icon, "IconT");
  }
}
