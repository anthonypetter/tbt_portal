import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import Link from "next/link";

export type Breadcrumb = {
  name: string;
  href: string;
  current?: boolean;
  icon?: (props: React.ComponentProps<"svg">) => JSX.Element;
};

type Props = {
  path: Breadcrumb[];
};

export function Breadcrumbs({ path }: Props) {
  if (path.length === 0) {
    return null;
  }

  const back = path[path.length === 1 ? path.length - 1 : path.length - 2];

  return (
    <div className="ml-4 sm:ml-0 mb-8">
      <div>
        {back && (
          // Only shown on small screens
          <nav className="sm:hidden" aria-label="Back">
            {back.current ? null : (
              <Link href={back.href}>
                <a className="flex items-center text-gray-500 hover:text-gray-700 text-sm font-medium">
                  <ChevronLeftIcon
                    className="flex-shrink-0 -ml-1 mr-1 w-5 h-5 text-gray-400"
                    aria-hidden="true"
                  />
                  Back
                </a>
              </Link>
            )}
          </nav>
        )}
        {/* For larger screens */}
        <nav className="hidden -ml-4 sm:flex" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space-x-4">
            {path.map((breadcrumb, index) => {
              const icon = breadcrumb.icon ? (
                <breadcrumb.icon
                  className="flex-shrink-0 h-5 w-5"
                  aria-hidden="true"
                />
              ) : null;

              const link = breadcrumb.current ? (
                <p className="ml-4 text-gray-500 text-sm font-medium">
                  {icon ?? breadcrumb.name}
                </p>
              ) : (
                <Link href={breadcrumb.href}>
                  <a className="ml-4 text-gray-500 hover:text-gray-700 text-sm font-medium">
                    {icon ?? breadcrumb.name}
                  </a>
                </Link>
              );

              if (index === 0) {
                return (
                  <li key={breadcrumb.name}>
                    <div className="flex">{link}</div>
                  </li>
                );
              }

              return (
                <li key={breadcrumb.name}>
                  <div className="flex items-center">
                    <ChevronRightIcon
                      className="flex-shrink-0 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    {link}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </div>
  );
}
