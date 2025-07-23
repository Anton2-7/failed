import clsx from 'clsx';
const MenuIcon = ({
  className,
  children
}) => {
  return <div className={clsx('menu-icon', className && className)}>{children}</div>;
};
export { MenuIcon };