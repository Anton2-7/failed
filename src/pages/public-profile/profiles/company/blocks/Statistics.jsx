import React from 'react';
const Statistics = ({
  items
}) => {
  const renderItems = (item, index) => {
    return <React.Fragment key={index}>
        <div className="grid grid-cols-1 place-content-center flex-1 gap-1 text-center">
          <span className="text-gray-900 text-2xl lg:text-2.5xl leading-none font-semibold">
            {item.number}
          </span>
          <span className="text-gray-700 text-sm">{item.label}</span>
        </div>

        <span className="[&:not(:last-child)]:border-e border-e-gray-300 my-1"></span>
      </React.Fragment>;
  };
  return <div className="card">
      <div className="card-body">
        <div className="flex lg:px-10 py-1.5 gap-2">
          {items.map((item, index) => {
          return renderItems(item, index);
        })}
        </div>
      </div>
    </div>;
};
export { Statistics };