import React from "react";
import { flexRender } from "@tanstack/react-table";
import clsx from "clsx";
import { useDataGrid } from "../core";

const DataGridTableHeadCell = ({
  header,
  isGroupDivider,
  isLastGroupDivider,
  columnIndex,
}) => {
  const { props, table } = useDataGrid();

  const isGroupHeader = header.colSpan > 1;
  const isGrouped =
    props.groupedHeaders === true &&
    props.variant === "grouped" &&
    isGroupDivider;

  const isDefault =
    props.groupedHeaders === false &&
    props.variant === "default" &&
    !isGroupDivider;

  const isFirstRow = table.getHeaderGroups()[0]?.id === header.headerGroup.id;
  const isFirstCol = columnIndex === 0;

  return (
    <th
      colSpan={header.colSpan}
      className={clsx(
        "text-sm px-2 py-2 relative",
        isDefault && "border border-[#E0E0E0]",
        isDefault && isFirstRow && isFirstCol && "!border-l-0 !border-t-0",
        props.type === "statistics" && "text-center",
        isGrouped &&
          // "border-l-[#F1F1F4] border-r-[#C4CADA] border-t-[#F1F1F4] border-b-[#F1F1F4] border border-solid",
          "text-center",

        !isLastGroupDivider && "!rounded-tl-none",

        columnIndex === 0 &&
          props.variant === "grouped" &&
          "sticky ml-[106px] left-[-1px] z-[70] bg-white",
        isGroupHeader
          ? "!font-bold !text-[#252F4A] !text-base"
          : "!text-sm !font-medium text-[#4B5675]",
        // !isLastGroupDivider && "border-r border-[#E0E0E0]",
        // isLastGroupDivider && "!border-b-2"
        // внутри className
        !isLastGroupDivider
          ? "border-r border-[#E0E0E0]"
          : "!border-r-0 border-b-2"
      )}
    >
      {header.column.columnDef.enableSorting ? (
        <div
          className={clsx(
            header.column.getCanSort() ? "cursor-pointer select-none" : ""
          )}
          onClick={header.column.getToggleSortingHandler()}
        >
          <span
            className={clsx("sort", {
              [`${header.column.getIsSorted()}`]: header.column.getIsSorted(),
            })}
          >
            <span className="sort-label">
              {flexRender(header.column.columnDef.header, header.getContext())}
            </span>
            <span className="sort-icon"></span>
          </span>
        </div>
      ) : (
        <span>
          {flexRender(header.column.columnDef.header, header.getContext())}
        </span>
      )}
      {/* рисуем чёрную псевдо-линию между группами */}
      {isGrouped && !isLastGroupDivider && (
        <div
          className="absolute top-0 right-0 w-px bg-[#C4CADA] z-[60]"
          style={{ height: "103%" }} // или заменить на что-то фиксированное, типа `calc(100% + 1px)`
        />
      )}
    </th>
  );
};

export { DataGridTableHeadCell };
