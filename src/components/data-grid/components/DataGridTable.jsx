import React from "react";
import { useDataGrid } from "..";
import clsx from "clsx";
const DataGridTable = ({ children }) => {
  const { props } = useDataGrid();
  const spacingClasses = {
    xs: "table-xs",
    sm: "table-sm",
    lg: "table-lg",
  };
  return (
    <table
      className={clsx(
        "table w-full",
        props.layout?.cellsBorder && "table-border",
        props.layout?.tableSpacing && spacingClasses[props.layout.tableSpacing]
      )}
      style={{
        // width: "100%",
        // textAlign: "center",
        borderCollapse: "separate",
        borderSpacing: 0,
      }}
    >
      {children}
    </table>
    // <table
    //   className={clsx(
    //     "table w-full",
    //     props.layout?.cellsBorder && "table-border",
    //     props.layout?.tableSpacing && spacingClasses[props.layout.tableSpacing]
    //   )}
    //   style={{
    //     borderCollapse: "separate",
    //     borderSpacing: 0,
    //   }}
    // >
  );
};
export { DataGridTable };
