import { CForm, CFormInput } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';
import AuthService from 'src/auth/AuthService';

interface Props extends PropsWithChildren {
  visible: boolean;
  username: string;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

const MAX_LENGTH = 10;
const INPUT_MESSAGE = `Account confirmation code was sent to your e-mail address.`;
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

  const onAccountConfirmation = (): void => {
    if (isConfirmationCodeValid()) {
      AuthService.getInstance()
        .confirmAccount(props.username, confirmationCode)
        .then((a) => {
          props.onSaveHandler();
        })
        .catch((err: Error) => {
          console.error(err);
          alert(err);
        });
    } else {
      validateForm('');
    }
  };

  return (
    <Modal
      title="Account Confirmation"
      visible={props.visible}
      primaryButtonText="Confirm"
      primaryButtonHandler={onAccountConfirmation}
      showSecondaryButton={false}
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm>
        <CFormInput
          invalid={!isValid && isTouched}
          type="text"
          id="confirmationNumber"
          label="Confirmation code"
          value={confirmationCode}
          maxLength={MAX_LENGTH}
          text={INPUT_MESSAGE}
          onChange={onConfirmationCodeInputChangeHandler}
          required
        />
      </CForm>
    </Modal>
  );
};

export default AccountConfirmationPage;
