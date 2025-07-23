import clsx from 'clsx';
const MenuBadge = ({
  className,
  children
}) => {
  return <div className={clsx('menu-badge', className && className)}>{children}</div>;
};
export { MenuBadge };