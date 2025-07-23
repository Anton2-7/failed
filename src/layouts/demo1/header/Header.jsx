import clsx from "clsx";
import { useEffect } from "react";
import { Container } from "@/components/container";
import { MegaMenu } from "../mega-menu";
import { matchPath } from "react-router";
import { MENU_SIDEBAR } from "../../../config";
import { HeaderLogo, HeaderTopbar } from "./";
import { Breadcrumbs, useDemo1Layout } from "../";
import { useLocation } from "react-router";
const Header = () => {
  const { headerSticky } = useDemo1Layout();
  const { pathname } = useLocation();
  const isSidebarPath = (pathname, items) => {
    const check = (nodes) => {
      for (const item of nodes) {
        if (item.path && matchPath({ path: item.path, end: false }, pathname)) {
          return true;
        }
        if (item.children) {
          if (check(item.children)) return true;
        }
      }
      return false;
    };
    return check(items);
  };
  useEffect(() => {
    if (headerSticky) {
      document.body.setAttribute("data-sticky-header", "on");
    } else {
      document.body.removeAttribute("data-sticky-header");
    }
  }, [headerSticky]);
  return (
    <header
      className={clsx(
        "header fixed top-0 z-10 start-0 end-0 flex items-stretch shrink-0 bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]",
        headerSticky && "shadow-sm"
      )}
      style={{ zIndex: 90 }}
    >
      <Container className="flex justify-between items-stretch lg:gap-4 z-[10] w-full mx-6">
        <HeaderLogo />
        {isSidebarPath(pathname, MENU_SIDEBAR) ? <Breadcrumbs /> : <MegaMenu />}
        <HeaderTopbar />
      </Container>
    </header>
  );
};
export { Header };
