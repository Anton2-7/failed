const Tags = ({
  title
}) => {
  const items = [{
    label: 'Web Design'
  }, {
    label: 'Code Review'
  }, {
    label: 'Figma'
  }, {
    label: 'Product Development'
  }, {
    label: 'Webflow'
  }, {
    label: 'AI'
  }, {
    label: 'noCode'
  }, {
    label: 'Management'
  }];
  const renderItem = (item, index) => {
    return <span key={index} className="badge badge-sm badge-gray-200">
        {item.label}
      </span>;
  };
  return <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>

      <div className="card-body">
        <div className="flex flex-wrap gap-3 mb-3">
          {items.map((item, index) => {
          return renderItem(item, index);
        })}
        </div>
      </div>
    </div>;
};
export { Tags };