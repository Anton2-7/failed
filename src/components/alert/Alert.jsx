import React from 'react';
import { KeenIcon } from '@/components/keenicons';
const variantStyles = {
  success: 'border-success-clarity bg-success-light text-success',
  info: 'border-info-clarity bg-info-light text-info',
  danger: 'border-danger-clarity bg-danger-light text-danger',
  primary: 'border-primary-clarity bg-primary-light text-primary',
  warning: 'border-warning-clarity bg-warning-light text-warning'
};
const Alert = ({
  variant = 'primary',
  icon = 'information-2',
  children,
  className = ''
}) => {
  return <div className={`flex items-center gap-2.5 border rounded-md p-3 ${variantStyles[variant]} ${className}`} role="alert">
      <KeenIcon icon={icon} style="solid" className={`text-lg leading-0 ${variantStyles[variant].split(' ')[2]}`} aria-label={icon} />
      <div className="text-gray-700 text-sm">{children}</div>
    </div>;
};
export { Alert };