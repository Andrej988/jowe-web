import React, { Fragment, useRef, useState } from 'react';
import type { ReactElement, RefObject } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CToaster,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilWarning } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from 'src/security/AuthService';
import styles from './LoginPage.module.css';
import { UserNotConfirmedError } from 'src/security/UserNotConfirmedError';
import AccountConfirmationPage from './AccountConfirmationPage';

const LoginPage: React.FC = () => {
  const usernameRef: RefObject<HTMLInputElement> = useRef(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef(null);
  const [toast, addToast] = useState<ReactElement | undefined>();
  const toaster = useRef<HTMLDivElement | null>(null);
  const [accountConfirmationModalVisible, setAccountConfirmationModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const openAccountConfirmationModal = (): void => {
    setAccountConfirmationModalVisible(true);
  };

  const closeAccountConfirmationFormHandler = (): void => {
    setAccountConfirmationModalVisible(false);
  };

  const confirmAccountHandler = (): void => {
    AuthService.getInstance()
      .login(username, password)
      .then(() => {
        setAccountConfirmationModalVisible(false);
        navigate('/', { replace: true });
      })
      .catch((err: Error) => {
        setAccountConfirmationModalVisible(false);
        addToast(buildToast(err.message));
      });
  };

  const buildToast = (errorMsg: string): ReactElement => {
    return (
      <CToast>
        <CToastHeader closeButton>
          <CIcon icon={cilWarning} className={styles['extra-space']} />
          <div className="fw-bold me-auto">Authentication Error</div>
        </CToastHeader>
        <CToastBody>{errorMsg}</CToastBody>
      </CToast>
    );
  };

  const loginHandler = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (usernameRef.current?.value == null || passwordRef.current?.value == null) {
      addToast(buildToast('Missing credentials!'));
      return;
    }

    const user = usernameRef.current.value;
    const pass = passwordRef.current.value;

    AuthService.getInstance()
      .login(user, pass)
      .then(() => {
        navigate('/', { replace: true });
      })
      .catch((err: Error) => {
        if (err instanceof UserNotConfirmedError) {
          setUsername(user);
          setPassword(pass);
          openAccountConfirmationModal();
        } else {
          addToast(buildToast(err.message));
        }
      });
  };

  return (
    <Fragment>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CToaster ref={toaster} push={toast} placement="top-end" />
          <CRow className="justify-content-center">
            <CCol sm={10} md={8} lg={6} xl={5}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm className={'needs-validation'} onSubmit={loginHandler}>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account.</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          id="username"
                          autoFocus
                          placeholder="Username"
                          autoComplete="username"
                          required
                          ref={usernameRef}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          id="password"
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          required
                          ref={passwordRef}
                        />
                      </CInputGroup>
                      <p className="text-medium-emphasis">
                        Create your Account <Link to={'/register'}>here</Link>.
                      </p>
                      <CRow className="justify-content-end">
                        <CCol xs={6}>
                          <CButton color="secondary" className="px-4 float-end" type="submit">
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
      <AccountConfirmationPage
        visible={accountConfirmationModalVisible}
        username={username}
        onCloseHandler={closeAccountConfirmationFormHandler}
        onSaveHandler={confirmAccountHandler}
      />
    </Fragment>
  );
};

export default LoginPage;
