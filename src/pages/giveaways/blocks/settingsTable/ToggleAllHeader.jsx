import { CustomSwitch } from "./CustomSwitch";

export function ToggleAllHeader({isAllSelected,onToggleAll}) {
  return (
    <div className="flex items-center justify-between px-3 py-3 font-semibold text-gray-900 text-[16px]">
      <span>Настройка отображения</span>
      <div className="flex items-center gap-1">
        <span className="text-[14px] text-gray-900 mr-1">Все</span>
        <CustomSwitch checked={isAllSelected} onChange={onToggleAll}/>
      </div>
    </div>
  )
}
