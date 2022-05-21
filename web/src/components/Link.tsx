import { ReactNode } from "react";
import NextLink from "next/link";

type Props = {
  href: string;
  children: ReactNode;
};

export function Link({ href, children }: Props) {
  return (
    <NextLink href={href}>
      <a className="font-medium text-gray-900 hover:underline hover:underline-offset-2">
        {children}
      </a>
    </NextLink>
  );
}
