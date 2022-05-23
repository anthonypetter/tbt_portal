import clsx from "clsx";
import { Breadcrumbs, type Breadcrumb } from "./Breadcrumbs";

type Props = {
  title: string;
  description?: string | null;
  breadcrumbs: Breadcrumb[];
};

export function PageHeader({ title, description, breadcrumbs }: Props) {
  return (
    <>
      <Breadcrumbs path={breadcrumbs} />
      <div
        className={clsx(
          "flex flex-col sm:flex-row sm:items-center sm:justify-between",
          "mb-8"
        )}
      >
        <div className="flex items-center">
          <div className="flex">
            <div>
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate mb-2">
                {title}
              </h1>

              {description && (
                <p className="text-sm font-medium text-gray-500">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
