import { useDataGrid } from "..";
const DataGridTableEmpty = () => {
  const { table, props } = useDataGrid();
  // Берём именно количество видимых "листовых" колонок,
  // а не все колонки (включая группы)
  const leafCount = table.getVisibleFlatColumns().length;
  const totalColumns = leafCount + (props.rowSelect ? 1 : 0);
  return (
    <tr>
      <td colSpan={totalColumns} className="text-center py-4 text-sm">
        {props.messages?.empty || "No data available"}
      </td>
    </tr>
  );
};
export { DataGridTableEmpty };
