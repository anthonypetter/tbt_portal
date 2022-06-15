import clsx from "clsx";
import {
  useTable,
  Column,
  TableState,
  Row,
  usePagination,
  useSortBy,
} from "react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowUpIcon,
  ChevronDoubleRightIcon,
  ChevronDoubleLeftIcon,
  ArrowDownIcon,
} from "@heroicons/react/solid";
import { Button } from "./Button";
import pluralize from "pluralize";

export const CONTEXT_MENU_ID = "contextMenu";

type Props<D extends Record<string, unknown>> = {
  columns: Column<D>[];
  data: D[];
  hiddenColumns?: TableState["hiddenColumns"];
  onRowClick?: (row: Row<D>) => void;
  selectedId?: string | null;
  border?: boolean;
  className?: string;
};

export function Table<D extends { id: string }>({
  columns,
  data,
  hiddenColumns,
  onRowClick,
  selectedId,
  border = true,
  className = "min-h-[570px]",
}: Props<D>) {
  const initialState = { hiddenColumns };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,

    //Pagination
    page,
    pageCount,
    canNextPage,
    canPreviousPage,
    gotoPage,
    previousPage,
    nextPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      ...(hiddenColumns ? { initialState } : {}),
    },
    useSortBy,
    usePagination
  );

  return (
    <div
      className={clsx(
        border &&
          "border-b border-gray-200 shadow overflow-hidden sm:rounded-lg"
      )}
    >
      <div className={clsx("bg-white", className)}>
        <table
          className="min-w-full divide-gray-200 divide-y"
          {...getTableProps()}
        >
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              // eslint-disable-next-line react/jsx-key
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <th
                      scope="col"
                      className={clsx(
                        column.id === CONTEXT_MENU_ID ? "w-16" : "px-6 py-3",
                        "text-left text-gray-500 text-xs font-medium tracking-wider uppercase"
                      )}
                      {...column.getHeaderProps()} //key is in here.
                    >
                      <div className="flex">
                        <div
                          className="flex"
                          {...(column.id === CONTEXT_MENU_ID
                            ? {}
                            : column.getSortByToggleProps())}
                        >
                          {column.render("Header")}

                          {column.isSorted ? (
                            column.isSortedDesc ? (
                              <ArrowDownIcon className="ml-2 h-4 w-4" />
                            ) : (
                              <ArrowUpIcon className="ml-2 h-4 w-4" />
                            )
                          ) : (
                            <div className="ml-2 w-4" />
                          )}
                        </div>
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody
            className="bg-white divide-gray-200 divide-y"
            {...getTableBodyProps()}
          >
            {page.length === 0 ? (
              <tr>
                <td
                  className="px-6 py-4 text-gray-500 text-sm"
                  colSpan={columns.length}
                >
                  Data not found.
                </td>
              </tr>
            ) : (
              page.map((row) => {
                prepareRow(row);
                const isRowSelected = row.original.id === selectedId;
                const onClick = onRowClick
                  ? { onClick: () => onRowClick(row) }
                  : {};
                return (
                  // eslint-disable-next-line react/jsx-key
                  <tr
                    {...row.getRowProps()}
                    className={clsx([
                      isRowSelected ? "bg-blue-100" : "hover:bg-gray-50",
                      onClick ? "cursor-pointer" : "cursor-default",
                    ])}
                    {...onClick}
                  >
                    {row.cells.map((cell) => {
                      const cellToRender =
                        cell.column.id === CONTEXT_MENU_ID ? (
                          <div className="flex justify-center">
                            {cell.render("Cell")}
                          </div>
                        ) : (
                          cell.render("Cell")
                        );

                      return (
                        // eslint-disable-next-line react/jsx-key
                        <td
                          {...cell.getCellProps()}
                          className={clsx(
                            cell.column.id === CONTEXT_MENU_ID
                              ? "px-0 py-0"
                              : "px-6 py-4",
                            "text-gray-500 text-sm"
                          )}
                        >
                          {cellToRender}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <TablePagination
        pageIndex={pageIndex}
        totalResultCount={rows.length}
        pageCount={pageCount}
        gotoPage={gotoPage}
        previousPage={previousPage}
        canPreviousPage={canPreviousPage}
        nextPage={nextPage}
        canNextPage={canNextPage}
      />
    </div>
  );
}

type TablePaginationProps = {
  totalResultCount: number;
  pageIndex: number;
  pageCount: number;
  gotoPage: (updater: number | ((pageIndex: number) => number)) => void;
  previousPage: () => void;
  canPreviousPage: boolean;
  nextPage: () => void;
  canNextPage: boolean;
};

function TablePagination({
  totalResultCount,
  pageIndex,
  pageCount,
  gotoPage,
  previousPage,
  canPreviousPage,
  nextPage,
  canNextPage,
}: TablePaginationProps) {
  return (
    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          disabled={!canPreviousPage}
          onClick={() => previousPage()}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Previous
        </button>
        <button
          onClick={() => nextPage()}
          disabled={!canNextPage}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Next
        </button>
      </div>
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
            <span className="font-medium">
              {pageCount === 0 ? 1 : pageCount}
            </span>
            <span className="text-gray-500 ml-3">
              ({pluralize("result", totalResultCount, true)})
            </span>
          </p>
        </div>
        <div>
          <nav
            className="relative z-0 inline-flex rounded-md shadow-sm space-x-3"
            aria-label="Pagination"
          >
            <Button
              theme="tertiary"
              disabled={!canPreviousPage}
              onClick={() => gotoPage(0)}
            >
              <ChevronDoubleLeftIcon className="h-5 w-5" aria-hidden="true" />
            </Button>

            <Button
              theme="tertiary"
              disabled={!canPreviousPage}
              onClick={() => previousPage()}
            >
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
              Previous
            </Button>

            <Button
              theme="tertiary"
              onClick={() => nextPage()}
              disabled={!canNextPage}
            >
              Next
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
            <Button
              theme="tertiary"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
            >
              <ChevronDoubleRightIcon className="h-5 w-5" aria-hidden="true" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  );
}
