import { CustomSwitch } from "./CustomSwitch";

export function ColumnToggleRow({column,checked,onToggle}) {
  return (
    <div className="flex items-center justify-between px-3 py-2">
      <span className="text-[14px]">{column.header()}</span>
      <CustomSwitch checked={checked} onChange={onToggle}/>
    </div>
  )
}
