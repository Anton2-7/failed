import { useState, useEffect } from "react";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Calendar, TimePicker } from "./Calendar";

export const SingleDateTimePicker = ({
  value,
  onChange,
  placeholder,
  withTime = true,
  isInvalid,
}) => {
  const [open, setOpen] = useState(false);
  const [tempDate, setTempDate] = useState(value || null);
  const [tempTime, setTempTime] = useState("12:00");

  // Синхронизируем начальное значение при открытии
  useEffect(() => {
    if (value) {
      setTempDate(value);
      if (withTime) {
        const hours = value.getHours().toString().padStart(2, "0");
        const minutes = value.getMinutes().toString().padStart(2, "0");
        setTempTime(`${hours}:${minutes}`);
      }
    }
  }, [value]);

  const handleReset = () => {
    setTempDate(null);
    setTempTime("12:00");
    onChange?.(null);
    setOpen(false);
  };

  const handleApply = () => {
    if (!tempDate) return;
    const finalDate = new Date(tempDate);
    if (withTime) {
      const [hours, minutes] = tempTime.split(":");
      finalDate.setHours(+hours);
      finalDate.setMinutes(+minutes);
    }
    onChange?.(finalDate);
    setOpen(false);
  };

  return (
    <div className="relative">
      <label
        className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
          before:content-[''] before:absolute before:top-1/2 before:left-0
          before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
        style={{ color: "#99A1B7", fontSize: "11px" }}
      >
        {placeholder || (withTime ? "Дата и время" : "Дата")}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={`flex justify-between gap-2 input items-center cursor-pointer ${isInvalid ? "border-red-500" : ""} ${!isInvalid && "border-[#DBDFE9]"}`}
            onClick={() => setOpen(!open)}
          >
            {value ? (
              <>
                {format(value, "dd.MM.yy", { locale: ru })}
                {withTime &&
                  `, ${value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`}
              </>
            ) : (
              <span>{withTime ? "" : ""}</span>
            )}
            <CalendarDays size={16} className="me-0.5" />
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-4 bg-white border border-border rounded-md shadow-md z-50 flex flex-col items-center">
          <Calendar
            mode="single"
            selected={tempDate}
            onSelect={setTempDate}
            locale={ru}
            initialFocus
            defaultMonth={tempDate || new Date()}
          />
          {withTime && (
            <div className="py-4">
              <TimePicker
                label="Время"
                value={tempTime}
                onChange={setTempTime}
              />
            </div>
          )}
          <div className="flex items-center justify-end gap-4 border-t border-border pt-4">
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-primary btn-sm w-full"
                onClick={handleReset}
              >
                Отменить
              </button>
              <button
                className="btn btn-primary btn-sm w-full"
                onClick={handleApply}
              >
                Применить
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};
