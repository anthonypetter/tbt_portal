import { useTable, Column, TableState } from "react-table";

type Props<D extends Record<string, unknown>> = {
  columns: Column<D>[];
  data: D[];
  hiddenColumns?: TableState["hiddenColumns"];
};

export function Table<D extends Record<string, unknown>>({
  columns,
  data,
  hiddenColumns,
}: Props<D>) {
  const initialState = { hiddenColumns };

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
      ...(hiddenColumns ? { initialState } : {}),
    });

  return (
    <div className="border-b border-gray-200 shadow overflow-hidden sm:rounded-lg">
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
            return (
              // eslint-disable-next-line react/jsx-key
              <tr {...row.getRowProps()}>
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
