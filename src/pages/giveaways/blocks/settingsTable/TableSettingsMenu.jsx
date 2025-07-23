import { useRef } from "react";
import {
  Menu,
  MenuItem,
  MenuLink,
  MenuSub,
  KeenIcon,
} from "../../../../components";
import { ColumnToggleRow } from "./ColumnToggleRow";
import { SaveButton } from "./SaveButton";
import { ToggleAllHeader } from "./ToggleAllHeader";

export function TableSettingsMenu({
  columns,
  tempVisibleColumns,
  onToggleColumn,
  isAllSelected,
  onToggleAll,
  onSave,
  isVisibleTable,
}) {
  const menuItemRef = useRef(null);

  const handleSaveAndClose = () => {
    onSave();
    if (menuItemRef.current && menuItemRef.current.hide) {
      menuItemRef.current.hide();
    }
  };

  return (
    <Menu highlight={true} className="relative">
      <MenuItem
        ref={menuItemRef}
        toggle="dropdown"
        trigger="click"
        disabled={!isVisibleTable}
        className={`text-sm transform-opacity duration-200 ${
          !isVisibleTable
            ? "opacity-50 cursor-not-allowed"
            : "opacity-100 cursor-pointer"
        }`}
        dropdownProps={{
          placement: "bottom-start",
        }}
      >
        <MenuLink>
          <button className="btn btn-light flex items-center gap-2">
            <KeenIcon icon={"setting-2"} />
            Настройка таблицы
          </button>
        </MenuLink>
        <MenuSub className="big-white shadow-lg rounded-2xl w-[320px] min-w-[280px] px-4 py-2">
          <ToggleAllHeader
            isAllSelected={isAllSelected}
            onToggleAll={onToggleAll}
          />
          <div className="py-1 max-h-[280px]">
            {columns.map((column) => (
              <div key={column.id} className="border-t border-gray-300">
                <ColumnToggleRow
                  column={column}
                  checked={tempVisibleColumns[column.id]}
                  onToggle={() => onToggleColumn(column.id)}
                />
              </div>
            ))}
          </div>
          <SaveButton onSave={handleSaveAndClose} />
        </MenuSub>
      </MenuItem>
    </Menu>
  );
}
