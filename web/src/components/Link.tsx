import clsx from "clsx";
import NextLink from "next/link";
import { ReactNode } from "react";

type Props = {
  href: string;
  children: ReactNode;
  className?: string;
};

export function Link({ href, children, className }: Props) {
  return (
    <NextLink href={href}>
      <a
        className={clsx(
          "font-medium text-blue-500 hover:underline hover:underline-offset-2",
          className
        )}
      >
        {children}
      </a>
    </NextLink>
  );
}
