import clsx from 'clsx';
import { Children, cloneElement, isValidElement, memo, useState } from 'react';
const AccordionComponent = ({
  className,
  children,
  allowMultiple
}) => {
  const [openIndex, setOpenIndex] = useState(null);
  const handleItemClick = index => {
    setOpenIndex(prevIndex => prevIndex === index ? null : index);
  };
  const modifiedChildren = Children.map(children, (child, index) => {
    if (isValidElement(child)) {
      return cloneElement(child, {
        isOpen: allowMultiple ? child.props.isOpen : openIndex === index,
        onClick: () => handleItemClick(index)
      });
    }
    return child;
  });
  return <div className={clsx('accordion', className && className)}>{modifiedChildren}</div>;
};
const Accordion = memo(AccordionComponent);
export { Accordion };