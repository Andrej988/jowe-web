import React from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilLockLocked } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const avatar = require('../../assets/images/avatars/anonymous-male.jpg');

const AppHeaderDropdown: React.FC<{}> = () => {
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle /*placement="bottom-end"*/ className="py-0" caret={false}>
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">[USERNAME]</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilLockLocked} className="me-2" />
          Sign Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
