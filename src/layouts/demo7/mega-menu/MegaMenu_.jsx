import { Menu, MenuItem, MenuLink, MenuTitle } from '@/components/menu';
const MegaMenu = () => {
  const items = [{
    title: 'Boards',
    path: '/',
    partial: false
  }, {
    title: 'Profiles',
    path: '/public-profile/profiles/default',
    partial: '/public-profile'
  }, {
    title: 'Settings',
    path: '/account/home/get-started',
    partial: '/account'
  }, {
    title: 'Network',
    path: '/network/get-started',
    partial: '/network'
  }, {
    title: 'Authentication',
    path: '/authentication/get-started',
    partial: '/authentication'
  }];
  return <div className="flex items-stretch">
      <div className="flex items-stretch">
        <Menu highlight={true} className="menu flex-col lg:flex-row gap-5 lg:gap-7.5">
          {items.map((item, index) => <MenuItem key={index} className="">
              <MenuLink path={item.path} className="border-b border-b-transparent menu-item-active:border-b-gray-400 menu-item-here:border-b-gray-400">
                <MenuTitle className="text-2sm text-gray-800 dark:menu-item-here:text-gray-900 dark:menu-item-active:text-gray-900 menu-item-show:text-gray-900 menu-item-here:text-gray-900 menu-item-active:font-medium menu-item-here:font-medium">
                  {item.title}
                </MenuTitle>
              </MenuLink>
            </MenuItem>)}
        </Menu>
      </div>
    </div>;
};
export { MegaMenu };