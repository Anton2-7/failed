import React from 'react';
import { useDataGrid } from '..';
const DataGridTableBodyRowSelect = ({
  id
}) => {
  const {
    selectedRowIds,
    toggleRowSelection
  } = useDataGrid();
  const isSelected = selectedRowIds.has(id);
  return <td>
      <input type="checkbox" className="checkbox checkbox-sm" checked={isSelected} onChange={() => toggleRowSelection(id)} />
    </td>;
};
export { DataGridTableBodyRowSelect };