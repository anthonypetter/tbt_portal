import { assertUnreachable } from "@utils/types";
import clsx from "clsx";

type Props = {
  children: React.ReactNode;
  className?: string;
  padding?: PaddingOptions;
};

type PaddingOptions = "none" | "md" | "lg";

export function Container({ children, className, padding = "md" }: Props) {
  const paddingStyle = getPadding(padding);
  return (
    <div
      className={clsx(
        "mt-6 lg:mt-0",
        "bg-white shadow rounded-lg",
        paddingStyle,
        className
      )}
    >
      {children}
    </div>
  );
}

function getPadding(padding: PaddingOptions) {
  switch (padding) {
    case "none":
      return null;

    case "md":
      return "py-5 px-4 sm:px-6";

    case "lg":
      return "py-8 px-4 sm:px-10";

    default:
      assertUnreachable(padding);
  }
}
