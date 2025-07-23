import { forwardRef } from 'react';
// Forwarding ref to ensure this component can hold a ref
const ModalTitle = forwardRef(({
  className,
  children
}, ref) => {
  return <h3 ref={ref} className={`modal-title ${className}`}>
      {children}
    </h3>;
});
export { ModalTitle };