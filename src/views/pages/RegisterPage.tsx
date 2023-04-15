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
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed, cilLockLocked, cilPeople, cilUser, cilWarning } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from 'src/security/AuthService';
import styles from './RegisterPage.module.css';
import { ALLOW_SIGN_UP } from 'src/config/ServiceConfig';
import { UserRegistrationReqData } from 'src/security/User';
import AccountConfirmationPage from './AccountConfirmationPage';

const allowSignUp = ALLOW_SIGN_UP;

const RegisterPage: React.FC = () => {
  const usernameRef: RefObject<HTMLInputElement> = useRef(null);
  const emailRef: RefObject<HTMLInputElement> = useRef(null);
  const nameRef: RefObject<HTMLInputElement> = useRef(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef(null);
  const confirmPasswordRef: RefObject<HTMLInputElement> = useRef(null);
  const genderRef: RefObject<HTMLSelectElement> = useRef(null);
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
    navigate('/', { replace: true });
  };

  const confirmAccountHandler = (): void => {
    AuthService.getInstance()
      .signIn(username, password)
      .then(() => {
        setAccountConfirmationModalVisible(false);
        navigate('/', { replace: true });
      })
      .catch((err: Error) => {
        setAccountConfirmationModalVisible(false);
        addToast(buildToast(err.message, 'Authentication Error'));
      });
  };

  const buildToast = (errorMsg: string, title: string = 'Registration Error'): ReactElement => {
    return (
      <CToast>
        <CToastHeader closeButton>
          <CIcon icon={cilWarning} className={styles['extra-space']} />
          <div className="fw-bold me-auto">title</div>
        </CToastHeader>
        <CToastBody>{errorMsg}</CToastBody>
      </CToast>
    );
  };

  const signupHandler = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();

    if (
      usernameRef.current?.value == null ||
      nameRef.current?.value == null ||
      emailRef.current?.value == null ||
      passwordRef.current?.value == null ||
      confirmPasswordRef.current?.value == null ||
      genderRef.current?.value == null
    ) {
      addToast(buildToast('Missing user data...'));
      return;
    }

    const registrationReq = new UserRegistrationReqData(
      usernameRef.current.value,
      nameRef.current.value,
      emailRef.current.value,
      passwordRef.current.value,
      genderRef.current.value,
    );

    AuthService.getInstance()
      .signUp(registrationReq)
      .then((username: string) => {
        setUsername(username);
        setPassword(registrationReq.password);
        openAccountConfirmationModal();
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
                      {!allowSignUp && (
                        <p style={{ color: 'red' }}>Sorry sign up is currently not allowed.</p>
                      )}
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
                          disabled={!allowSignUp}
                          ref={usernameRef}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="text"
                          id="name"
                          placeholder="Name"
                          autoComplete="name"
                          required
                          disabled={!allowSignUp}
                          ref={nameRef}
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
                          disabled={!allowSignUp}
                          ref={emailRef}
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
                          disabled={!allowSignUp}
                          ref={passwordRef}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          id="password-confirmation"
                          type="password"
                          placeholder="Confirm Your Password"
                          autoComplete="current-password-confirmation"
                          required
                          disabled={!allowSignUp}
                          ref={confirmPasswordRef}
                        />
                      </CInputGroup>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPeople} />
                        </CInputGroupText>
                        <CFormSelect
                          aria-label="Default select example"
                          disabled={!allowSignUp}
                          ref={genderRef}
                        >
                          <option>Select Gender</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </CFormSelect>
                      </CInputGroup>
                      <p className="text-medium-emphasis">
                        Already a member? <Link to={'/login'}>Log In</Link>.
                      </p>
                      <CRow className="justify-content-end">
                        <CCol xs={6}>
                          <CButton
                            color="secondary"
                            className="px-4 float-end"
                            type="submit"
                            disabled={!allowSignUp}
                            style={{
                              ...(allowSignUp
                                ? {}
                                : { cursor: 'not-allowed', pointerEvents: 'auto' }),
                            }}
                          >
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
      <AccountConfirmationPage
        visible={accountConfirmationModalVisible}
        username={username}
        onCloseHandler={closeAccountConfirmationFormHandler}
        onSaveHandler={confirmAccountHandler}
      />
    </Fragment>
  );
};

export default RegisterPage;
