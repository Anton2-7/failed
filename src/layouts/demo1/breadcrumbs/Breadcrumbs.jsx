import clsx from "clsx";
import { Fragment } from "react";
import { useLocation } from "react-router";
import { KeenIcon } from "@/components";
import { useMenuBreadcrumbs } from "@/components/menu";
import { useMenus } from "@/providers";
import { Link } from "react-router-dom";

const Breadcrumbs = () => {
  const { pathname } = useLocation();
  const { getMenuConfig } = useMenus();
  const menuConfig = getMenuConfig("primary");
  const items = useMenuBreadcrumbs(pathname, menuConfig);
  const renderItems = (items) => {
    return items.map((item, index) => {
      const last = index === items.length - 1;
      return (
        <Fragment key={`root-${index}`}>
          {item.path && !last ? (
            <Link
              to={item.path}
              className={clsx(
                item.active ? "text-gray-700" : "text-gray-700",
                "hover:text-primary transition-colors"
              )}
              key={`item-${index}`}
            >
              {item.title}
            </Link>
          ) : (
            <span
              className={clsx(item.active ? "text-gray-700" : "text-gray-700")}
              key={`item-${index}`}
            >
              {item.title}
            </span>
          )}
          {!last && (
            <KeenIcon
              icon="right"
              className="text-gray-500 text-3xs"
              key={`separator-${index}`}
            />
          )}
        </Fragment>
      );
    });
  };
  const render = () => {
    return (
      <div className="flex items-center [.header_&]:below-lg:hidden items-center gap-1.25 text-xs lg:text-sm font-medium mb-2.5 lg:mb-0">
        {/* Домик как первая крошка */}
        <div className="flex items-center gap-1.5">
          <Link to="/">
            <KeenIcon
              icon="home"
              className="text-gray-500 hover:text-primary transition-colors"
            />
          </Link>
          {items.length > 0 && (
            <KeenIcon icon="right" className="text-gray-500 text-3xs" />
          )}
        </div>
        {items && renderItems(items)}
      </div>
    );
  };
  return render();
};
export { Breadcrumbs };
