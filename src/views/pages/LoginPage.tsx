import React, { Fragment, ReactElement, useRef, useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormFeedback,
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
import { useNavigate } from 'react-router-dom';
import AuthService from 'src/security/AuthService';
import styles from './LoginPage.module.css';

const LoginPage: React.FC<{}> = () => {
  const [enteredUsername, setEnteredUsername] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [toast, addToast] = useState<ReactElement | undefined>();
  const toaster = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const usernameChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredUsername(event.target.value);
  };

  const passwordChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredPassword(event.target.value);
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
    AuthService.signIn(enteredUsername, enteredPassword)
      .then(() => {
        setEnteredUsername('');
        setEnteredPassword('');
        navigate('/', { replace: true });
      })
      .catch((err: Error) => {
        addToast(buildToast(err.message));
      });
  };

  return (
    <Fragment>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CToaster ref={toaster} push={toast} placement="top-end" />
          <CRow className="justify-content-center">
            <CCol md={4}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm className={'needs-validation'} onSubmit={loginHandler}>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account</p>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          id="username"
                          autoFocus
                          placeholder="Username"
                          //autoComplete="username"
                          required
                          value={enteredUsername}
                          onChange={usernameChangeHandler}
                        />
                        <CFormFeedback invalid>You must agree before submitting.</CFormFeedback>
                      </CInputGroup>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          id="password"
                          type="password"
                          placeholder="Password"
                          //autoComplete="current-password"
                          required
                          value={enteredPassword}
                          onChange={passwordChangeHandler}
                        />
                      </CInputGroup>
                      <CRow className="justify-content-end">
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4 float-end" type="submit">
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
    </Fragment>
  );
};

export default LoginPage;
