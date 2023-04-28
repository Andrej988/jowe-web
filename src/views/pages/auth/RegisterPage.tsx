import React, { type ChangeEvent, Fragment, useState, useEffect } from 'react';
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
import { cilEnvelopeClosed, cilLockLocked, cilPeople, cilUser, cilWarning } from '@coreui/icons';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from 'src/services/auth/AuthService';
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
import { UserRegistrationRequest } from 'src/services/auth/model/UserRegistrationRequest';
import {
  isCorrectLength,
  isNotEmpty,
  isPasswordAccordingToPolicy,
  isValidEmail,
} from 'src/services/utils/Validators';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import FormSelectGroupWithFeedback from 'src/components/utils/FormSelectGroupWithFeedback';
import { useDispatch } from 'react-redux';
import { ToastMsg, toasterActions } from 'src/store/Store';
import { type PasswordValidationResult } from 'src/services/auth/PasswordPolicy';

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

const TOAST_TITLE_SIGNUP_FAILURE = 'Sign Up Error';
const TOAST_TITLE_LOGIN_FAILURE = 'Authentication Error';

const RegisterPage: React.FC = () => {
  const [accountConfirmationModalVisible, setAccountConfirmationModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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

  const [passwordValidationResult, setPasswordValidationResult] = useState<
    PasswordValidationResult | undefined
  >(undefined);

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
        dispatch(
          toasterActions.addMessage(
            new ToastMsg(cilWarning, TOAST_TITLE_LOGIN_FAILURE, err.message),
          ),
        );
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

    setPasswordValidationResult(passwordValid);
    setIsValidated(true);
    setFormValidityState({
      usernameValid,
      emailValid,
      nameValid,
      passwordValid: passwordValid.result,
      confirmPasswordMatch,
      genderValid,
    });

    return (
      usernameValid &&
      nameValid &&
      emailValid &&
      passwordValid.result &&
      confirmPasswordMatch &&
      genderValid
    );
  };

  useEffect(() => {
    if (isValidated) {
      const timerId = setTimeout(() => {
        validateForm();
      }, 125);

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
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_SIGNUP_FAILURE, err.message),
            ),
          );
        });
    }
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
                    <CForm className={'needs-validation'} onSubmit={signupHandler} noValidate>
                      <h1>Sign Up</h1>
                      <p className="text-medium-emphasis">Sign up for an account.</p>
                      {!allowSignUp && (
                        <p style={{ color: 'red' }}>Sorry sign up is currently not allowed.</p>
                      )}
                      <FormInputGroupWithFeedback
                        icon={cilUser}
                        id="username"
                        type="text"
                        label="Username"
                        autoComplete="username"
                        required
                        disabled={!allowSignUp}
                        value={username}
                        onChange={onUsernameInputChange}
                        invalid={isValidated && !formValidityState.usernameValid}
                        autoFocus
                        feedbackMsg={USERNAME_FEEDBACK}
                        showValidIndicator={isValidated}
                      />
                      <FormInputGroupWithFeedback
                        className="mt-3"
                        icon={cilUser}
                        id="name"
                        type="text"
                        label="Name"
                        autoComplete="name"
                        required
                        disabled={!allowSignUp}
                        value={name}
                        onChange={onNameInputChange}
                        invalid={isValidated && !formValidityState.nameValid}
                        feedbackMsg={NAME_FEEDBACK}
                        showValidIndicator={isValidated}
                      />
                      <FormInputGroupWithFeedback
                        className="mt-3"
                        icon={cilEnvelopeClosed}
                        id="email"
                        type="email"
                        label="Email Address"
                        autoComplete="email"
                        required
                        disabled={!allowSignUp}
                        value={email}
                        onChange={onEmailInputChange}
                        invalid={isValidated && !formValidityState.emailValid}
                        feedbackMsg={EMAIL_FEEDBACK}
                        showValidIndicator={isValidated}
                      />
                      <FormInputGroupWithFeedback
                        className="mt-3"
                        icon={cilLockLocked}
                        id="password"
                        type="password"
                        label="Password"
                        autoComplete="password"
                        required
                        disabled={!allowSignUp}
                        value={password}
                        onChange={onPasswordInputChange}
                        invalid={isValidated && !formValidityState.passwordValid}
                        feedbackPaswordPolicy={true}
                        showValidIndicator={isValidated}
                        passwordValidationResults={passwordValidationResult}
                      />
                      <FormInputGroupWithFeedback
                        className="mt-3"
                        icon={cilLockLocked}
                        id="password-confirmation"
                        type="password"
                        label="Confirm Password"
                        autoComplete="password-confirmation"
                        required
                        disabled={!allowSignUp}
                        value={confirmPassword}
                        onChange={onPasswordConfirmationInputChange}
                        invalid={isValidated && !formValidityState.confirmPasswordMatch}
                        feedbackMsg={PASSWORD_CONFIRMATION_FEEDBACK}
                        showValidIndicator={isValidated}
                      />
                      <FormSelectGroupWithFeedback
                        className="mt-3"
                        icon={cilPeople}
                        id="gender"
                        label="Gender"
                        feedbackMsg="Please select a gender."
                        value={gender}
                        onChange={onGenderSelectChange}
                        defaultValue={NOT_AVAILABLE}
                        options={[
                          { label: 'Gender', value: NOT_AVAILABLE, disabled: true },
                          { label: 'Female', value: 'Female' },
                          { label: 'Male', value: 'Male' },
                        ]}
                        invalid={isValidated && !formValidityState.genderValid}
                        disabled={!allowSignUp}
                        showValidIndicator={isValidated}
                      />
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
        sendToastVerificationCodeSent={true}
        onCloseHandler={closeAccountConfirmationFormHandler}
        onSaveHandler={confirmAccountHandler}
      />
    </Fragment>
  );
};

export default RegisterPage;
