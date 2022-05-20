import React from "react";
import { XCircleIcon } from "@heroicons/react/solid";
import clsx from "clsx";

type Props = {
  msg?: string;
  subMsg?: string;
  className?: string;
};

export function ErrorBox({ msg, subMsg, className }: Props) {
  const message = msg ?? "Looks like something went wrong.";

  return (
    <div
      className={clsx(
        "mb-4 p-4 bg-red-50 border border-red-400 rounded-md",
        className
      )}
    >
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="w-5 h-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-red-800 text-sm font-medium">{message}</h3>
          {subMsg && <h3 className="mt-2 text-red-700 text-sm">{subMsg}</h3>}
        </div>
      </div>
    </div>
  );
}
