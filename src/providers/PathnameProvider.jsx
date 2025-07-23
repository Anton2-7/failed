/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
const PathnameContext = createContext(undefined);
const PathnameProvider = ({
  children
}) => {
  const {
    pathname
  } = useLocation();
  const [prevPathname, setPrevPathname] = useState(undefined);
  useEffect(() => {
    setPrevPathname(() => {
      return pathname;
    });
  }, [pathname]);
  return <PathnameContext.Provider value={{
    pathname,
    prevPathname
  }}>
      {children}
    </PathnameContext.Provider>;
};
const usePathname = () => {
  const context = useContext(PathnameContext);
  if (!context) {
    throw new Error('usePathname must be used within a PathnameProvider');
  }
  return context;
};
export { PathnameProvider, usePathname };