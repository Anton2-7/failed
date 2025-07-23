import React from "react";

export const Textarea = ({ text, height = 48, value, onChange, isInvalid }) => {
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
      <textarea
        style={{ height: `${height}px` }}
        className={`textarea ${isInvalid ? "border-red-500" : ""} ${!isInvalid && "border-gray-300"} rounded-md resize-none w-full`}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
