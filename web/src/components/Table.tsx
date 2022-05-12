import clsx from "clsx";
import { useTable, Column, TableState, Row } from "react-table";

type Props<D extends Record<string, unknown>> = {
  columns: Column<D>[];
  data: D[];
  hiddenColumns?: TableState["hiddenColumns"];
  onRowClick?: (row: Row<D>) => void;
  selectedId?: string | null;
  border?: boolean;
};

export function Table<D extends { id: string }>({
  columns,
  data,
  hiddenColumns,
  onRowClick,
  selectedId,
  border = true,
}: Props<D>) {
  const initialState = { hiddenColumns };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      ...(hiddenColumns ? { initialState } : {}),
    });

  return (
    <div
      className={clsx(
        border &&
          "border-b border-gray-200 shadow overflow-hidden sm:rounded-lg"
      )}
    >
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
                    className="px-6 py-3 text-left text-gray-500 text-xs font-medium tracking-wider uppercase"
                    {...column.getHeaderProps()} //key is in here.
                  >
                    {column.render("Header")}
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
          {rows.map((row) => {
            prepareRow(row);
            const isRowSelected = row.original.id === selectedId;
            const onClick = onRowClick
              ? { onClick: () => onRowClick(row) }
              : {};
            return (
              // eslint-disable-next-line react/jsx-key
              <tr
                {...row.getRowProps()}
                className={clsx(
                  isRowSelected ? "bg-blue-100" : "hover:bg-gray-50"
                )}
                {...onClick}
              >
                {row.cells.map((cell) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 text-gray-500 text-sm"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
