export const InputField = ({
  text,
  height = 48,
  value,
  onChange,
  disabled,
  required,
  isInvalid, // Проп для подсветки ошибки
}) => {
  return (
    <div className="relative">
      <label
        style={{
          color: "#99A1B7",
          fontSize: "11px",
          marginBottom: "0px",
        }}
        className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900
             before:content-[''] before:absolute before:top-1/2 before:left-0
             before:w-full before:h-1/2 before:bg-[#FCFCFC] before:z-[-1]"
      >
        {text}
      </label>

      <input
        className={`input ${isInvalid ? "border-red-500" : ""} ${!isInvalid && "border-gray-300"} ${disabled && "pointer-events-none opacity-50"}`}
        value={value}
        onChange={onChange}
        required={required}
        // disabled={disabled}
      />
    </div>
  );
};
