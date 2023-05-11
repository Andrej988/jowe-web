import React from 'react';
import WeightChartsForm from './views/weight/WeightChartsForm';
import WeightMeasurementsForm from './views/weight/WeightMeasurementsForm';

const WeightOverviewForm = React.lazy(
  async () => await import('./views/weight/WeightOverviewForm'),
);
const Page404 = React.lazy(async () => await import('./views/pages/Page404'));

const Routes = [
  { path: '/', name: 'Overview', element: WeightOverviewForm },
  { path: '/overview', name: 'Overview', element: WeightOverviewForm },
  { path: '/weight/overview', name: 'Weight Overview', element: WeightOverviewForm },
  { path: '/weight/measurements', name: 'Weight Measurements', element: WeightMeasurementsForm },
  { path: '/weight/charts', name: 'Weight Charts', element: WeightChartsForm },
  { path: '*', name: 'Overview', element: Page404 },
];

export default Routes;

export interface RouteType {
  path: string;
  exact?: boolean;
  name?: string;
  element?: React.FC;
}
