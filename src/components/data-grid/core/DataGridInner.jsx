import { Fragment } from "react";
import {
  useDataGrid,
  DataGridLoader,
  DataGridTable,
  DataGridTableBody,
  DataGridTableBodyCell,
  DataGridTableBodyRow,
  DataGridTableHead,
  DataGridTableHeadCell,
  DataGridTableEmpty,
  DataGridToolbar,
} from ".."; // Ensure these imports are correct
import { flexRender } from "@tanstack/react-table"; // Import Row and Cell types

const DataGridInner = () => {
  const { loading, table } = useDataGrid();

  return (
    <Fragment>
      <div className="grid min-w-full">
        <div className="scrollable-x-auto overflow-y-hidden">
          <DataGridTable>
            <DataGridTableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, i, arr) => {
                    const isLastInGroup =
                      i === arr.length - 1 || // последняя колонка
                      (i < arr.length - 1 &&
                        header.column.parent?.id !==
                          arr[i + 1].column.parent?.id) || // вложенные
                      (i < arr.length - 1 &&
                        header.column.parent?.id === undefined &&
                        arr[i].column.id !== arr[i + 1].column.parent?.id); // верхний уровень

                    // получить список всех parent.id, исключив undefined, и взять последний уникальный
                    const lastGroupId = [...arr]
                      .reverse()
                      .find((h) => h.column.parent?.id)?.column.parent?.id;

                    const isLastGroup = !arr
                      .slice(i + 1)
                      .some(
                        (h) => h.column.parent?.id === header.column.parent?.id
                      );

                    const isLastColumn = i === arr.length - 1;

                    return (
                      <DataGridTableHeadCell
                        key={header.id}
                        header={header}
                        isGroupDivider={isLastInGroup}
                        isLastGroupDivider={isLastColumn}
                        columnIndex={i}
                      />
                    );
                  })}
                </tr>
              ))}
            </DataGridTableHead>

            <DataGridTableBody>
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row, rowIndex) => (
                  <DataGridTableBodyRow key={rowIndex} id={row.id}>
                    {row.getVisibleCells().map((cell, i, arr, cellIndex) => {
                      const isLastGroup =
                        cell.column.parent?.id ===
                        arr[arr.length - 1]?.column.parent?.id;

                      const isLastInGroup =
                        i === arr.length - 1 || // последняя колонка вообще
                        (i < arr.length - 1 &&
                          cell.column.parent?.id !==
                            arr[i + 1].column.parent?.id);

                      return (
                        <DataGridTableBodyCell
                          key={cell.id}
                          id={cell.id}
                          isGroupDivider={isLastInGroup}
                          isLastGroupDivider={isLastGroup}
                          columnIndex={i}
                          className={
                            typeof cell.column.columnDef.meta?.cellClassName ===
                            "function"
                              ? cell.column.columnDef.meta.cellClassName(
                                  cell.row.original
                                )
                              : cell.column.columnDef.meta?.cellClassName || ""
                          }
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </DataGridTableBodyCell>
                      );
                    })}
                  </DataGridTableBodyRow>
                ))
              ) : (
                <DataGridTableEmpty />
              )}
            </DataGridTableBody>
          </DataGridTable>
          {loading && <DataGridLoader />} {/* Show loader if loading */}
        </div>
        <DataGridToolbar />
      </div>
    </Fragment>
  );
};
export { DataGridInner };
