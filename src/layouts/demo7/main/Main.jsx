import { Fragment } from 'react';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router';
import { Menu, MenuItem, MenuLink, MenuSub, MenuTitle, MenuToggle, useMenuCurrentItem } from '@/components/menu';
import { useMenus } from '@/providers';
import { Header, Footer } from '..';
import { Toolbar, ToolbarHeading, ToolbarActions } from '../toolbar';
import { Link } from 'react-router-dom';
import { KeenIcon } from '@/components';
import { useLanguage } from '@/i18n';
const Main = () => {
  const {
    pathname
  } = useLocation();
  const {
    getMenuConfig
  } = useMenus();
  const menuConfig = getMenuConfig('primary');
  const {
    isRTL
  } = useLanguage();
  const menuItem = useMenuCurrentItem(pathname, menuConfig);
  const months = [{
    title: 'January, 2024'
  }, {
    title: 'February, 2024'
  }, {
    title: 'March, 2024',
    active: true
  }, {
    title: 'April, 2024'
  }, {
    title: 'May, 2024'
  }, {
    title: 'June, 2024'
  }, {
    title: 'July, 2024'
  }, {
    title: 'August, 2024'
  }, {
    title: 'September, 2024'
  }, {
    title: 'October, 2024'
  }, {
    title: 'November, 2024'
  }, {
    title: 'December, 2024'
  }];
  return <Fragment>
      <Helmet>
        <title>{menuItem?.title}</title>
      </Helmet>
      <div className="flex grow flex-col [[data-sticky-header=on]_&]:pt-[--tw-header-height-default]">
        <Header />

        <div className="grow" role="content">
          {!pathname.includes('/public-profile/') && <Toolbar>
              <ToolbarHeading />
              <ToolbarActions>
                <Link to={'/account/home/get-started'} className="btn btn-sm btn-light">
                  <KeenIcon icon="exit-down" className="!text-base" />
                  Export
                </Link>

                <Menu className="menu-default">
                  <MenuItem toggle="dropdown" trigger="hover" dropdownProps={{
                placement: isRTL() ? 'bottom-start' : 'bottom-end',
                modifiers: [{
                  name: 'offset',
                  options: {
                    offset: [0, 0] // [skid, distance]
                  }
                }]
              }}>
                    <MenuToggle className="btn btn-light btn-sm flex-nowrap">
                      <span className="flex items-center me-1">
                        <KeenIcon icon="calendar" className="!text-md" />
                      </span>
                      <span className="hidden md:inline text-nowrap">September, 2024</span>
                      <span className="inline md:hidden text-nowrap">Sep, 2024</span>
                      <span className="flex items-center lg:ms-4">
                        <KeenIcon icon="down" className="!text-xs" />
                      </span>
                    </MenuToggle>

                    <MenuSub className="menu-default w-48 py-2 scrollable-y max-h-[250px]">
                      {months.map((item, index) => <MenuItem key={index} className={item.active ? 'active' : ''}>
                          <MenuLink path="/">
                            <MenuTitle>{item.title}</MenuTitle>
                          </MenuLink>
                        </MenuItem>)}
                    </MenuSub>
                  </MenuItem>
                </Menu>
              </ToolbarActions>
            </Toolbar>}
          <Outlet />
        </div>
        <Footer />
      </div>
    </Fragment>;
};
export { Main };