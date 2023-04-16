import React, { Fragment } from 'react';
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
import AuthService from 'src/auth/AuthService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/store/Store';
import styles from './AppProfileDropdown.module.css';

import avatar_male from '../../assets/images/avatars/anonymous-male.jpg';
import avatar_female from '../../assets/images/avatars/anonymous-female.jpg';

const getAvatar = (): string => {
  const gender = AuthService.getInstance().getUserData().gender;
  if (gender != null && gender.toLocaleLowerCase() === 'female') {
    return avatar_female;
  } else {
    return avatar_male;
  }
};

const AppProfileDropdown: React.FC = () => {
  const username: string = useSelector((state: RootState) =>
    state.auth.user.username != null ? state.auth.user.username : '',
  );
  const navigate = useNavigate();

  const signOutHandler = (): void => {
    AuthService.getInstance()
      .logout()
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch(() => {});
  };

  return (
    <Fragment>
      <CDropdown alignment="end" variant="nav-item" popper={false}>
        <CDropdownToggle className="py-0" caret={false}>
          {username}
          <span> </span>
          <CAvatar src={getAvatar()} size="md" />
        </CDropdownToggle>
        <CDropdownMenu className="pt-0" placement="bottom-end" style={{ right: '0', left: 'auto' }}>
          <CDropdownHeader className="bg-light fw-semibold py-2">{username}</CDropdownHeader>
          <div className={styles['dropdown-item']}>
            <CDropdownItem onClick={signOutHandler}>
              <CIcon icon={cilLockLocked} className="me-2" />
              Sign Out
            </CDropdownItem>
            <CDropdownItem onClick={signOutHandler}>
              <CIcon icon={cilLockLocked} className="me-2" />
              Delete account
            </CDropdownItem>
          </div>
        </CDropdownMenu>
      </CDropdown>
    </Fragment>
  );
};

export default AppProfileDropdown;
