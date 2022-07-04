import clsx from "clsx";
import { ReactNode } from "react";

export function Details({
  children,
  className,
}: {
  children: ReactNode;

  className?: string;
}) {
  return (
    <div className={clsx("p-4 sm:p-0", className)}>
      <dl>{children}</dl>
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
    <div className={clsx("py-4 sm:grid sm:grid-cols-3 sm:gap-4", className)}>
      {children}
    </div>
  );
}

function DescriptionTerm({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <dt
      className={clsx(
        typeof children === "string" && "text-sm font-medium text-gray-500",
        className
      )}
    >
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
