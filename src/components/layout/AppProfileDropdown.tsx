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
import AuthService from 'src/security/AuthService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/Store';
import styles from './AppProfileDropdown.module.css';

const avatar = require('../../assets/images/avatars/anonymous-male.jpg');

const AppProfileDropdown: React.FC<{}> = () => {
  const username: string = useSelector((state: RootState) => state.auth.username);
  const navigate = useNavigate();

  const signOutHandler = () => {
    AuthService.signOut().then(() => {
      navigate('/', { replace: true });
    });
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle /*placement="bottom-end"*/ className="py-0" caret={false}>
        {username}
        <CAvatar src={avatar} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">{username}</CDropdownHeader>
        <div className={styles['dropdown-item']}>
          <CDropdownItem onClick={signOutHandler}>
            <CIcon icon={cilLockLocked} className="me-2" />
            Sign Out
          </CDropdownItem>
        </div>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppProfileDropdown;
