
export function SaveButton({onSave}) {
  return (
    <div className="px-3 pb-3 pt-2">
      <button onClick={onSave} className="w-full h-10 bg-primary text-white font-medium rounded-[8px] cursor-pointer">
        Сохранить
      </button>
    </div>
  )
}
