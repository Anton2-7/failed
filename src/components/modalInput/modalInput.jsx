import { useEffect, useState, useContext } from "react";
import { FilterContext } from "../../providers/FilterProvider";

const ModalInput = ({
  text,
  sz,
  customStyle,
  value,
  typeInput,
  onChange,
  isInvalid,
}) => {
  const { addFilter } = useContext(FilterContext);
  const [internalValue, setInternalValue] = useState(value ?? "");

  useEffect(() => {
    setInternalValue(value ?? "");
  }, [value]);

  const handleChange = (e) => {
    let newValue = e.target.value;

    // Если тип числовой — проверяем значение, убираем минус
    if (typeInput === "number") {
      // Можно не допускать отрицательные числа
      if (newValue === "") {
        setInternalValue("");
        onChange("");
        return;
      }

      // Преобразуем в число
      const numericValue = Number(newValue);

      // Если NaN или < 0 — игнорируем обновление (можно сбросить на 0 или не менять)
      if (isNaN(numericValue) || numericValue < 0) {
        return; // ничего не делаем, не обновляем
      }

      newValue = numericValue; // уже число >= 0
    }

    setInternalValue(newValue);
    onChange(newValue);
  };

  return (
    <div className="w-full relative w-[100%]">
      <style>{`
        input[type=number]::-webkit-inner-spin-button,
        input[type=number]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
      `}</style>
      <label
        style={{
          background: "#fcfcfc",
          color: "#99A1B7",
          fontSize: "11px",
          width: "fit-content",
        }}
        className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900"
      >
        {text}
      </label>
      <input
        className={`input border ${isInvalid ? "border-red-500" : ""} ${!isInvalid && "border-gray-300"}`}
        placeholder=""
        type={typeInput || "text"}
        value={internalValue}
        onChange={handleChange}
        autoComplete="new-password"
        min={typeInput === "number" ? 0 : undefined} // Для числа можно добавить min=0
      />
    </div>
  );
};

export { ModalInput };
