import clsx from 'clsx';
const MenuHeading = ({
  className,
  children
}) => {
  return <div className={clsx('menu-heading', className && className)}>{children}</div>;
};
export { MenuHeading };