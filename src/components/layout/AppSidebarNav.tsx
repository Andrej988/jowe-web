/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react';
import type { ReactElement } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { CBadge } from '@coreui/react';
import type { IBadge, INavigation } from './Navigation';

const AppSidebarNav: React.FC<{ items: INavigation[] }> = ({ items }) => {
  const location = useLocation();
  const navLink = (name: string, icon?: React.JSX.Element, badge?: IBadge): ReactElement => {
    return (
      <>
        {Boolean(icon) && icon}
        {name.length > 0 && name}
        {Boolean(badge) && (
          <CBadge color={badge?.color} className="ms-auto">
            {badge?.text}
          </CBadge>
        )}
      </>
    );
  };

  const navItem = (item: INavigation, index: number): ReactElement => {
    const { component, name, badge, icon, ...rest } = item;
    const Component = component;
    return (
      <Component
        {...(Boolean(rest.to) &&
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
  const navGroup = (item: INavigation, index: number): ReactElement => {
    const { component, name, icon, to, ...rest } = item;
    const Component = component;
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon, undefined)}
        visible={location.pathname.startsWith(to ? to : '')}
        {...rest}
      >
        {item.items?.map((item: INavigation, index: number) =>
          item.items ? navGroup(item, index) : navItem(item, index),
        )}
      </Component>
    );
  };

  return (
    <React.Fragment>
      {items?.map((item: INavigation, index: number) =>
        item.items ? navGroup(item, index) : navItem(item, index),
      )}
    </React.Fragment>
  );
};

export default AppSidebarNav;
