import { CognitoUser } from "@aws-amplify/auth";
import { UserRole } from "@generated/graphql";
import { Routes } from "@utils/routes";
import { assertUnreachable } from "@utils/types";
import { useAuth } from "components/auth/AuthProvider";
import { Button } from "components/Button";
import { Container } from "components/Container";
import { ErrorBox } from "components/ErrorBox";
import { Spinner } from "components/Spinner";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { FieldError } from "../FieldError";
import { LoginStatus } from "./AuthContext";
import { ChangePasswordPage } from "./ChangePasswordPage";

type LoginInputs = {
  email: string;
  password: string;
};

type Status = "idle" | "loading" | "success";

export function LoginPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | null>(null);
  const router = useRouter();
  const auth = useAuth();

  const [loginFailure, setLoginFailure] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInputs>();

  const onSubmit: SubmitHandler<LoginInputs> = async ({ email, password }) => {
    try {
      setStatus("loading");
      setLoginFailure(null);
      const { status, message, cognitoUser, userRole } = await auth.login(
        email,
        password
      );

      switch (status) {
        case LoginStatus.Success:
          setStatus("success");
          router.push(getPostLoginHref(userRole));

          break;

        case LoginStatus.ChangePassword:
          setShowChangePassword(true);
          setCognitoUser(cognitoUser);

          break;

        case LoginStatus.Failure:
          setStatus("idle");
          setLoginFailure(message);
          break;

        default:
          return assertUnreachable(status, "status");
      }
    } catch {
      setStatus("idle");
      setLoginFailure("Login attempt failed.");
    }
  };

  return (
    <>
      <Head>
        <title>Log in</title>
        <meta name="description" content="Log in to Tutored By Teachers!" />
      </Head>

      {showChangePassword && cognitoUser ? (
        <ChangePasswordPage cognitoUser={cognitoUser} />
      ) : (
        <UnauthCenterLayout>
          <HeaderAndLogo text="Sign in to your account" />

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <Container padding="lg">
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      {...register("email", {
                        required: {
                          value: true,
                          message: "Email is required.",
                        },
                      })}
                      type="email"
                      autoComplete="email"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    />
                    {errors.email?.message && (
                      <FieldError msg={errors.email?.message} />
                    )}
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
                      {...register("password", {
                        required: {
                          value: true,
                          message: "Password is required.",
                        },
                      })}
                      type="password"
                      autoComplete="current-password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    />
                    {errors.password?.message && (
                      <FieldError msg={errors.password?.message} />
                    )}
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

                {loginFailure && <ErrorBox msg={loginFailure} />}

                <div>
                  <ButtonAndIcon
                    Icon={SignInIcon}
                    status={status}
                    text="Sign in"
                  />
                </div>
              </form>
            </Container>
          </div>
        </UnauthCenterLayout>
      )}
    </>
  );
}

function SignInIcon({ status }: { status: Status }) {
  switch (status) {
    case "idle":
      return (
        <FaLock
          className="w-5 h-5 group-hover:text-blue-400 text-blue-700"
          aria-hidden="true"
        />
      );

    case "success":
      return <FaLockOpen className="h-5" />;

    case "loading":
      return <Spinner />;

    default:
      return assertUnreachable(status, "Status");
  }
}

function Logo() {
  return (
    <Image
      width={112}
      height={60}
      src={"/tbt-logo.png"}
      alt=""
      className="rounded-md mx-auto border-2"
      layout="fixed"
    />
  );
}

export function HeaderAndLogo({ text }: { text: string }) {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <div className="flex justify-center">
        <Logo />
      </div>

      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {text}
      </h2>
    </div>
  );
}

export function UnauthCenterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {children}
    </div>
  );
}

type StatusProps = {
  status: Status;
};

export function ButtonAndIcon({
  status,
  Icon,
  text,
}: {
  Icon: (props: StatusProps) => JSX.Element;
  text: string;
  status: Status;
}) {
  return (
    <Button
      className="group relative flex items-center w-full h-10"
      type="submit"
    >
      <Icon status={status} />
      {status === "idle" && <span className="ml-2">{text}</span>}
    </Button>
  );
}

function getPostLoginHref(role?: UserRole) {
  switch (role) {
    case UserRole.Admin:
      return Routes.organizations.href();

    default:
      return Routes.home.href();
  }
}
