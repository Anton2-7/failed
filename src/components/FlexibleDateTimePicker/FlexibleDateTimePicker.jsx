// components/FlexibleDateTimePicker.jsx
import React, { useState, useRef, useEffect } from "react";
import { DateRange, Calendar } from "react-date-range";
import dayjs from "../../pages/dashboard/dayjsConfig";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export const FlexibleDateTimePicker = ({
  mode = "range", // 'range' | 'single'
  withTime = false,
  value,
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const initialStart = value?.[0]?.toDate?.() || new Date();
  const initialEnd = value?.[1]?.toDate?.() || new Date();

  const [range, setRange] = useState([
    {
      startDate: initialStart,
      endDate: initialEnd,
      key: "selection",
    },
  ]);
  const [singleDate, setSingleDate] = useState(initialStart);
  const [startTime, setStartTime] = useState("00:00");
  const [endTime, setEndTime] = useState("23:59");

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const apply = () => {
    if (mode === "range") {
      const start = dayjs(range[0].startDate)
        .hour(+startTime.split(":")[0])
        .minute(+startTime.split(":")[1]);
      const end = dayjs(range[0].endDate)
        .hour(+endTime.split(":")[0])
        .minute(+endTime.split(":")[1]);
      onChange?.([start, end]);
    } else {
      const date = dayjs(singleDate)
        .hour(+startTime.split(":")[0])
        .minute(+startTime.split(":")[1]);
      onChange?.([date]);
    }
    setOpen(false);
  };

  const formattedValue = () => {
    if (mode === "range") {
      return `${dayjs(range[0].startDate).format("DD.MM.YYYY")}${withTime ? ` ${startTime}` : ""} - ${dayjs(range[0].endDate).format("DD.MM.YYYY")}${withTime ? ` ${endTime}` : ""}`;
    } else {
      return `${dayjs(singleDate).format("DD.MM.YYYY")}${withTime ? ` ${startTime}` : ""}`;
    }
  };

  return (
    <div className="relative w-full">
      <input
        readOnly
        value={formattedValue()}
        onClick={() => setOpen(!open)}
        className={`${mode === "range" ? "text-center" : ""} input w-full px-2 py-2 border border-gray-300 rounded-md cursor-pointer`}
      />
      {open && (
        <div
          style={{ zIndex: 71 }}
          ref={ref}
          className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-30 z-50"
        >
          <div className="bg-white rounded-md shadow-lg p-4 w-[90%] max-w-md">
            {mode === "range" ? (
              <DateRange
                editableDateInputs
                onChange={(item) => setRange([item.selection])}
                moveRangeOnFirstSelection={false}
                ranges={range}
                showDateDisplay={false}
              />
            ) : (
              <Calendar
                date={singleDate}
                onChange={setSingleDate}
                showDateDisplay={false}
              />
            )}

            {withTime && (
              <div className="mt-2 flex flex-col gap-2">
                <label className="text-sm text-gray-600">
                  Время {mode === "range" ? "начала" : ""}
                </label>
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="border rounded p-1"
                />
                {mode === "range" && (
                  <>
                    <label className="text-sm text-gray-600">
                      Время окончания
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="border rounded p-1"
                    />
                  </>
                )}
              </div>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={apply}
                className="bg-blue-600 text-white rounded px-4 py-2"
              >
                Применить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
