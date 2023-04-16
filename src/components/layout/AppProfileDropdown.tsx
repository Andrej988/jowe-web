import React, { Fragment, useState } from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import { cilLockLocked, cilSettings, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import AuthService from 'src/auth/AuthService';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from 'src/store/Store';
import styles from './AppProfileDropdown.module.css';

import avatar_male from '../../assets/images/avatars/anonymous-male.jpg';
import avatar_female from '../../assets/images/avatars/anonymous-female.jpg';
import DeleteAccountPage from 'src/views/pages/auth/DeleteAccountPage';
import ChangePasswordPage from 'src/views/pages/auth/ChangePasswordPage';

const getAvatar = (): string => {
  const gender = AuthService.getInstance().getUserData().gender;
  if (gender != null && gender.toLocaleLowerCase() === 'female') {
    return avatar_female;
  } else {
    return avatar_male;
  }
};

const AppProfileDropdown: React.FC = () => {
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [deleteAccountModalVisible, setDeleteAccountModalVisible] = useState(false);
  const navigate = useNavigate();

  const username: string = useSelector((state: RootState) =>
    state.auth.user.username != null ? state.auth.user.username : '',
  );
  const name: string = useSelector((state: RootState) =>
    state.auth.user.name != null ? state.auth.user.name : '',
  );

  const openDeleteAccountModalHandler = (): void => {
    setDeleteAccountModalVisible(true);
  };

  const openChangePasswordModalHandler = (): void => {
    setChangePasswordModalVisible(true);
  };

  const closeDeleteAccountModalHandler = (): void => {
    setDeleteAccountModalVisible(false);
  };

  const closeChangePasswordModalHandler = (): void => {
    setChangePasswordModalVisible(false);
  };

  const confirmDeleteAccountHandler = (): void => {
    AuthService.getInstance()
      .deleteUser()
      .then(() => {
        setDeleteAccountModalVisible(false);
        navigate('/', { replace: true });
      })
      .catch(() => {});
  };

  const confirmPasswordChangeHandler = (): void => {
    console.log('clicked');
  };

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
          <CDropdownHeader className="bg-light fw-semibold py-2">
            {name != null ? name : username}
          </CDropdownHeader>
          <div className={styles['dropdown-item']}>
            <CDropdownItem onClick={openChangePasswordModalHandler}>
              <CIcon icon={cilSettings} className="me-2" />
              Change Password
            </CDropdownItem>
            <CDropdownItem onClick={openDeleteAccountModalHandler}>
              <CIcon icon={cilTrash} className="me-2" />
              Delete account
            </CDropdownItem>
            <CDropdownDivider />
            <CDropdownItem onClick={signOutHandler}>
              <CIcon icon={cilLockLocked} className="me-2" />
              Sign Out
            </CDropdownItem>
          </div>
        </CDropdownMenu>
      </CDropdown>
      <DeleteAccountPage
        visible={deleteAccountModalVisible}
        onCloseHandler={closeDeleteAccountModalHandler}
        onConfirmHandler={confirmDeleteAccountHandler}
      />
      <ChangePasswordPage
        visible={changePasswordModalVisible}
        onCloseHandler={closeChangePasswordModalHandler}
        onConfirmHandler={confirmPasswordChangeHandler}
      />
    </Fragment>
  );
};

export default AppProfileDropdown;
