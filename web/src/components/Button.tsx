import clsx from "clsx";
import React from "react";
import { assertUnreachable } from "utils/types";
import Link from "next/link";

export type ThemeT =
  | "primary"
  | "secondary"
  | "tertiary"
  | "success"
  | "danger";

interface Props {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  theme?: ThemeT;
}

function ButtonFowardRef(props: Props, ref: React.Ref<HTMLButtonElement>) {
  const {
    type = "button",
    onClick,
    disabled = false,
    children,
    className,
    theme = "primary",
  } = props;

  const commonStyles = getCommonStyles(theme);

  return (
    <button
      type={type}
      onClick={onClick}
      className={clsx(
        ...commonStyles,
        disabled ? `opacity-50 cursor-not-allowed` : "",
        className ? className : ""
      )}
      disabled={disabled}
      ref={ref}
    >
      {children}
    </button>
  );
}

ButtonFowardRef.displayName = "Button";

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  ButtonFowardRef
);

interface ButtonLinkProps {
  children: React.ReactNode;
  href: string;
  disabled?: boolean;
  className?: string;
  theme?: ThemeT;
}

export function ButtonLink({
  href,
  children,
  className,
  theme = "primary",
}: ButtonLinkProps) {
  const commonStyles = getCommonStyles(theme);

  return (
    <Link href={href}>
      <a className={clsx(...commonStyles, className ? className : "")}>
        {children}
      </a>
    </Link>
  );
}

function getColors(theme: ThemeT) {
  switch (theme) {
    case "primary":
      return {
        colors: "bg-blue-500 hover:bg-blue-600",
        focus: "focus:ring-blue-500",
        border: "border border-transparent",
        text: "text-white text-sm font-medium",
      };
    case "secondary":
      return {
        colors: "bg-blue-100 hover:bg-blue-200",
        focus: "focus:ring-blue-500",
        border: "border border-transparent",
        text: "text-blue-700 text-sm font-medium",
      };

    case "tertiary":
      return {
        colors: "bg-white hover:bg-gray-50",
        focus: "focus:ring-blue-500",
        border: "border border-gray-300",
        text: "text-gray-700 text-base font-medium sm:text-sm",
      };

    case "success":
      return {
        colors: "bg-green-500 hover:bg-green-600",
        focus: "focus:ring-green-500",
        border: "border border-transparent",
        text: "text-white text-sm font-medium",
      };

    case "danger":
      return {
        colors: "bg-red-500 hover:bg-red-600",
        focus: "focus:ring-red-500",
        border: "border border-transparent",
        text: "text-white text-sm font-medium",
      };

    default:
      return assertUnreachable(theme, "ThemeT");
  }
}

function getCommonStyles(theme: ThemeT) {
  const { colors, focus, border, text } = getColors(theme);
  return [
    "inline-flex justify-center px-4 py-2",
    `${colors}`,
    `${border} rounded-md focus:outline-none shadow-sm focus:ring-2 ${focus} focus:ring-offset-2`,
    `${text}`,
  ];
}
