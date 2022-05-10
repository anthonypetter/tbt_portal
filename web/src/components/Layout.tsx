import clsx from "clsx";
import React from "react";
import { config, Env } from "../config";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={clsx(
        "bg-gray-100 min-h-screen",
        config.env === Env.DEV && "debug-screens"
      )}
    >
      {children}
    </div>
  );
}
