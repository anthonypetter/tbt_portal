import clsx from "clsx";
import { ReactNode } from "react";

export function Details({ children }: { children: ReactNode }) {
  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
      <dl className="sm:divide-y sm:divide-gray-200">{children}</dl>
    </div>
  );
}

function DetailLine({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={clsx(
        "py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4",
        className
      )}
    >
      {children}
    </div>
  );
}

function DescriptionTerm({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <dt className={clsx("text-sm font-medium text-gray-500", className)}>
      {children}
    </dt>
  );
}

function DescriptionDetail({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <dd
      className={clsx(
        "mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2",
        className
      )}
    >
      {children}
    </dd>
  );
}

Details.Line = DetailLine;
Details.Term = DescriptionTerm;
Details.Detail = DescriptionDetail;
