import React, { useEffect } from "react";

export const Select = ({
  isStatus,
  text,
  value,
  onChange,
  options = [],
  typeSelect,
}) => {
  useEffect(() => console.log("Select value:", value), [value]);

  // Получаем цвет индикатора на основе строкового значения
  const getIndicatorColor = () => {
    if (String(value) === "true" || String(value) === "active")
      return "#04B440"; // зелёный
    if (String(value) === "false" || String(value) === "inactive")
      return "#DFA000"; // жёлтый
    return null;
  };

  const indicatorColor = getIndicatorColor();

  return (
    <div className="relative">
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
        {text}
      </label>

      <select
        className={`select border border-[#DBDFE9] rounded-md w-full ${isStatus ? "pl-6" : ""}`}
        value={String(value)}
        onChange={(e) => onChange(e)}
        name="select"
      >
        {/* Добавляем опцию "не выбрано" */}
        {typeSelect === "giveawaySelect" && (
          <option value="">Не выбрано</option>
        )}
        {options.map((opt) => (
          <option key={String(opt.value)} value={String(opt.value)}>
            {opt.label}
          </option>
        ))}
      </select>

      {isStatus && (
        <span
          className="absolute top-4 left-3"
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: indicatorColor,
          }}
        />
      )}
    </div>
  );
};
