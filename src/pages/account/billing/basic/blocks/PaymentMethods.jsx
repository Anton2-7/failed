import { KeenIcon } from '@/components';
import { toAbsoluteUrl } from '@/utils';
const PaymentMethods = () => {
  const items = [{
    logo: 'visa.svg',
    title: 'Jason Tatum',
    email: 'Ending 3604  Expires on 12/2026',
    label: true
  }, {
    logo: 'ideal.svg',
    title: 'Jason Tatum',
    email: 'iDeal with ABN Ambro',
    label: false
  }, {
    logo: 'paypal.svg',
    title: 'Jason Tatum',
    email: 'jasontt@studio.co',
    label: false
  }];
  const renderItem = (item, index) => {
    return <div key={index} className="flex items-center justify-between border border-gray-200 rounded-xl gap-2 px-4 py-4 bg-secondary-clarity">
        <div className="flex items-center gap-3.5">
          <img src={toAbsoluteUrl(`/media/brand-logos/${item.logo}`)} className="w-10 shrink-0" alt="" />

          <div className="flex flex-col">
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-primary-active mb-px">
              {item.title}
            </a>
            <span className="text-2sm text-gray-700">{item.email}</span>
          </div>
        </div>
        <div className="flex items-center gap-5">
          {item.label && <span className="badge badge-sm badge-success badge-outline">Primary</span>}
          <div className="flex gap-0.5">
            <div className="btn btn-sm btn-icon btn-clear btn-light">
              <KeenIcon icon="notepad-edit" />
            </div>
            <div className="btn btn-sm btn-icon btn-clear btn-light">
              <KeenIcon icon="trash" />
            </div>
          </div>
        </div>
      </div>;
  };
  return <div className="card grow">
      <div className="card-header">
        <h3 className="card-title">Payment Methods</h3>

        <button className="btn btn-light btn-sm">
          <KeenIcon icon="plus-squared" />
          Add New
        </button>
      </div>

      <div className="card-body lg:pb-7.5">
        <div className="grid gap-5">
          {items.map((item, index) => {
          return renderItem(item, index);
        })}
        </div>
      </div>
    </div>;
};
export { PaymentMethods };