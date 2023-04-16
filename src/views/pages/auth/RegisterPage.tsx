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
  CFormSelect,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilEnvelopeClosed, cilLockLocked, cilPeople, cilUser, cilWarning } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from 'src/auth/AuthService';
import { ALLOW_SIGN_UP } from 'src/config/ServiceConfig';
import AccountConfirmationPage from './AccountConfirmationPage';
import { UserRegistrationRequest } from 'src/auth/model/UserRegistrationRequest';
import buildToast from 'src/components/utils/Toast';

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
      .login(username, password)
      .then(() => {
        setAccountConfirmationModalVisible(false);
        navigate('/', { replace: true });
      })
      .catch((err: Error) => {
        setAccountConfirmationModalVisible(false);
        addToast(buildToast(cilWarning, 'Authentication Error', err.message));
      });
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
      addToast(buildToast(cilWarning, 'Sign Up Error', 'Missing user data!'));
      return;
    }

    const registrationReq = new UserRegistrationRequest(
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
        addToast(buildToast(cilWarning, 'Sign Up Error', err.message));
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
                          floatingLabel="Username"
                          placeholder="Username"
                          autoFocus
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
                          floatingLabel="Name"
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
                          floatingLabel="Email Address"
                          placeholder="Email Address"
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
                          floatingLabel="Password"
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
                          floatingLabel="Confirm Password"
                          placeholder="Confirm Password"
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
                          floatingLabel=" "
                          placeholder=""
                          aria-label="Select Gender"
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
