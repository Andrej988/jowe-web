import React from 'react';
import { useLocation } from 'react-router-dom';

import Routes, { RouteType } from '../../Routes';

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react';

interface Breadcrumb {
  pathname: string;
  name: string;
  active: boolean;
}

const AppBreadcrumb: React.FC<{}> = () => {
  const currentLocation: string = useLocation().pathname;

  const getRouteName = (pathname: string, Routes: RouteType[]): string => {
    const currentRoute = Routes.find((route) => route.path === pathname);
    return currentRoute && currentRoute.name !== undefined ? currentRoute.name : '';
  };

  const getBreadcrumbs = (location: string): Breadcrumb[] => {
    const breadcrumbs: Breadcrumb[] = [];
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`;
      const routeName = getRouteName(currentPathname, Routes);
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        });
      return currentPathname;
    });
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs(currentLocation);

  return (
    <CBreadcrumb className="m-0 ms-2">
      <CBreadcrumbItem>Weight Tracker</CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
        );
      })}
    </CBreadcrumb>
  );
};

export default React.memo(AppBreadcrumb);
