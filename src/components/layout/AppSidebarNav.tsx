import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';

import { CBadge } from '@coreui/react';
import { INavigation } from './Navigation';

interface IExtendedNavigation extends INavigation {
  badge?: any;
  items?: any;
  to?: any;
}

type ExtendedNavigationType = IExtendedNavigation[];

const AppSidebarNav: React.FC<{ items: ExtendedNavigationType }> = ({ items }) => {
  const location = useLocation();
  const navLink = (name: string, icon: any, badge: any) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item: IExtendedNavigation, index: number) => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    );
  };
  const navGroup = (item: IExtendedNavigation, index: number) => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon, null)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {item.items?.map((item: IExtendedNavigation, index: number) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  );
};

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default AppSidebarNav;
