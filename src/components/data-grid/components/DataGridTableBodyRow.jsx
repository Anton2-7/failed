import React from "react";
import { DataGridTableBodyRowSelect, useDataGrid } from "..";
const DataGridTableBodyRow = ({ id, children, className }) => {
  const { props } = useDataGrid();
  return (
    <tr className={className && className}>
      {/* {props.rowSelect && <DataGridTableBodyRowSelect id={id} />} */}
      {children}
    </tr>
  );
};
export { DataGridTableBodyRow };
