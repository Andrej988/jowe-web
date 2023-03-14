import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilPencil, cilSpreadsheet, cilChartLine } from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const Navigation = [
  {
    component: CNavTitle,
    name: 'Weight Tracker',
  },
  {
    component: CNavItem,
    name: 'Overview',
    to: '/dashboard',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Measurements',
    to: '/measurements',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Charts',
    to: '/charts',
    icon: <CIcon icon={cilChartLine} customClassName="nav-icon" />,
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
