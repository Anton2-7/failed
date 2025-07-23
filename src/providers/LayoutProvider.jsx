/* eslint-disable no-unused-vars */
import { createContext, useContext, useState } from 'react';
import { getData, setData } from '../utils';
const LAYOUTS_CONFIGS_KEY = 'layouts-configs';
const getLayouts = () => {
  const storedLayouts = getData(LAYOUTS_CONFIGS_KEY) || {};
  return new Map(Object.entries(storedLayouts));
};
const initialProps = {
  getLayout: name => {
    return {};
  },
  hasLayout: name => false,
  updateLayout: (name, config) => {},
  currentLayout: null,
  setCurrentLayout: layoutProvider => {}
};
const LayoutContext = createContext(initialProps);
const useLayout = () => useContext(LayoutContext);
const LayoutProvider = ({
  children
}) => {
  const getLayout = name => {
    const storedLayouts = getLayouts();
    return storedLayouts.get(name);
  };
  const hasLayout = name => {
    const storedLayouts = getLayouts();
    return storedLayouts && storedLayouts.has(name);
  };
  const updateLayout = (name, config) => {
    const storedLayouts = getLayouts();
    if (storedLayouts.has(name)) {
      storedLayouts.delete(name);
    }
    storedLayouts.set(name, config);
    setData(LAYOUTS_CONFIGS_KEY, Object.fromEntries(storedLayouts));
  };
  const [currentLayout, setCurrentLayout] = useState();
  return <LayoutContext.Provider value={{
    getLayout,
    hasLayout,
    updateLayout,
    currentLayout,
    setCurrentLayout
  }}>
      {children}
    </LayoutContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export { LayoutContext, LayoutProvider, useLayout };