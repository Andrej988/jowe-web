import { CForm } from '@coreui/react';
import React, { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import AuthService from 'src/services/auth/AuthService';
import Modal from 'src/components/utils/Modal';
import { AWS_CONFIRMATION_CODE_MAX_LENGTH } from 'src/config/ServiceConfig';
import {
  CONFIRMATION_CODE_FEEDBACK,
  EMAIL_FEEDBACK,
  PASSWORD_CONFIRMATION_FEEDBACK,
} from 'src/config/CommonStrings';
import {
  isNotEmpty,
  isPasswordAccordingToPolicy,
  isValidConfirmationCodeLength,
  isValidEmail,
} from 'src/services/utils/Validators';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import {
  cilDialpad,
  cilEnvelopeClosed,
  cilLockLocked,
  cilLockUnlocked,
  cilWarning,
} from '@coreui/icons';
import { useDispatch } from 'react-redux';
import { ToastMsg, toasterActions } from 'src/store/Store';
import { type PasswordValidationResult } from 'src/services/auth/PasswordPolicy';

interface Props {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
}

interface FormState {
  primaryButtonText: string;
  emailDisabled: boolean;
  confirmationCodeDisabled: boolean;
  newPasswordDisabled: boolean;
  passwordConfirmationDisabled: boolean;
}

interface FormValidityState {
  emailValid: boolean;
  confirmationCodeValid: boolean;
  newPasswordValid: boolean;
  confirmPasswordMatch: boolean;
}

const STATE_INIT: FormState = {
  primaryButtonText: 'Send Confirmation Code',
  emailDisabled: false,
  confirmationCodeDisabled: true,
  newPasswordDisabled: true,
  passwordConfirmationDisabled: true,
};

const STATE_CODE_SENT: FormState = {
  primaryButtonText: 'Confirm',
  emailDisabled: true,
  confirmationCodeDisabled: false,
  newPasswordDisabled: false,
  passwordConfirmationDisabled: false,
};

const DEFAULT_IS_VALIDATED = false;
const DEFAULT_FORM_VALIDITY_STATE: FormValidityState = {
  emailValid: false,
  confirmationCodeValid: false,
  newPasswordValid: false,
  confirmPasswordMatch: false,
};

const TOAST_TITLE_SUCCESS = 'Forgot Password';
const TOAST_TITLE_FAILURE = 'Forgot Password Error';
const TOAST_MESSAGE_VERIFICATION_CODE_SENT = 'Verification code was sent to your email address.';
const TOAST_MESSAGE_FLOW_SUCCESSFUL =
  'New password was successfully set. Please login with new password.';

const ForgotPasswordPage: React.FC<Props> = (props) => {
  const [formState, setFormState] = useState<FormState>(STATE_INIT);
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );
  const [passwordValidationResult, setPasswordValidationResult] = useState<
    PasswordValidationResult | undefined
  >(undefined);
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [confirmationCode, setConfirmatioCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const onEmailChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const onConfirmationCodeInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setConfirmatioCode(event.target.value);
  };

  const onPasswordChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setPassword(event.target.value);
  };

  const onPasswordConfirmationChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setPasswordConfirmation(event.target.value);
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
  }, [email, confirmationCode, password, passwordConfirmation, isValidated]);

  const validateForm = (): boolean => {
    const emailValid = isNotEmpty(email) && isValidEmail(email);
    let confirmationCodeValid = true;
    let newPasswordValid = true;
    let confirmPasswordValid = true;

    if (formState === STATE_CODE_SENT) {
      confirmationCodeValid = isValidConfirmationCodeLength(confirmationCode);
      const newPasswordValidationResult = isPasswordAccordingToPolicy(password);
      setPasswordValidationResult(newPasswordValidationResult);
      newPasswordValid = newPasswordValidationResult.result;
      confirmPasswordValid = isNotEmpty(passwordConfirmation) && passwordConfirmation === password;
    }

    setIsValidated(true);
    setFormValidityState({
      emailValid,
      confirmationCodeValid,
      newPasswordValid,
      confirmPasswordMatch: confirmPasswordValid,
    });

    return emailValid && confirmationCodeValid && newPasswordValid && confirmPasswordValid;
  };

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    resetForm();
  };

  const resetForm = (): void => {
    setTimeout(() => {
      setFormState(STATE_INIT);
      setIsValidated(DEFAULT_IS_VALIDATED);
      setFormValidityState(DEFAULT_FORM_VALIDITY_STATE);
      setEmail('');
      setConfirmatioCode('');
      setPassword('');
      setPasswordConfirmation('');
    }, 500);
  };

  const onConfirmHandler = (): void => {
    const isFormValid = validateForm();

    if (isFormValid) {
      if (formState === STATE_INIT) {
        AuthService.getInstance()
          .initForgotPasswordFlow(email)
          .then(() => {
            dispatch(
              toasterActions.addMessage(
                new ToastMsg(
                  cilEnvelopeClosed,
                  TOAST_TITLE_SUCCESS,
                  TOAST_MESSAGE_VERIFICATION_CODE_SENT,
                ),
              ),
            );
            setFormState(STATE_CODE_SENT);
            setIsValidated(false);
          })
          .catch((err) => {
            console.log(err);
            dispatch(
              toasterActions.addMessage(new ToastMsg(cilWarning, TOAST_TITLE_FAILURE, err.message)),
            );
          });
      } else {
        AuthService.getInstance()
          .completeForgotPasswordFlow(email, confirmationCode, password)
          .then(() => {
            props.onConfirmHandler();
            dispatch(
              toasterActions.addMessage(
                new ToastMsg(cilLockUnlocked, TOAST_TITLE_SUCCESS, TOAST_MESSAGE_FLOW_SUCCESSFUL),
              ),
            );
            resetForm();
          })
          .catch((err) => {
            console.error(err);
            dispatch(
              toasterActions.addMessage(new ToastMsg(cilWarning, TOAST_TITLE_FAILURE, err.message)),
            );
          });
      }
    }
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onConfirmHandler();
  };

  return (
    <Modal
      title="Forgot Password"
      visible={props.visible}
      primaryButtonText={formState.primaryButtonText}
      primaryButtonHandler={onConfirmHandler}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonColor="danger"
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm onSubmit={onSubmitHandler}>
        <FormInputGroupWithFeedback
          icon={cilEnvelopeClosed}
          id="email"
          type="email"
          label="Email Address"
          autoComplete="email"
          value={email}
          onChange={onEmailChangeHandler}
          disabled={formState.emailDisabled}
          required
          autoFocus
          feedbackMsg={EMAIL_FEEDBACK}
          invalid={isValidated && !formValidtyState.emailValid}
          showValidIndicator={isValidated}
        />
        <FormInputGroupWithFeedback
          icon={cilDialpad}
          className="mt-3"
          id="confirmationNumber"
          type="text"
          label="Verification Code"
          autoComplete="verification-code"
          value={confirmationCode}
          maxLength={AWS_CONFIRMATION_CODE_MAX_LENGTH}
          onChange={onConfirmationCodeInputChangeHandler}
          disabled={formState.confirmationCodeDisabled}
          feedbackMsg={CONFIRMATION_CODE_FEEDBACK}
          invalid={isValidated && !formValidtyState.confirmationCodeValid}
        />
        <FormInputGroupWithFeedback
          icon={cilLockLocked}
          className="mt-3"
          id="newPassword"
          type="password"
          label="New Password"
          autoComplete="new-password"
          value={password}
          onChange={onPasswordChangeHandler}
          disabled={formState.newPasswordDisabled}
          feedbackPaswordPolicy={true}
          invalid={isValidated && !formValidtyState.newPasswordValid}
          showValidIndicator={isValidated}
          passwordValidationResults={passwordValidationResult}
        />
        <FormInputGroupWithFeedback
          icon={cilLockLocked}
          className="mt-3"
          id="confirmNewPassword"
          type="password"
          label="Confirm Password"
          autoComplete="confirm-password"
          value={passwordConfirmation}
          onChange={onPasswordConfirmationChangeHandler}
          disabled={formState.passwordConfirmationDisabled}
          feedbackMsg={PASSWORD_CONFIRMATION_FEEDBACK}
          invalid={isValidated && !formValidtyState.confirmPasswordMatch}
          showValidIndicator={isValidated}
        />
      </CForm>
    </Modal>
  );
};

export default ForgotPasswordPage;
