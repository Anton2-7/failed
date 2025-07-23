import clsx from 'clsx';
const MenuLabel = ({
  className,
  hasItemSub,
  handleToggle,
  handleClick,
  children
}) => {
  if (hasItemSub) {
    return <div className={clsx('menu-label', className && className)} onClick={handleToggle}>
        {children}
      </div>;
  } else {
    return <div className={clsx('menu-label', className && className)} onClick={handleClick}>
        {children}
      </div>;
  }
};
export { MenuLabel };