import React, {
  type ChangeEvent,
  Fragment,
  useRef,
  useState,
  type ReactElement,
  useEffect,
} from 'react';
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
import {
  ALLOW_SIGN_UP,
  NAME_MAX_LENGTH,
  NAME_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
} from 'src/config/ServiceConfig';
import {
  EMAIL_FEEDBACK,
  NAME_FEEDBACK,
  PASSWORD_CONFIRMATION_FEEDBACK,
  USERNAME_FEEDBACK,
} from 'src/config/CommonStrings';
import AccountConfirmationPage from './AccountConfirmationPage';
import { UserRegistrationRequest } from 'src/auth/model/UserRegistrationRequest';
import buildToast from 'src/components/utils/Toast';
import {
  isCorrectLength,
  isNotEmpty,
  isPasswordAccordingToPolicy,
  isValidEmail,
} from 'src/utils/Validators';
import PasswordPolicyFeedback from 'src/components/utils/PasswordPolicyFeedback';

interface FormValidityState {
  usernameValid: boolean;
  emailValid: boolean;
  nameValid: boolean;
  passwordValid: boolean;
  confirmPasswordMatch: boolean;
  genderValid: boolean;
}

const INITIAL_FORM_VALIDITY_STATE: FormValidityState = {
  usernameValid: false,
  emailValid: false,
  nameValid: false,
  passwordValid: false,
  confirmPasswordMatch: false,
  genderValid: false,
};

const allowSignUp = ALLOW_SIGN_UP;
const NOT_AVAILABLE = 'N/A';

const RegisterPage: React.FC = () => {
  const [accountConfirmationModalVisible, setAccountConfirmationModalVisible] = useState(false);
  const navigate = useNavigate();
  const [toast, addToast] = useState<ReactElement | undefined>();
  const toaster = useRef<HTMLDivElement | null>(null);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState(NOT_AVAILABLE);

  const [isValidated, setIsValidated] = useState(false);
  const [formValidityState, setFormValidityState] = useState<FormValidityState>(
    INITIAL_FORM_VALIDITY_STATE,
  );

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

  const onUsernameInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
  };

  const onNameInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const onEmailInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const onPasswordInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const onPasswordConfirmationInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(event.target.value);
  };

  const onGenderSelectChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setGender(event.target.value);
  };

  const validateForm = (): boolean => {
    const usernameValid = isCorrectLength(username, USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH);
    const nameValid = isCorrectLength(name, NAME_MIN_LENGTH, NAME_MAX_LENGTH);
    const emailValid = isValidEmail(email);
    const passwordValid = isPasswordAccordingToPolicy(password);
    const confirmPasswordMatch = isNotEmpty(confirmPassword) && confirmPassword === password;
    const genderValid = gender !== NOT_AVAILABLE;

    setIsValidated(true);
    setFormValidityState({
      usernameValid,
      emailValid,
      nameValid,
      passwordValid,
      confirmPasswordMatch,
      genderValid,
    });

    return (
      usernameValid &&
      nameValid &&
      emailValid &&
      passwordValid &&
      confirmPasswordMatch &&
      genderValid
    );
  };

  useEffect(() => {
    if (isValidated) {
      const timerId = setTimeout(() => {
        validateForm();
      }, 250);

      // Cleanup
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [username, name, email, password, confirmPassword, gender, isValidated]);

  const signupHandler = (event: React.ChangeEvent<HTMLFormElement>): void => {
    event.preventDefault();

    const isValidForm = validateForm();

    if (isValidForm) {
      const registrationRequest = new UserRegistrationRequest(
        username,
        name,
        email,
        password,
        gender,
      );

      AuthService.getInstance()
        .signUp(registrationRequest)
        .then((username: string) => {
          setUsername(username);
          setPassword(registrationRequest.password);
          openAccountConfirmationModal();
        })
        .catch((err: Error) => {
          addToast(buildToast(cilWarning, 'Sign Up Error', err.message));
        });
    }
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
                    <CForm className={'needs-validation'} onSubmit={signupHandler} noValidate>
                      <h1>Sign Up</h1>
                      <p className="text-medium-emphasis">Sign up for an account.</p>
                      {!allowSignUp && (
                        <p style={{ color: 'red' }}>Sorry sign up is currently not allowed.</p>
                      )}
                      <CInputGroup>
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          invalid={isValidated && !formValidityState.usernameValid}
                          type="text"
                          id="username"
                          floatingLabel="Username"
                          placeholder="Username"
                          autoFocus
                          autoComplete="username"
                          required
                          disabled={!allowSignUp}
                          value={username}
                          onChange={onUsernameInputChange}
                        />
                      </CInputGroup>
                      {isValidated && !formValidityState.usernameValid && (
                        <div className="invalid-feedback" style={{ display: 'block' }}>
                          <p>{USERNAME_FEEDBACK}</p>
                        </div>
                      )}
                      <CInputGroup className="mt-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          invalid={isValidated && !formValidityState.nameValid}
                          type="text"
                          id="name"
                          floatingLabel="Name"
                          placeholder="Name"
                          autoComplete="name"
                          required
                          disabled={!allowSignUp}
                          value={name}
                          onChange={onNameInputChange}
                        />
                      </CInputGroup>
                      {isValidated && !formValidityState.nameValid && (
                        <div className="invalid-feedback" style={{ display: 'block' }}>
                          <p>{NAME_FEEDBACK}</p>
                        </div>
                      )}
                      <CInputGroup className="mt-3">
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          invalid={isValidated && !formValidityState.emailValid}
                          type="email"
                          id="email"
                          floatingLabel="Email Address"
                          placeholder="Email Address"
                          autoComplete="email"
                          required
                          disabled={!allowSignUp}
                          value={email}
                          onChange={onEmailInputChange}
                        />
                      </CInputGroup>
                      {isValidated && !formValidityState.emailValid && (
                        <div className="invalid-feedback" style={{ display: 'block' }}>
                          <p>{EMAIL_FEEDBACK}</p>
                        </div>
                      )}
                      <CInputGroup className="mt-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          invalid={isValidated && !formValidityState.passwordValid}
                          id="password"
                          type="password"
                          floatingLabel="Password"
                          placeholder="Password"
                          autoComplete="current-password"
                          required
                          disabled={!allowSignUp}
                          value={password}
                          onChange={onPasswordInputChange}
                        />
                      </CInputGroup>
                      {isValidated && !formValidityState.passwordValid && (
                        <PasswordPolicyFeedback invalid={true} />
                      )}
                      <CInputGroup className="mt-3">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          invalid={isValidated && !formValidityState.confirmPasswordMatch}
                          id="password-confirmation"
                          type="password"
                          floatingLabel="Confirm Password"
                          placeholder="Confirm Password"
                          autoComplete="current-password-confirmation"
                          required
                          disabled={!allowSignUp}
                          value={confirmPassword}
                          onChange={onPasswordConfirmationInputChange}
                        />
                      </CInputGroup>
                      {isValidated && !formValidityState.confirmPasswordMatch && (
                        <div className="invalid-feedback" style={{ display: 'block' }}>
                          <p>{PASSWORD_CONFIRMATION_FEEDBACK}</p>
                        </div>
                      )}
                      <CInputGroup className="mt-3">
                        <CInputGroupText>
                          <CIcon icon={cilPeople} />
                        </CInputGroupText>
                        <CFormSelect
                          invalid={isValidated && !formValidityState.genderValid}
                          floatingLabel=" "
                          placeholder=""
                          aria-label="Select Gender"
                          disabled={!allowSignUp}
                          value={gender}
                          onChange={onGenderSelectChange}
                        >
                          <option value={NOT_AVAILABLE}>Select</option>
                          <option value="Female">Female</option>
                          <option value="Male">Male</option>
                        </CFormSelect>
                      </CInputGroup>
                      {isValidated && !formValidityState.genderValid && (
                        <div className="invalid-feedback" style={{ display: 'block' }}>
                          <p>Please select a valid gender.</p>
                        </div>
                      )}
                      <p className="text-medium-emphasis mt-2">
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
