import { matchPath, useLocation } from 'react-router-dom';
const useMatchPath = (path, mode = 'default') => {
  const {
    pathname
  } = useLocation();
  let match = false;
  if (mode === 'default' && matchPath({
    path,
    end: true
  }, pathname)) {
    match = true;
  } else if (mode === 'full' && matchPath({
    path,
    end: false
  }, pathname)) {
    match = true;
  }
  return {
    match,
    isExternal: path.startsWith('http') || path.startsWith('//')
  };
};
export { useMatchPath };