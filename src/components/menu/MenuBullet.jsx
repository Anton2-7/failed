import clsx from 'clsx';
const MenuBullet = ({
  className,
  children
}) => {
  return <div className={clsx('menu-bullet', className && className)}>{children}</div>;
};
export { MenuBullet };