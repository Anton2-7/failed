import clsx from 'clsx';
const MenuSeparator = ({
  className
}) => {
  return <div className={clsx('menu-separator', className && className)}></div>;
};
export { MenuSeparator };