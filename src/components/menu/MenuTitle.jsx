import clsx from 'clsx';
import { memo } from 'react';
const MenuTitleComponent = ({
  className,
  children
}) => {
  return <div className={clsx('menu-title', className && className)}>{children}</div>;
};
const MenuTitle = memo(MenuTitleComponent);
export { MenuTitle };