import React from 'react';

const Dashboard = React.lazy(() => import('./views/dashboard/MainDashboard'));
const Page404 = React.lazy(() => import('./views/pages/Page404'));

const Routes = [
  { path: '/', exact: true, name: 'Dashboard' },
  { path: '/dashboard', exact: false, name: 'Dashboard', element: Dashboard },
  { path: '*', exact: false, name: 'Dashboard', element: Page404 },
];

export default Routes;

export type RouteType = {
  path: string;
  exact?: boolean;
  name?: string;
  element?: React.FC;
};
