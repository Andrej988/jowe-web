/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import type { ReactElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { CBadge } from '@coreui/react';
import type { INavigation } from './Navigation';

interface IExtendedNavigation extends INavigation {
  badge?: any;
  items?: any;
  to?: any;
}

type ExtendedNavigationType = IExtendedNavigation[];

const AppSidebarNav: React.FC<{ items: ExtendedNavigationType }> = ({ items }) => {
  const location = useLocation();
  const navLink = (name: string, icon: any, badge: any): ReactElement => {
    return (
      <>
        {Boolean(icon) && icon}
        {name.length > 0 && name}
        {Boolean(badge) && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item: IExtendedNavigation, index: number): ReactElement => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component
        {...(Boolean(rest.to) &&
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
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
  const navGroup = (item: IExtendedNavigation, index: number): ReactElement => {
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
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      (// eslint-disable-next-line prettier/prettier, @typescript-eslint/strict-boolean-expressions)
      {items?.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  );
};

export default AppSidebarNav;
