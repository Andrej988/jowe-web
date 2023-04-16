import { CForm, CFormInput } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
}

const MAX_LENGTH = 10;
const DEFAULT_VALUE_IS_TOUCHED = false;
const DEFAULT_VALUE_IS_VALID = false;
const DEFAULT_VALUE = '';

const AccountConfirmationPage: React.FC<Props> = (props) => {
  const [isTouched, setIsTouched] = useState(DEFAULT_VALUE_IS_TOUCHED);
  const [isValid, setIsValid] = useState(DEFAULT_VALUE_IS_VALID);
  const [confirmationCode, setConfirmatioCode] = useState<string>(DEFAULT_VALUE);

  const onConfirmationCodeInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    validateForm(event.target.value);
  };

  const validateForm = (value: string): void => {
    if (!isTouched) {
      setIsTouched(true);
    }

    if (value.length <= MAX_LENGTH) {
      setConfirmatioCode(value);
    }
  };

  const isConfirmationCodeValid = (): boolean => {
    return confirmationCode.length >= 6 && confirmationCode.length <= MAX_LENGTH;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsValid(isConfirmationCodeValid());
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [confirmationCode]);

  const clearForm = (): void => {
    setIsTouched(DEFAULT_VALUE_IS_TOUCHED);
    setIsValid(DEFAULT_VALUE_IS_VALID);
    setConfirmatioCode(DEFAULT_VALUE);
  };

  const onCloseFormHandler = (): void => {
    clearForm();
    props.onCloseHandler();
  };

  const onChangePasswordConfirmationHandler = (): void => {
    if (isConfirmationCodeValid()) {
      console.log('clicked');
      /* AuthService.getInstance()
        .confirmAccount(props.username, confirmationCode)
        .then((a) => {
          props.onConfirmHandler();
        })
        .catch((err: Error) => {
          console.error(err);
          alert(err);
        }); */
    } else {
      validateForm('');
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
          invalid={!isValid && isTouched}
          type="password"
          id="currentPassword"
          label="Current Password"
          value={confirmationCode}
          maxLength={MAX_LENGTH}
          onChange={onConfirmationCodeInputChangeHandler}
          required
          autoFocus
        />
        <CFormInput
          invalid={!isValid && isTouched}
          type="password"
          id="newPassword"
          label="New Password"
          value={confirmationCode}
          maxLength={MAX_LENGTH}
          onChange={onConfirmationCodeInputChangeHandler}
          required
        />
        <CFormInput
          invalid={!isValid && isTouched}
          type="password"
          id="confirmNewPassword"
          label="Confirm Password"
          value={confirmationCode}
          maxLength={MAX_LENGTH}
          onChange={onConfirmationCodeInputChangeHandler}
          required
        />
      </CForm>
    </Modal>
  );
};

export default AccountConfirmationPage;
