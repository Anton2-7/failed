import React, { useContext, useEffect } from "react";
import { FilterContext } from "../../providers/FilterProvider";

const Selector = ({ keyValue, objectKey, text, option, sz, onChange }) => {
  const { addFilter } = useContext(FilterContext);
  useEffect(() => {
    addFilter(objectKey, null);
  }, []);

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
        className="select"
        name="select"
        defaultValue={keyValue[0]}
        onChange={(e) => onChange(e.target.value)}
      >
        {option.map((item, index) => (
          <option key={index} value={keyValue[index]}>
            {typeof item === "object" ? item.name : item}
          </option>
        ))}
      </select>
    </div>
  );
};
export { Selector };
