import { Link } from 'react-router-dom';
import { toAbsoluteUrl } from '@/utils/Assets';
const Users = ({
  title,
  items
}) => {
  const renderItem = (item, index) => {
    return <img src={toAbsoluteUrl(`/media/avatars/${item.image}`)} className="rounded-full h-[36px]" alt="" key={index} />;
  };
  return <div className="card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
      </div>

      <div className="card-body">
        <div className="flex flex-wrap gap-2.5 xl:me-16">
          {items.map((item, index) => {
          return renderItem(item, index);
        })}
        </div>
      </div>

      <div className="card-footer justify-center">
        <Link to="/account/members/teams" className="btn btn-link">
          Join Our Team
        </Link>
      </div>
    </div>;
};
export { Users };