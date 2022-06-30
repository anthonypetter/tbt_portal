import { UserCircleIcon } from "@heroicons/react/outline";
import clsx from "clsx";
import React from "react";

type Props = {
  className?: string;
};

export function Avatar({ className }: Props) {
  return (
    <UserCircleIcon
      className={clsx("h-10 w-10 rounded-full", className)}
      aria-hidden="true"
    />
  );
}
