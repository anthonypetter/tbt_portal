import clsx from "clsx";
import { ReactNode } from "react";
import { Breadcrumbs, type Breadcrumb } from "./Breadcrumbs";

type Props = {
  title: string;
  breadcrumbs?: Breadcrumb[];
  children?: ReactNode;
};

export function PageHeader({ title, breadcrumbs, children }: Props) {
  return (
    <>
      {breadcrumbs && <Breadcrumbs path={breadcrumbs} />}
      <div className={clsx("flex flex-col")}>
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-2">
            {title}
          </h1>
        </div>

        <div>{children}</div>
      </div>
    </>
  );
}

function DescriptionText({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx("text-sm font-medium text-gray-500", className)}>
      {children}
    </div>
  );
}

PageHeader.DescriptionText = DescriptionText;
