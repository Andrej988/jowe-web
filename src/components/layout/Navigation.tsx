import React, { PropsWithChildren, ReactElement } from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilPencil,
  cilSpreadsheet,
  cilChartLine,
  cilBalanceScale,
  cilBike,
  cilHospital,
  cilFastfood,
} from '@coreui/icons';
import { CNavItem, CNavTitle } from '@coreui/react';

const Navigation: NavigationType = [
  {
    component: CNavItem,
    name: 'Overview',
    to: '/',
    icon: <CIcon icon={cilSpreadsheet} customClassName="nav-icon" />,
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
    icon: <CIcon icon={cilHospital} customClassName="nav-icon" />,
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
  {
    component: CNavTitle,
    name: 'Meal Planner',
  },
  {
    component: CNavItem,
    name: 'Recipes',
    to: '/meals/recipes',
    icon: <CIcon icon={cilFastfood} customClassName="nav-icon" />,
  },
];

export default Navigation;

export type NavigationType = INavigation[];

export interface INavigation {
  component: React.FC<INavigationComponentProps>;
  name: string;
  to?: string;
  disabled?: boolean;
  icon?: React.JSX.Element;
  badge?: IBadge;
  items?: INavigation[];
}

export interface INavigationComponentProps extends PropsWithChildren {
  idx?: string;
  toggler?: ReactElement;
  visible?: boolean;
}

export interface IBadge {
  color: string;
  text: string;
}
