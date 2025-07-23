import clsx from "clsx";
import { KeenIcon } from "@/components";
import { useDemo1Layout } from "../Demo1LayoutProvider";
import { useMatchPath } from "@/hooks";
import { useState } from "react";
const SidebarToggle = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const { layout, setSidebarCollapse } = useDemo1Layout();
  const { match } = useMatchPath("/dark-sidebar");
  const handleClick = () => {
    if (layout.options.sidebar.collapse) {
      setSidebarCollapse(false);
    } else {
      setSidebarCollapse(true);
    }
  };
  const buttonBaseClass = clsx(
    "btn btn-icon btn-icon-md size-[30px] rounded-lg border bg-light text-gray-500 hover:text-gray-700 toggle absolute start-full top-2/4 rtl:translate-x-2/4 -translate-x-2/4 -translate-y-2/4",
    layout.options.sidebar.collapse && "active"
  );
  const iconClass = clsx(
    "transition-all duration-300",
    layout.options.sidebar.collapse ? "ltr:rotate-180" : "rtl:rotate-180"
  );
  const lightToggle = () => {
    return (
      <button
        onClick={() => {
          handleClick();
          setSidebarToggle(!sidebarToggle);
        }}
        className={clsx(
          buttonBaseClass,
          "border-[1.5px] border-[#99A1B7] !bg-[#F1F1F4] dark:border-gray-300"
        )}
        aria-label="Toggle sidebar"
      >
        {/* <KeenIcon icon="left" className={iconClass} /> */}
        {sidebarToggle ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 16 16"
            fill="none"
          >
            <path
              d="M3.66504 7.99998H12.3351"
              stroke="#99A1B7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.66504 10.6679H12.3351"
              stroke="#99A1B7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M3.66504 5.3325H12.3351"
              stroke="#99A1B7"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        ) : (
          <KeenIcon icon="left" />
        )}
      </button>
    );
  };
  const darkToggle = () => {
    return (
      <div onClick={handleClick}>
        <div className="hidden [html.dark_&]:block">
          <button className={clsx(buttonBaseClass, "border-gray-300")}>
            <KeenIcon icon="black-left-line" className={iconClass} />
          </button>
        </div>
        <div className="[html.dark_&]:hidden light">{lightToggle()}</div>
      </div>
    );
  };
  return match ? darkToggle() : lightToggle();
};
export { SidebarToggle };
