import { ReactNode } from "react";
import { XIcon } from "@heroicons/react/outline";
import clsx from "clsx";

type Props = {
  title?: string;
  children?: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export function DetailsAside({ title, children, isOpen, onClose }: Props) {
  return !isOpen ? null : (
    <aside
      className={clsx(
        "hidden lg:block",
        "relative",
        "py-6 pl-6 overflow-y-auto w-72 xl:w-96",
        "bg-white border-l border-gray-200"
      )}
    >
      <div className="absolute right-2 top-3">
        <CloseButton onClick={onClose} />
      </div>
      <div className="pb-16 space-y-8">
        {title && (
          <h2 className="text-lg font-medium text-gray-900 mr-6">
            <span className="sr-only">Details for </span>
            {title}
          </h2>
        )}

        {children}
      </div>
    </aside>
  );
}

type DetailSectionProps = {
  title: string;
  children: ReactNode;
};

function DetailSection({ title, children }: DetailSectionProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900">{title}</h3>
      <dl className="mt-2 border-t border-gray-200 divide-y divide-gray-200">
        {children}
      </dl>
    </div>
  );
}
type DetailLineProps = {
  label?: string;
  value: ReactNode;
};

function DetailLine({ label, value }: DetailLineProps) {
  return (
    <div className="py-2 flex justify-between text-sm font-medium">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  );
}

type DetailTableProps = {
  title: string;
  headers?: { col1: string; col2: string };
  rows: { col1: string; col2: ReactNode }[];
};

function DetailTable({ title, headers, rows }: DetailTableProps) {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-3">{title}</h3>
      <div className="overflow-y-auto max-h-64">
        <table className="min-w-full divide-gray-200 divide-y border-t border-b border-gray-200">
          {headers && (
            <thead className="bg-gray-50">
              <th
                scope="col"
                className="px-1 py-3 text-left text-gray-500 text-xs font-medium tracking-wider uppercase"
              >
                {headers.col1}
              </th>
              <th
                scope="col"
                className="px-1 py-3 text-left text-gray-500 text-xs font-medium tracking-wider uppercase"
              >
                {headers.col2}
              </th>
            </thead>
          )}
          <tbody className="bg-white divide-gray-200 divide-y">
            {rows.map((r) => {
              return (
                <tr key={r.col1} className="hover:bg-gray-50">
                  <td className="py-2 text-gray-900 text-sm font-medium">
                    {r.col1}
                  </td>
                  <td className="py-2 text-gray-500 text-sm font-medium">
                    {r.col2}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

DetailsAside.Section = DetailSection;
DetailsAside.Line = DetailLine;
DetailsAside.Table = DetailTable;

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      onClick={onClick}
    >
      <span className="sr-only">Close panel</span>
      <XIcon className="h-6 w-6" aria-hidden="true" />
    </button>
  );
}
