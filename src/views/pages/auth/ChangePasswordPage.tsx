import { cilLockLocked, cilSettings, cilWarning } from '@coreui/icons';
import { CForm } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import type { ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import AuthService from 'src/auth/AuthService';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import Modal from 'src/components/utils/Modal';
import PasswordPolicyFeedback from 'src/components/utils/PasswordPolicyFeedback';
import {
  CURRENT_PASSWORD_MISSING,
  PASSWORD_CONFIRMATION_FEEDBACK,
  PASSWORD_POLICY_FEEDBACK,
} from 'src/config/CommonStrings';
import { ToastMsg, toasterActions } from 'src/store/Store';
import { isNotEmpty, isPasswordAccordingToPolicy } from 'src/utils/Validators';

interface Props {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
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

const TOAST_TITLE_CHANGE_PASSWORD_SUCCESSFUL = 'Change Password';
const TOAST_TITLE_CHANGE_PASSWORD_FAILURE = 'Change Password Error';
const TOAST_MESSAGE_CHANGE_PASSWORD_SUCCESFUL = 'Your password was changed successfully.';

const ChangePasswordPage: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );
  const dispatch = useDispatch();

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
    const currentPasswordValid = isNotEmpty(currentPassword);
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

  const clearFormWithSlightTimeout = (): void => {
    setTimeout(() => {
      clearForm();
    }, 250);
  };

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    clearFormWithSlightTimeout();
  };

  const onChangePasswordConfirmationHandler = (): void => {
    const isFormValid = validateForm();

    if (isFormValid) {
      AuthService.getInstance()
        .changePassword(currentPassword, newPassword)
        .then(() => {
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(
                cilSettings,
                TOAST_TITLE_CHANGE_PASSWORD_SUCCESSFUL,
                TOAST_MESSAGE_CHANGE_PASSWORD_SUCCESFUL,
              ),
            ),
          );
          props.onConfirmHandler();
          clearFormWithSlightTimeout();
        })
        .catch((err) => {
          console.error(err);
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_CHANGE_PASSWORD_FAILURE, err.message),
            ),
          );
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
        <FormInputGroupWithFeedback
          icon={cilLockLocked}
          id="currentPassword"
          type="password"
          label="Current Password"
          autoComplete="current-password"
          value={currentPassword}
          onChange={onCurrentPasswordInputChangeHandler}
          feedbackMsg={CURRENT_PASSWORD_MISSING}
          required
          autoFocus
          invalid={isValidated && !formValidtyState.currentPasswordValid}
        />
        <FormInputGroupWithFeedback
          className="mt-3"
          icon={cilLockLocked}
          id="newPassword"
          type="password"
          label="New Password"
          autoComplete="new-password"
          value={newPassword}
          onChange={onNewPasswordInputChangeHandler}
          feedbackMsg={PASSWORD_POLICY_FEEDBACK}
          required
          invalid={isValidated && !formValidtyState.newPasswordValid}
          showValidIndicator={isValidated}
        />
        <FormInputGroupWithFeedback
          className="mt-3"
          icon={cilLockLocked}
          id="confirmNewPassword"
          type="password"
          label="Confirm Password"
          autoComplete="confirm-password"
          value={confirmPassword}
          onChange={onConfirmaPasswordInputChangeHandler}
          feedbackMsg={PASSWORD_CONFIRMATION_FEEDBACK}
          required
          invalid={isValidated && !formValidtyState.confirmPasswordMatch}
          showValidIndicator={isValidated}
        />
        <PasswordPolicyFeedback invalid={false} className="mt-4" />
      </CForm>
    </Modal>
  );
};

export default ChangePasswordPage;
