import React, { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const pad = (n) => String(n).padStart(2, "0");

export const TimePicker = ({
  value = "00:00:00",
  onChange,
  mailingTimer = false,
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [time, setTime] = useState(() => parseTimeString(value));
  const ref = useRef(null);

  function parseTimeString(str) {
    if (typeof str !== "string") return { hours: 0, minutes: 0, seconds: 0 };

    const parts = str.split(":").map(Number);
    const h = isNaN(parts[0]) ? 0 : Math.min(23, Math.max(0, parts[0]));
    const m = isNaN(parts[1]) ? 0 : Math.min(59, Math.max(0, parts[1]));
    const s = isNaN(parts[2]) ? 0 : Math.min(59, Math.max(0, parts[2]));
    return { hours: h, minutes: m, seconds: s };
  }

  const formatTime = (t) =>
    `${pad(t.hours)}:${pad(t.minutes)}:${pad(t.seconds)}`;

  const update = (key, delta) => {
    setTime((prev) => {
      let val = prev[key] + delta;
      if (key === "hours") val = (val + 24) % 24;
      else val = (val + 60) % 60;
      const updated = { ...prev, [key]: val };
      setInputValue(formatTime(updated));
      return updated;
    });
  };

  // обновляем input при изменении времени
  useEffect(() => {
    const formatted = formatTime(time);
    setInputValue(formatted);

    if (mailingTimer) {
      onChange?.(null, formatted); // второй аргумент — строка времени
    } else {
      onChange?.(formatted); // обычный режим
    }
  }, [time]);

  // закрытие по клику вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // обработка ручного ввода
  const handleInputChange = (e) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 6); // только цифры, максимум 6
    const parts = [];

    if (val.length >= 2) {
      parts.push(val.slice(0, 2));
      if (val.length >= 4) {
        parts.push(val.slice(2, 4));
        parts.push(val.slice(4, 6));
      } else if (val.length > 2) {
        parts.push(val.slice(2));
      }
    } else {
      parts.push(val);
    }

    const formatted = parts.join(":");
    setInputValue(formatted);

    // если всё введено, обновим state
    if (formatted.length === 8) {
      const [h, m, s] = formatted.split(":").map(Number);
      if (h <= 23 && m <= 59 && s <= 59) {
        setTime({ hours: h, minutes: m, seconds: s });
      }
    }
  };

  const renderUnit = (label, key) => (
    <div className="flex flex-col items-center mx-2">
      <button
        onClick={() => update(key, 1)}
        className="text-xl font-bold px-2 py-1 hover:bg-gray-200 rounded"
      >
        <ChevronUp className="w-5 h-5 text-gray-700" />
      </button>
      <div className="text-xl w-10 text-center">{pad(time[key])}</div>
      <button
        onClick={() => update(key, -1)}
        className="text-xl font-bold px-2 py-1 hover:bg-gray-200 rounded"
      >
        <ChevronDown className="w-5 h-5 text-gray-700" />
      </button>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="relative" ref={ref}>
      {mailingTimer === false ? (
        <label
          style={{
            color: "#99A1B7",
            fontSize: "11px",
            display: "inline",
            marginBottom: "0px",
          }}
          className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
        >
          Время таймера
        </label>
      ) : (
        <></>
      )}
      {mailingTimer === false ? (
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => setShowPicker(!showPicker)}
          placeholder="00:00:00"
          maxLength={8}
          className="input !border-[#DBDFE9] !rounded-md"
        />
      ) : (
        <div
          className="text-primary flex"
          onClick={() => setShowPicker(!showPicker)}
        >
          {typeof inputValue === "string"
            ? inputValue
            : inputValue?.format?.("HH:mm:ss") || ""}
          <span className="text-[#99A1B7]">
            <ChevronDown />
          </span>
        </div>
      )}

      {showPicker && (
        <div className="absolute z-10 mt-2 bg-white border shadow-lg rounded p-4 flex">
          {renderUnit("Часы", "hours")}
          {renderUnit("Минуты", "minutes")}
          {renderUnit("Секунды", "seconds")}
        </div>
      )}
    </div>
  );
};
