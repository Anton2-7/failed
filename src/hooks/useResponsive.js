/* eslint-disable react-hooks/rules-of-hooks */
import tailwindConfig from 'tailwindcss/defaultConfig';
import { useMediaQuery } from './useMediaQuery';
const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl'];
const useResponsive = (query, key, start, end) => {
  const screens = tailwindConfig?.theme?.screens;
  if (query === 'up' && key) {
    key = breakpoints.includes(key) && screens ? screens[key] : key;
    return useMediaQuery(`(min-width: ${key})`);
  }
  if (query === 'down' && key) {
    key = breakpoints.includes(key) && screens ? screens[key] : key;
    return useMediaQuery(`(max-width: ${key})`);
  }
  if (query === 'between' && start && end) {
    start = breakpoints.includes(start) && screens ? screens[start] : start;
    end = breakpoints.includes(end) && screens ? screens[end] : end;
    return useMediaQuery(`(min-width: ${start}) and (max-width: ${end})`);
  }
};
export { useResponsive };