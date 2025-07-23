import { forwardRef } from 'react';
// Forwarding ref to ensure this component can hold a ref
const ModalHeader = forwardRef(({
  className,
  children
}, ref) => {
  return <div ref={ref} className={`modal-header ${className}`}>
        {children}
      </div>;
});
export { ModalHeader };