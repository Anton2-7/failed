import { matchPath } from 'react-router';
const useMenuCurrentItem = (pathname, items) => {
  pathname = pathname.trim();
  const findCurrentItem = items => {
    if (!items) return null;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.path && matchPath(pathname, item.path)) {
        return item ?? null;
      } else if (item.children) {
        const childItem = findCurrentItem(item.children);
        if (childItem) {
          return childItem;
        }
      }
    }
    return null;
  };
  return findCurrentItem(items);
};
export { useMenuCurrentItem };