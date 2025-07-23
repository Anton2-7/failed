/* eslint-disable react-hooks/exhaustive-deps */
import { Drawer } from "@/components";
import { useEffect, useRef, useState } from "react";
import { useResponsive, useViewport } from "@/hooks";
import { useDemo1Layout } from "../";
import { SidebarContent, SidebarHeader } from "./";
import clsx from "clsx";
import { getHeight } from "@/utils";
import { usePathname } from "@/providers";
import { useWindowWidth } from "./useWindowWidth";
const Sidebar = () => {
  const selfRef = useRef(null);
  const headerRef = useRef(null);
  const [scrollableHeight, setScrollableHeight] = useState(0);
  const scrollableOffset = 40;
  const [viewportHeight] = useViewport();
  const { pathname, prevPathname } = usePathname();
  const windowWidth = useWindowWidth();
  const { layout, setSidebarCollapse } = useDemo1Layout(); // добавь setSidebarCollapse

  // Добавь эффект, который будет скрывать сайдбар при ширине < 1440
  useEffect(() => {
    if (windowWidth < 1440 && !layout.options.sidebar.collapse) {
      setSidebarCollapse(true); // свернуть
    } else if (windowWidth >= 1440 && layout.options.sidebar.collapse) {
      setSidebarCollapse(false); // развернуть
    }
  }, [windowWidth]);

  useEffect(() => {
    if (headerRef.current) {
      const headerHeight = getHeight(headerRef.current);
      const availableHeight = viewportHeight - headerHeight - scrollableOffset;
      setScrollableHeight(availableHeight);
    } else {
      setScrollableHeight(viewportHeight);
    }
  }, [viewportHeight]);
  const desktopMode = useResponsive("up", "lg");
  const { mobileSidebarOpen, setSidebarMouseLeave, setMobileSidebarOpen } =
    useDemo1Layout();
  // const { layout } = useDemo1Layout();
  const themeClass =
    layout.options.sidebar.theme === "dark" || pathname === "/dark-sidebar"
      ? "dark [&.dark]:bg-coal-600"
      : "dark:bg-coal-600";
  const handleMobileSidebarClose = () => {
    setMobileSidebarOpen(false);
  };
  const handleMouseEnter = () => {
    setSidebarMouseLeave(false);
  };
  const handleMouseLeave = () => {
    setSidebarMouseLeave(true);
  };
  const renderContent = () => {
    return (
      <div
        // style={{ zIndex: 100, width: !desktopMode ? "280px" : undefined }}
        style={{ zIndex: 100, width: mobileSidebarOpen ? "280px" : undefined }}
        ref={selfRef}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        className={clsx(
          "sidebar bg-light border-e border-e-gray-200 dark:border-e-coal-100 fixed top-0 bottom-0 z-20 lg:flex flex-col items-stretch shrink-0",
          !desktopMode && "w-[280px]",
          themeClass
        )}
      >
        {desktopMode && <SidebarHeader ref={headerRef} />}
        <SidebarContent
          {...(desktopMode && {
            height: scrollableHeight,
          })}
        />
      </div>
    );
  };
  useEffect(() => {
    // Hide drawer on route chnage after menu link click
    if (!desktopMode && prevPathname !== pathname) {
      handleMobileSidebarClose();
    }
  }, [desktopMode, pathname, prevPathname]);
  if (desktopMode) {
    return renderContent();
  } else {
    return (
      <>
        {/* Backdrop */}
        {mobileSidebarOpen && (
          <div
            onClick={handleMobileSidebarClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 9998,
            }}
          />
        )}

        {/* Sidebar */}
        {mobileSidebarOpen && (
          <div
            style={{
              zIndex: 9999,
              width: "280px",
              background: "white",
              position: "fixed",
              top: 0,
              bottom: 0,
              left: 0,
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {renderContent()}
          </div>
        )}
      </>
    );
  }
};
export { Sidebar };
