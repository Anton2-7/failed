import clsx from 'clsx';
const MenuArrow = ({
  className,
  children
}) => {
  return <div className={clsx('menu-arrow', className && className)}>{children}</div>;
};
export { MenuArrow };