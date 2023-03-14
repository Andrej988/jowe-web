import React from 'react';
import Charts from './views/charts/Charts';
import Measurements from './views/measurements/Measurements';

const Dashboard = React.lazy(() => import('./views/dashboard/MainDashboard'));
const Page404 = React.lazy(() => import('./views/pages/Page404'));

const Routes = [
  { path: '/', name: 'Dashboard' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/measurements', name: 'Measurements', element: Measurements },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '*', name: 'Dashboard', element: Page404 },
];

export default Routes;

export type RouteType = {
  path: string;
  exact?: boolean;
  name?: string;
  element?: React.FC;
};
