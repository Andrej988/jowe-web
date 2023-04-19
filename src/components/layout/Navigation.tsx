import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilPencil,
  cilSpreadsheet,
  cilChartLine,
  cilSpeedometer,
  cilBalanceScale,
  cilBike,
} from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const Navigation = [
  {
    component: CNavItem,
    name: 'Overview',
    to: '/',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Weight',
  },
  {
    component: CNavItem,
    name: 'Overview',
    to: '/weight/overview',
    icon: <CIcon icon={cilBalanceScale} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Measurements',
    to: '/weight/measurements',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/weight/charts',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Blood Pressure',
  },
  {
    component: CNavItem,
    name: 'Overview',
    to: '/blood-pressure/overview',
    disabled: true,
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'SOON',
    },
  },
  {
    component: CNavTitle,
    name: 'Workout',
  },
  {
    component: CNavItem,
    name: 'Overview',
    to: '/workout/overview',
    disabled: true,
    icon: <CIcon icon={cilBike} customClassName="nav-icon" />,
    badge: {
      color: 'warning',
      text: 'SOON',
    },
  },
];

export default Navigation;

export type NavigationType = INavigation[];

export interface INavigation {
  component: any;
  name: string;
  to?: string;
  icon?: any;
}
