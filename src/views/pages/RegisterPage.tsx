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
import { cilEnvelopeClosed, cilLockLocked, cilUser, cilWarning } from '@coreui/icons';
import { useNavigate } from 'react-router-dom';
import AuthService from 'src/security/AuthService';
import styles from './RegisterPage.module.css';

const RegisterPage: React.FC = () => {
  const usernameRef: RefObject<HTMLInputElement> = useRef(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef(null);
  const [toast, addToast] = useState<ReactElement | undefined>();
  const toaster = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

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

  const signupHandler = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (usernameRef.current?.value == null || passwordRef.current?.value == null) {
      // TODO: Show Error
      return;
    }

    AuthService.signUp(usernameRef.current.value, passwordRef.current.value)
      .then(() => {
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
            <CCol sm={10} md={8} lg={6} xl={5}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm className={'needs-validation'} onSubmit={signupHandler}>
                      <h1>Sign Up</h1>
                      <p className="text-medium-emphasis">Sign up for account.</p>
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
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          id="email"
                          placeholder="Email"
                          autoComplete="email"
                          required
                          ref={usernameRef}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
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
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          id="password-confirmation"
                          type="password-confirmation"
                          placeholder="Confirm Your Password"
                          autoComplete="current-password-confirmation"
                          required
                          ref={passwordRef}
                        />
                      </CInputGroup>
                      <p className="text-medium-emphasis">
                        Already a member? <a href="/login">Log In</a>.
                      </p>
                      <CRow className="justify-content-end">
                        <CCol xs={6}>
                          <CButton color="primary" className="px-4 float-end" type="submit">
                            Sign Up
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

export default RegisterPage;
