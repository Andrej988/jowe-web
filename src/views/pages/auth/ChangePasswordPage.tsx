import { CForm, CFormInput } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import AuthService from 'src/auth/AuthService';
import Modal from 'src/components/utils/Modal';
import PasswordPolicyFeedback from 'src/components/utils/PasswordPolicyFeedback';
import { PASSWORD_CONFIRMATION_FEEDBACK, PASSWORD_POLICY_FEEDBACK } from 'src/config/CommonStrings';
import { isAtLeastXCharsLong, isNotEmpty, isPasswordAccordingToPolicy } from 'src/utils/Validators';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
  onChangePasswordErrorHandler: (toastTitle: string, toastMsg: string) => void;
}

interface FormValidityState {
  currentPasswordValid: boolean;
  newPasswordValid: boolean;
  confirmPasswordMatch: boolean;
}

const DEFAULT_IS_VALIDATED = false;
const DEFAULT_FORM_VALIDITY_STATE: FormValidityState = {
  currentPasswordValid: false,
  newPasswordValid: false,
  confirmPasswordMatch: false,
};

const ChangePasswordPage: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const onCurrentPasswordInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setCurrentPassword(event.target.value);
  };

  const onNewPasswordInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(event.target.value);
  };

  const onConfirmaPasswordInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(event.target.value);
  };

  const validateForm = (): boolean => {
    const currentPasswordValid =
      isNotEmpty(currentPassword) && isAtLeastXCharsLong(currentPassword, 8);
    const newPasswordValid = isPasswordAccordingToPolicy(newPassword);
    const confirmPasswordValid = isNotEmpty(confirmPassword) && newPassword === confirmPassword;

    setIsValidated(true);
    setFormValidityState({
      currentPasswordValid,
      newPasswordValid,
      confirmPasswordMatch: confirmPasswordValid,
    });

    return currentPasswordValid && newPasswordValid && confirmPasswordValid;
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
  }, [currentPassword, newPassword, confirmPassword, isValidated]);

  const clearForm = (): void => {
    setIsValidated(DEFAULT_IS_VALIDATED);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFormValidityState(DEFAULT_FORM_VALIDITY_STATE);
  };

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    clearForm();
  };

  const onChangePasswordConfirmationHandler = (): void => {
    const isFormValid = validateForm();

    if (isFormValid) {
      AuthService.getInstance()
        .changePassword(currentPassword, newPassword)
        .then(() => {
          props.onConfirmHandler();
          clearForm();
        })
        .catch((err) => {
          console.error(err);
          props.onChangePasswordErrorHandler('Change Password Error', err.message);
        });
    }
  };

  return (
    <Modal
      title="Change Password"
      visible={props.visible}
      primaryButtonText="Confirm"
      primaryButtonHandler={onChangePasswordConfirmationHandler}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonColor="danger"
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm>
        <CFormInput
          invalid={isValidated && !formValidtyState.currentPasswordValid}
          type="password"
          id="currentPassword"
          autoComplete="current-password"
          floatingLabel="Current Password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={onCurrentPasswordInputChangeHandler}
          feedback={PASSWORD_POLICY_FEEDBACK}
          required
          autoFocus
        />

        <CFormInput
          className="mt-3"
          invalid={isValidated && !formValidtyState.newPasswordValid}
          type="password"
          id="newPassword"
          autoComplete="new-password"
          floatingLabel="New Password"
          placeholder="New Password"
          value={newPassword}
          onChange={onNewPasswordInputChangeHandler}
          feedback={PASSWORD_POLICY_FEEDBACK}
          required
        />
        <CFormInput
          className="mt-3"
          invalid={isValidated && !formValidtyState.confirmPasswordMatch}
          type="password"
          id="confirmNewPassword"
          autoComplete="confirm-password"
          floatingLabel="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmaPasswordInputChangeHandler}
          feedback={PASSWORD_CONFIRMATION_FEEDBACK}
          required
        />
        <PasswordPolicyFeedback invalid={false} className="mt-4" />
      </CForm>
    </Modal>
  );
};

export default ChangePasswordPage;
