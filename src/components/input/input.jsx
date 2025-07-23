import { useEffect, useState } from "react";
import { useContext } from "react";
import { FilterContext } from "../../providers/FilterProvider";

const Input = ({
  keyValue,
  text,
  sz,
  value,
  typeInput,
  onChange,
  disabled,
  placeholder,
  isInvalid,
}) => {
  const { addFilter } = useContext(FilterContext);
  const [internalValue, setInternalValue] = useState(null);

  useEffect(() => {
    setInternalValue(() => value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue((prev) => (prev = newValue));
    if (keyValue === "max_balance" || keyValue === "min_balance") {
      const valueToSend = newValue === "" ? 0 : Number(newValue);
      addFilter(keyValue, valueToSend);
      onChange?.(valueToSend);
    } else {
      addFilter(keyValue, newValue);
      onChange?.(newValue);
    }
  };

  return (
    <div className={`relative`}>
      <label
        style={{
          background: `linear-gradient(to top, var(--tw-light-active) 50%, white 50%)`,
          color: "#99A1B7",
          fontSize: "11px",
          display: "inline",
          marginBottom: "0px",
        }}
        className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900"
      >
        {text}
      </label>
      <input
        className={`input !border ${isInvalid ? "!border-red-500" : ""} ${!isInvalid && "!border-gray-300"} !rounded-md ${disabled && "pointer-events-none opacity-50"}`}
        placeholder={placeholder || ""}
        type={typeInput || "text"}
        value={internalValue}
        // disabled={disabled}
        onChange={handleChange}
      />
    </div>
  );
};

export { Input };
