import clsx from "clsx";
import React from "react";
import { DataGridTableHeadRowsSelect, useDataGrid } from "..";
const DataGridTableHead = ({ children, className }) => {
  const { props } = useDataGrid();
  return (
    <thead className={clsx(className && className)}>
      {/* {props.rowSelect && <DataGridTableHeadRowsSelect />} */}
      {children}
    </thead>
  );
};
export { DataGridTableHead };
