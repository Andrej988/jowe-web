import { CForm, CFormInput } from '@coreui/react';
import React, { useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import AuthService from 'src/auth/AuthService';
import Modal from 'src/components/utils/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
  onChangePasswordErrorHandler: (toastTitle: string, toastMsg: string) => void;
}

const DEFAULT_IS_TOUCHED = false;
const DEFAULT_IS_VALID = false;

const AccountConfirmationPage: React.FC<Props> = (props) => {
  const [isTouched, setIsTouched] = useState(DEFAULT_IS_TOUCHED);
  const [isValid, setIsValid] = useState(DEFAULT_IS_VALID);
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

  /* const validateForm = (value: string): void => {
    if (!isTouched) {
      setIsTouched(true);
    }

    if (value.length <= MAX_LENGTH) {
      setConfirmatioCode(value);
    }
  }; */

  /* const isConfirmationCodeValid = (): boolean => {
    return confirmationCode.length >= 6 && confirmationCode.length <= MAX_LENGTH;
  }; */

  /* useEffect(() => {
    const timer = setTimeout(() => {
      setIsValid(isConfirmationCodeValid());
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [confirmationCode]); */

  const clearForm = (): void => {
    setIsTouched(DEFAULT_IS_TOUCHED);
    setIsValid(DEFAULT_IS_VALID);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    clearForm();
  };

  const onChangePasswordConfirmationHandler = (): void => {
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
    // if (isConfirmationCodeValid()) {
    // console.log('clicked');
    /* AuthService.getInstance()
        .confirmAccount(props.username, confirmationCode)
        .then((a) => {
          props.onConfirmHandler();
        })
        .catch((err: Error) => {
          console.error(err);
          alert(err);
        }); */
    // } else {
    // validateForm('');
    // }
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
          invalid={!isValid && isTouched}
          type="password"
          id="currentPassword"
          autoComplete="current-password"
          label="Current Password"
          value={currentPassword}
          onChange={onCurrentPasswordInputChangeHandler}
          required
          autoFocus
        />
        <CFormInput
          invalid={!isValid && isTouched}
          type="password"
          id="newPassword"
          autoComplete="new-password"
          label="New Password"
          value={newPassword}
          onChange={onNewPasswordInputChangeHandler}
          required
        />
        <CFormInput
          invalid={!isValid && isTouched}
          type="password"
          id="confirmNewPassword"
          autoComplete="confirm-password"
          label="Confirm Password"
          value={confirmPassword}
          onChange={onConfirmaPasswordInputChangeHandler}
          required
        />
      </CForm>
    </Modal>
  );
};

export default AccountConfirmationPage;
