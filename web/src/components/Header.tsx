import React from "react";

type Props = {
  children: React.ReactNode;
};

export function Header({ children }: Props) {
  return (
    <h1 className="text-2xl font-semibold text-gray-900 mb-6">{children}</h1>
  );
}
