import { useEffect } from "react";
import { assertUnreachable } from "@utils/types";
import { toast } from "react-hot-toast";

type Theme = "success" | "error";

function getStyles(theme: Theme) {
  const baseStyle = {
    border: 0,
    padding: "12px",
  };

  switch (theme) {
    case "success":
      return {
        textColor: "text-green-800",
        style: { ...baseStyle, backgroundColor: "#f0fdf4" },
      };

    case "error":
      return {
        textColor: "text-red-800",
        style: { ...baseStyle, backgroundColor: "#fef2f2" },
      };

    default:
      assertUnreachable(theme, "Toast theme");
  }
}

type Props = {
  message: string;
  sub?: string;
  textColor: string;
};

function Toast({ message, sub, textColor }: Props) {
  return (
    <div>
      <h3 className={`${textColor} text-sm font-medium`}>{message}</h3>
      {sub && <h3 className={`mt-2 ${textColor} text-sm`}>{sub}</h3>}
    </div>
  );
}

export function triggerErrorToast({
  message,
  sub,
}: {
  message: string;
  sub?: string;
}) {
  const { textColor, style } = getStyles("error");

  toast.error(
    () => <Toast message={message} sub={sub} textColor={textColor} />,
    { style }
  );
}

export function triggerSuccessToast({
  message,
  sub,
}: {
  message: string;
  sub?: string;
}) {
  const { textColor, style } = getStyles("success");

  toast.success(
    () => <Toast message={message} sub={sub} textColor={textColor} />,
    { style }
  );
}

export function useErrorToast(error?: Error) {
  useEffect(() => {
    if (error) {
      triggerErrorToast({
        message: "Looks like something went wrong.",
        sub: "We weren't able to refresh the users. We're on it.",
      });
    }
  }, [error]);
}
