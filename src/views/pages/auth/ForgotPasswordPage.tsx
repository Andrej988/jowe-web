import { CForm, CFormInput } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import AuthService from 'src/auth/AuthService';
import Modal from 'src/components/utils/Modal';
import { AWS_CONFIRMATION_CODE_MAX_LENGTH } from 'src/config/ServiceConfig';
import {
  CONFIRMATION_CODE_FEEDBACK,
  EMAIL_FEEDBACK,
  PASSWORD_CONFIRMATION_FEEDBACK,
  PASSWORD_POLICY_FEEDBACK,
} from 'src/config/CommonStrings';
import {
  isNotEmpty,
  isPasswordAccordingToPolicy,
  isValidConfirmationCodeLength,
  isValidEmail,
} from 'src/utils/Validators';
import PasswordPolicyFeedback from 'src/components/utils/PasswordPolicyFeedback';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
  onForgotPasswordErrorHandler: (toastTitle: string, toastMsg: string) => void;
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

const ForgotPasswordPage: React.FC<Props> = (props) => {
  const [formState, setFormState] = useState<FormState>(STATE_INIT);
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );

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
      newPasswordValid = isPasswordAccordingToPolicy(password);
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
          .initForgotPasswordFlos(email)
          .then(() => {
            setFormState(STATE_CODE_SENT);
            setIsValidated(false);
          })
          .catch((err) => {
            console.log(err);
            props.onForgotPasswordErrorHandler('Forgot Password Error', err.message);
          });
      } else {
        AuthService.getInstance()
          .completeForgotPasswordFlow(email, confirmationCode, password)
          .then(() => {
            props.onConfirmHandler();
            resetForm();
          })
          .catch((err) => {
            console.error(err);
            props.onForgotPasswordErrorHandler('Forgot Password Error', err.message);
          });
      }
    }
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
      <CForm>
        <CFormInput
          invalid={isValidated && !formValidtyState.emailValid}
          type="email"
          id="Email"
          autoComplete="email"
          floatingLabel="Email Address"
          placeholder="Email Address"
          value={email}
          onChange={onEmailChangeHandler}
          disabled={formState.emailDisabled}
          feedback={EMAIL_FEEDBACK}
          required
          autoFocus
        />
        <CFormInput
          className="mt-3"
          invalid={isValidated && !formValidtyState.confirmationCodeValid}
          type="text"
          id="confirmationNumber"
          autoComplete="confirmationNumber"
          floatingLabel="Verification code"
          placeholder="Confirmation code"
          value={confirmationCode}
          maxLength={AWS_CONFIRMATION_CODE_MAX_LENGTH}
          onChange={onConfirmationCodeInputChangeHandler}
          disabled={formState.confirmationCodeDisabled}
          feedback={CONFIRMATION_CODE_FEEDBACK}
        />
        <CFormInput
          className="mt-3"
          invalid={isValidated && !formValidtyState.newPasswordValid}
          type="password"
          id="newPassword"
          autoComplete="newPassword"
          floatingLabel="New Password"
          placeholder="New Password"
          value={password}
          onChange={onPasswordChangeHandler}
          disabled={formState.newPasswordDisabled}
          feedback={PASSWORD_POLICY_FEEDBACK}
        />
        <CFormInput
          className="mt-3"
          invalid={isValidated && !formValidtyState.confirmPasswordMatch}
          type="password"
          id="confirmNewPassword"
          autoComplete="confirmNewPassword"
          floatingLabel="Confirm Password"
          placeholder="Confirm Password"
          value={passwordConfirmation}
          onChange={onPasswordConfirmationChangeHandler}
          disabled={formState.passwordConfirmationDisabled}
          feedback={PASSWORD_CONFIRMATION_FEEDBACK}
        />
        {formState === STATE_CODE_SENT && (
          <PasswordPolicyFeedback invalid={false} className="mt-4" />
        )}
      </CForm>
    </Modal>
  );
};

export default ForgotPasswordPage;
