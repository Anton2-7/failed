import React, { useEffect } from "react";
import { DataGridPagination, useDataGrid } from "..";
import { usePagination } from "@/providers/PaginationContext";
const DataGridToolbar = () => {
  const { table, totalRows, props } = useDataGrid();

  const { activePage, setActivePage, totalPages, totalItems } = usePagination();

  // Синхронизация состояний
  useEffect(() => {
    if (table && activePage !== undefined) {
      table.setPageIndex(activePage);
    }
  }, [activePage, table]);

  // Текущие значения пагинации
  const pageIndex = activePage || 0;
  const pageSize = table?.getState().pagination.pageSize || 10;
  const totalCount = totalItems || totalRows || 0;

  // Расчет отображаемых элементов
  const from = Math.min(pageIndex * pageSize + 1, totalCount);
  const to = Math.min((pageIndex + 1) * pageSize, totalCount);

  const paginationInfo = props.pagination?.info
    ? props.pagination.info
        .replace("{from}", from)
        .replace("{to}", to)
        .replace("{count}", totalCount)
    : `${from}-${to} из ${totalCount}`;
  return (
    <div className="card-footer justify-center md:justify-between flex-col md:flex-row gap-3 text-gray-600 text-2sm font-medium">
      <div className="relative flex items-center gap-6 w-full justify-center lg:justify-between">
        {/* {props.pagination?.sizesLabel} */}
        <div className="relative">
          <label
            style={{
              color: "#99A1B7",
              fontSize: "11px",
              display: "inline",
              marginBottom: "0px",
            }}
            className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
          >
            Отображать по
          </label>
          <select
            className="select select-sm w-[133px]"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {props.pagination?.sizes?.map((size, index) => (
              <option key={index} value={size}>
                {size}
              </option>
            ))}
          </select>{" "}
        </div>
        {/* {props.pagination?.sizesDescription} */}
        <span>{paginationInfo}</span>
      </div>
      <DataGridPagination />
    </div>
  );
};
export { DataGridToolbar };
