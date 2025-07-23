import React from "react";
import clsx from "clsx";
import { useDataGrid } from "..";

const DataGridTableBodyCell = ({
  id,
  children,
  className,
  isGroupDivider,
  isLastGroupDivider,
  columnIndex,
}) => {
  const { props, table } = useDataGrid();

  const isGrouped =
    props.groupedHeaders === true &&
    props.variant === "grouped" &&
    isGroupDivider;

  const isDefault =
    props.groupedHeaders === false &&
    props.variant === "default" &&
    !isGroupDivider;

  const isFirstRow = table.getRowModel().rows[0]?.id === id.split("_")[0];
  const isFirstCol = columnIndex === 0;

  return (
    <td
      key={id}
      className={clsx(
        "text-sm px-2 py-2",
        "relative", // обязательно!
        isDefault && "border border-[#E0E0E0]",
        isDefault && isFirstRow && isFirstCol && "!border-l-0 !border-t-0",
        isGrouped &&
          // "border-l-[#F1F1F4] border-r-[#C4CADA] border-t-[#F1F1F4] border-b-[#F1F1F4] border border-solid text-center",
          "text-center",
        columnIndex === 0 &&
          props.variant === "grouped" &&
          "sticky ml-[200px] left-[-1px] z-[70] bg-white",
        isLastGroupDivider && "overflow-hidden pr-[1px]",
        className
      )}
    >
      {props.type === "statistics" ? (
        <div className="w-full flex justify-center items-center ">
          {children}
        </div>
      ) : (
        children
      )}
      {isGrouped && !isLastGroupDivider && (
        <div
          className="absolute top-0 right-0 w-px bg-[#C4CADA] z-[60]"
          style={{ height: "103%" }} // или заменить на что-то фиксированное, типа `calc(100% + 1px)`
        />
      )}
    </td>
  );
};

export { DataGridTableBodyCell };
