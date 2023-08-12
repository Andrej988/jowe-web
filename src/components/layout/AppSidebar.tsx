import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { CSidebar, CSidebarBrand, CSidebarNav } from '@coreui/react';
import CIcon from '@coreui/icons-react';

import AppSidebarNav from './AppSidebarNav';

import { logoNegative } from 'src/assets/brand/logo-negative';
import { sygnet } from 'src/assets/brand/sygnet';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

// sidebar nav config
import Navigation from './Navigation';
import type { RootState } from 'src/store/Store';

const AppSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state: RootState) => state.layout.showSidebar);

  return (
    <CSidebar
      position="fixed"
      unfoldable={false}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarBrand className="d-none d-md-flex">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={Navigation} />
        </SimpleBar>
      </CSidebarNav>
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
