import { useEffect, useState } from "react";
import { useContext } from "react";
import { FilterContext } from "../../providers/FilterProvider";

import hidePassword from "../../assets/icons/passwordIcons/hidden.svg";
import showPassword from "../../assets/icons/passwordIcons/show.svg";
const ModalInputPassword = ({
  text,
  sz,
  customStyle,
  value,
  typeInput,
  onChange,
  isInvalid,
}) => {
  const { addFilter } = useContext(FilterContext);
  const [internalValue, setInternalValue] = useState(null);
  const [isShowPassword, setIsShowPassword] = useState(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue((prev) => (prev = newValue));
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <div className="relative">
        <label
          style={{
            // top: "11px",
            // left: "10px",
            color: "#99A1B7",
            background: "#fcfcfc",
            fontSize: "11px",
            display: "inline",
            marginBottom: "0px",
          }}
          className="absolute top-[-10px] px-1 left-2 z-10 text-sm font-medium text-gray-900 "
        >
          {text}
        </label>
        <div className="relative">
          <input
            className={`input ${isInvalid ? "border-red-500" : ""} ${!isInvalid && "border-gray-300"}`}
            placeholder=""
            type={isShowPassword ? "text" : "password"}
            value={internalValue}
            onChange={handleChange}
            autoComplete="new-password"
          />
          <button
            className="absolute top-2 right-3"
            onClick={() => setIsShowPassword(!isShowPassword)}
            style={{
              transform: "translateY(20%)",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            {isShowPassword ? (
              <img src={showPassword} alt="" />
            ) : (
              <img src={hidePassword} alt="" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export { ModalInputPassword };
