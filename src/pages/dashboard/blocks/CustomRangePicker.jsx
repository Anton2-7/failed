import { useState, useEffect } from "react";
import { format, addMonths } from "date-fns";
import { ru } from "date-fns/locale";
import { CalendarDays } from "lucide-react";
import { Calendar, TimePicker } from "./Calendar";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";

export function CustomDateRangePicker({
  date,
  setDate,
  tempDateRange,
  setTempDateRange,
  fromTime,
  setFromTime,
  toTime,
  setToTime,
  isOpen,
  setIsOpen,
  defaultStartDate,
  handleDateRangeApply,
  handleDateRangeReset,
  labelText = "Диапазон",
  iconOnly = false,
  customTrigger,
}) {
  return (
    <div className="relative w-full">
      {!iconOnly && (
        <label
          className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900 before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
          style={{ color: "#99A1B7", fontSize: "11px", zIndex: 49 }}
        >
          {labelText}
        </label>
      )}

      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);

          // 👇 Синхронизация tempDateRange с date
          if (open && date?.from && date?.to) {
            setTempDateRange({
              from: date.from,
              to: date.to,
            });
          }
        }}
      >
        <PopoverTrigger asChild>
          {iconOnly && customTrigger ? (
            customTrigger
          ) : iconOnly ? (
            <button
              onClick={() => setIsOpen(true)}
              className="p-2 rounded-md hover:bg-accent"
            >
              <CalendarDays size={18} className="text-muted-foreground" />
            </button>
          ) : (
            <div
              className="flex justify-between gap-2 input items-center cursor-pointer"
              onClick={() => setIsOpen(true)}
            >
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd.MM.yy", { locale: ru })}, {fromTime}{" "}
                    — {format(date.to, "dd.MM.yy", { locale: ru })}, {toTime}
                  </>
                ) : (
                  format(date.from, "dd.MM.yy", { locale: ru })
                )
              ) : (
                <span></span>
              )}
              <CalendarDays size={16} className="me-0.5" />
            </div>
          )}
        </PopoverTrigger>

        <PopoverContent
          className="w-auto p-4 bg-white border border-border rounded-md shadow-md z-[9999]"
          side="bottom"
          align="start"
        >
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={tempDateRange}
            onSelect={setTempDateRange}
            defaultMonth={
              tempDateRange?.from instanceof Date
                ? tempDateRange.from
                : tempDateRange?.from?.toDate?.() || new Date()
            }
            toMonth={addMonths(tempDateRange?.from || new Date(), 1)}
          />
          <div className="flex justify-between py-4">
            <TimePicker label="Часы" value={fromTime} onChange={setFromTime} />
            <TimePicker label="Часы" value={toTime} onChange={setToTime} />
          </div>
          <div className="flex items-center justify-end gap-4 border-t border-border pt-4">
            <div className="text-xs">
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd.MM.yy", { locale: ru })}, {fromTime}{" "}
                    — {format(date.to, "dd.MM.yy", { locale: ru })}, {toTime}
                  </>
                ) : (
                  format(date.from, "dd.MM.yy", { locale: ru })
                )
              ) : (
                <span>Выберите диапазон</span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                className="btn btn-outline btn-primary btn-sm"
                variant="outline"
                onClick={handleDateRangeReset}
              >
                Отменить
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => {
                  handleDateRangeApply();
                  setIsOpen(false); // <== продублируй здесь для проверки
                }}
              >
                Применить
              </button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
