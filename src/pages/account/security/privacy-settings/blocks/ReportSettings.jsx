import clsx from 'clsx';
const ReportSettings = ({
  limit,
  className
}) => {
  const items = [{
    title: 'Ony invited People',
    description: 'Invite selected people via email.',
    checked: true
  }, {
    title: 'People with the link',
    description: 'Create a pubic link for your report.',
    checked: false
  }, {
    title: 'Everyone',
    description: 'Reports will be visible only for everyone.',
    checked: false
  }, {
    title: 'No one',
    description: 'Reports will be visible only for you.',
    checked: false
  }];
  const renderItem = (item, index) => {
    return <label key={index} className="card-group flex items-center justify-between py-4 gap-2.5">
        <div className="flex flex-col justify-center gap-1.5">
          <span className="leading-none font-semibold text-sm text-gray-900">{item.title}</span>
          <span className="text-2sm text-gray-600">{item.description}</span>
        </div>

        <input type="radio" className="radio" name="sharing-setting" value={index} defaultChecked={item.checked} readOnly />
      </label>;
  };
  return <div className={clsx('card', className && className)}>
      <div className="card-header">
        <h3 className="card-title">Report Sharing Settings</h3>
      </div>
      {items.map((item, index) => {
      if (limit === undefined || index < limit) {
        return renderItem(item, index);
      }
      return null;
    })}
    </div>;
};
export { ReportSettings };