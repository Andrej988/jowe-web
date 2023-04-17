import { CForm, CFormFeedback, CFormInput } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import AuthService from 'src/auth/AuthService';
import Modal from 'src/components/utils/Modal';
import { PASSWORD_RULES_STRING } from 'src/config/ServiceConfig';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
  onChangePasswordErrorHandler: (toastTitle: string, toastMsg: string) => void;
}

const isFilled = (value: string): boolean => {
  return value.trim() !== '';
};

const isAtLeastXCharsLong = (value: string, numOfChars: number): boolean => {
  return value.trim().length >= numOfChars;
};

interface FormValidtyDetails {
  currentPasswordValid: boolean;
  newPasswordValid: boolean;
  confirmPasswordMatch: boolean;
}

const PASSWORD_MATCH_STRING = 'Please check if password is according to the password rules below';
const DEFAULT_IS_VALIDATED = false;
const DEFAULT_FORM_VALIDITY_STATE: FormValidtyDetails = {
  currentPasswordValid: false,
  newPasswordValid: false,
  confirmPasswordMatch: false,
};

const ChangePasswordPage: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [formValidtyDetails, setFormValidityDetails] = useState<FormValidtyDetails>(
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

  const validateForm = (): void => {
    setIsValidated(true);

    const currentPasswordValid =
      isFilled(currentPassword) && isAtLeastXCharsLong(currentPassword, 8);
    const newPasswordValid = isFilled(newPassword) && isAtLeastXCharsLong(newPassword, 8);
    const confirmPasswordValid = isFilled(confirmPassword) && newPassword === confirmPassword;

    setFormValidityDetails({
      currentPasswordValid,
      newPasswordValid,
      confirmPasswordMatch: confirmPasswordValid,
    });
  };

  useEffect(() => {
    console.log(isValidated);
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

  const isFormValid = (): boolean => {
    return (
      formValidtyDetails.currentPasswordValid &&
      formValidtyDetails.newPasswordValid &&
      formValidtyDetails.confirmPasswordMatch
    );
  };

  const clearForm = (): void => {
    setIsValidated(DEFAULT_IS_VALIDATED);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setFormValidityDetails(DEFAULT_FORM_VALIDITY_STATE);
  };

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    clearForm();
  };

  const onChangePasswordConfirmationHandler = (): void => {
    validateForm();
    if (isFormValid()) {
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
          invalid={isValidated && !formValidtyDetails.currentPasswordValid}
          type="password"
          id="currentPassword"
          autoComplete="current-password"
          floatingLabel="Current Password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={onCurrentPasswordInputChangeHandler}
          feedback={PASSWORD_MATCH_STRING}
          required
          autoFocus
        />

        <CFormInput
          className="mt-3"
          invalid={
            isValidated &&
            (!formValidtyDetails.newPasswordValid || !formValidtyDetails.confirmPasswordMatch)
          }
          type="password"
          id="newPassword"
          autoComplete="new-password"
          floatingLabel="New Password"
          placeholder="New Password"
          value={newPassword}
          onChange={onNewPasswordInputChangeHandler}
          feedback={PASSWORD_MATCH_STRING}
          required
        />
        <CFormInput
          className="mt-3"
          invalid={isValidated && !formValidtyDetails.confirmPasswordMatch}
          type="password"
          id="confirmNewPassword"
          autoComplete="confirm-password"
          floatingLabel="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmaPasswordInputChangeHandler}
          feedback="New password must be according to rules and confirmation must match new password."
          required
        />
        <CFormFeedback className="mt-4">{PASSWORD_RULES_STRING}</CFormFeedback>
      </CForm>
    </Modal>
  );
};

export default ChangePasswordPage;
