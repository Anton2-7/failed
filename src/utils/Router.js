const getCurrentUrl = path => {
  return path.split(/[?#]/)[0];
};
const matchPath = (path, pathname) => {
  const current = getCurrentUrl(path);
  if (!current || !pathname) {
    return false;
  }
  if (current === pathname) {
    return true;
  }
  if (current.includes(pathname)) {
    return true;
  }
  return false;
};
export { getCurrentUrl, matchPath };