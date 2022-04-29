import React from "react";

export function Layout({ children }: { children: React.ReactNode }) {
  return <div className="bg-gray-100 min-h-screen">{children}</div>;
}
