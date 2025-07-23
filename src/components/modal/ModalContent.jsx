import { forwardRef } from 'react';
// Forwarding ref to ensure this component can hold a ref
const ModalContent = forwardRef(({
  className,
  children,
  tabIndex = -1
}, ref) => {
  return <div ref={ref} tabIndex={tabIndex} className={`modal-content ${className}`}>
        {children}
      </div>;
});
export { ModalContent };