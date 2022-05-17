import { useState } from "react";
import { Auth, CognitoUser } from "@aws-amplify/auth";
import { ShieldCheckIcon, CheckIcon } from "@heroicons/react/solid";
import { Spinner } from "components/Spinner";
import { assertUnreachable } from "@utils/types";
import { useForm, SubmitHandler } from "react-hook-form";
import { ErrorBox } from "components/ErrorBox";
import { ButtonAndIcon, HeaderAndLogo, UnauthCenterLayout } from "./LoginPage";
import { FieldError } from "../FieldError";
import { useAuth } from "./AuthProvider";

type PasswordChangeInputs = {
  password: string;
  confirmPassword: string;
};

type Status = "idle" | "loading" | "success";

type Props = {
  cognitoUser: CognitoUser;
};

export function ChangePasswordPage({ cognitoUser }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const auth = useAuth();

  const [changePasswordFailure, setChangePasswordFailure] = useState<
    string | null
  >(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordChangeInputs>();

  const onSubmit: SubmitHandler<PasswordChangeInputs> = async ({
    password,
    confirmPassword,
  }) => {
    setStatus("loading");
    setChangePasswordFailure(null);
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match!");
      }
      await Auth.completeNewPassword(cognitoUser, confirmPassword);
      setStatus("success");
      auth.onCompleteNewPassword();
    } catch (error: unknown) {
      console.error(error);
      setStatus("idle");
      if (error instanceof Error) {
        setChangePasswordFailure(error.message);
      } else {
        setChangePasswordFailure(
          "Password change failed. Please contact support@tutored.live"
        );
      }
    }
  };

  return (
    <UnauthCenterLayout>
      <HeaderAndLogo text="Change your password" />

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
                {errors.password?.message && (
                  <FieldError msg={errors.password?.message} />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <div className="mt-1">
                <input
                  {...register("confirmPassword", {
                    required: {
                      value: true,
                      message: "Password is required.",
                    },
                  })}
                  type="password"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                />
                {errors.password?.message && (
                  <FieldError msg={errors.password?.message} />
                )}
              </div>
            </div>

            {changePasswordFailure && <ErrorBox msg={changePasswordFailure} />}

            <div>
              <ButtonAndIcon
                Icon={ChangePasswordIcon}
                status={status}
                text="Update Password"
              />
            </div>
          </form>
        </div>
      </div>
    </UnauthCenterLayout>
  );
}

function ChangePasswordIcon({ status }: { status: Status }) {
  switch (status) {
    case "idle":
      return <ShieldCheckIcon className="h-5" aria-hidden="true" />;

    case "success":
      return <CheckIcon className="h-5" aria-hidden="true" />;

    case "loading":
      return <Spinner />;

    default:
      return assertUnreachable(status, "Status");
  }
}
