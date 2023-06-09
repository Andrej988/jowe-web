import React, { Fragment, useRef, useState, type RefObject } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CRow,
} from '@coreui/react';
import { cilLockLocked, cilUser, cilWarning } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from 'src/services/auth/AuthService';
import AccountConfirmationPage from './AccountConfirmationPage';
import { UserNotConfirmedError } from 'src/services/auth/errors/AuthenticationErrors';
import ForgotPasswordPage from './ForgotPasswordPage';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import { ToastMsg, toasterActions } from 'src/store/Store';
import { useDispatch } from 'react-redux';

const TOAST_TITLE_LOGIN_FAILURE = 'Authentication Error';
const TOAST_MESSAGE_LOGIN_MISSING_CREDENTIALS = 'Missing credentials!';

const LoginPage: React.FC = () => {
  const usernameRef: RefObject<HTMLInputElement> = useRef(null);
  const passwordRef: RefObject<HTMLInputElement> = useRef(null);
  const [loginButtonDisabled, setLoginButtonDisabled] = useState(false);
  const [accountConfirmationModalVisible, setAccountConfirmationModalVisible] = useState(false);
  const [forgotPasswordModalVisible, setForgotPasswordModalVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const openAccountConfirmationModal = (): void => {
    setAccountConfirmationModalVisible(true);
  };

  const openForgotPasswordModalHandler = (
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ): void => {
    event.preventDefault();
    setForgotPasswordModalVisible(true);
  };

  const closeAccountConfirmationFormHandler = (): void => {
    setAccountConfirmationModalVisible(false);
  };

  const closeForgotPasswordFormHandler = (): void => {
    setForgotPasswordModalVisible(false);
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
        dispatch(
          toasterActions.addMessage(
            new ToastMsg(cilWarning, TOAST_TITLE_LOGIN_FAILURE, err.message),
          ),
        );
      });
  };

  const delayedEnablingOfLoginButton = (delayInMillis: number): void => {
    setTimeout(() => {
      setLoginButtonDisabled(false);
    }, delayInMillis);
  };

  const confirmForgotPasswordHandler = (): void => {
    setForgotPasswordModalVisible(false);
  };

  const loginHandler = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setLoginButtonDisabled(true);

    if (usernameRef.current?.value == null || passwordRef.current?.value == null) {
      dispatch(
        toasterActions.addMessage(
          new ToastMsg(
            cilWarning,
            TOAST_TITLE_LOGIN_FAILURE,
            TOAST_MESSAGE_LOGIN_MISSING_CREDENTIALS,
          ),
        ),
      );
      delayedEnablingOfLoginButton(500);
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
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_LOGIN_FAILURE, err.message),
            ),
          );
        }
        delayedEnablingOfLoginButton(1000);
      });
  };

  return (
    <Fragment>
      <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol sm={10} md={8} lg={6} xl={5}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm className={'needs-validation'} onSubmit={loginHandler}>
                      <h1>Login</h1>
                      <p className="text-medium-emphasis">Sign In to your account.</p>
                      <FormInputGroupWithFeedback
                        icon={cilUser}
                        id="username"
                        type="text"
                        label="Username or Email Address"
                        autoComplete="username"
                        autoFocus
                        required
                        inputRef={usernameRef}
                      />
                      <FormInputGroupWithFeedback
                        className="mt-3"
                        icon={cilLockLocked}
                        id="password"
                        type="password"
                        label="Password"
                        autoComplete="current-password"
                        required
                        inputRef={passwordRef}
                      />
                      <p className="text-medium-emphasis mt-4">
                        <a
                          href="/"
                          onClick={openForgotPasswordModalHandler}
                          style={{ color: 'rgba(44, 56, 74, 0.681)' }}
                        >
                          Forgot Password?
                        </a>
                      </p>
                      <CRow className="justify-content-end">
                        <CCol xs={6}>
                          <CButton
                            color="secondary"
                            className="px-4 float-end"
                            type="submit"
                            disabled={loginButtonDisabled}
                            style={{
                              ...(loginButtonDisabled
                                ? { cursor: 'not-allowed', pointerEvents: 'auto' }
                                : {}),
                            }}
                          >
                            Login
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                    <p className="text-medium-emphasis">
                      Create your Account{' '}
                      <Link to={'/register'} style={{ color: 'rgba(44, 56, 74, 0.681)' }}>
                        here
                      </Link>
                      .
                    </p>
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
      <ForgotPasswordPage
        visible={forgotPasswordModalVisible}
        onCloseHandler={closeForgotPasswordFormHandler}
        onConfirmHandler={confirmForgotPasswordHandler}
      />
    </Fragment>
  );
};

export default LoginPage;
