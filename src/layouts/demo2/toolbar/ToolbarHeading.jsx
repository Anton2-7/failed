import { useMenus } from '@/providers';
import { useMenuCurrentItem } from '@/components';
import { useLocation } from 'react-router';
import { ToolbarBreadcrumbs } from './ToolbarBreadcrumbs';
const ToolbarHeading = ({
  title = ''
}) => {
  const {
    getMenuConfig
  } = useMenus();
  const {
    pathname
  } = useLocation();
  const currentMenuItem = useMenuCurrentItem(pathname, getMenuConfig('primary'));
  return <div className="flex items-center flex-wrap gap-1 lg:gap-5">
      <h1 className="font-medium text-lg text-gray-900">{title || currentMenuItem?.title}</h1>
      <ToolbarBreadcrumbs />
    </div>;
};
export { ToolbarHeading };