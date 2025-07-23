import clsx from 'clsx';
import React from 'react';
const DataGridTableFoot = ({
  children,
  className
}) => {
  return <tfoot className={clsx(className && className)}>{children}</tfoot>;
};
export { DataGridTableFoot };