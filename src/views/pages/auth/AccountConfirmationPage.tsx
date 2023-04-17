import { CForm, CFormInput } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import Modal from 'src/components/utils/Modal';
import AuthService from 'src/auth/AuthService';
import { isValidConfirmationCodeLength } from 'src/utils/Validators';
import { AWS_CONFIRMATION_CODE_MAX_LENGTH } from 'src/config/ServiceConfig';

interface Props extends PropsWithChildren {
  visible: boolean;
  username: string;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
  onProcessingErrorHandler: (toastTitle: string, toastMsg: string) => void;
}

const INPUT_MESSAGE = `Account confirmation code was sent to your e-mail address.`;
const DEFAULT_VALUE_IS_VALIDATED = false;
const DEFAULT_VALUE_IS_VALID = false;
const DEFAULT_VALUE = '';

const AccountConfirmationPage: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState(DEFAULT_VALUE_IS_VALIDATED);
  const [isValid, setIsValid] = useState(DEFAULT_VALUE_IS_VALID);
  const [confirmationCode, setConfirmatioCode] = useState<string>(DEFAULT_VALUE);

  const onConfirmationCodeInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setConfirmatioCode(event.target.value);
  };

  const validateForm = (): boolean => {
    setIsValidated(true);

    const isValid = isValidConfirmationCodeLength(confirmationCode);
    setIsValid(isValid);
    return isValid;
  };

  useEffect(() => {
    if (isValidated) {
      const timer = setTimeout(() => {
        validateForm();
      }, 50);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [confirmationCode]);

  const clearForm = (): void => {
    setIsValidated(DEFAULT_VALUE_IS_VALIDATED);
    setIsValid(DEFAULT_VALUE_IS_VALID);
    setConfirmatioCode(DEFAULT_VALUE);
  };

  const onCloseFormHandler = (): void => {
    clearForm();
    props.onCloseHandler();
  };

  const onAccountConfirmation = (): void => {
    const isValid = validateForm();
    if (isValid) {
      AuthService.getInstance()
        .confirmAccount(props.username, confirmationCode)
        .then(() => {
          props.onSaveHandler();
        })
        .catch((err: Error) => {
          console.error(err);
          props.onProcessingErrorHandler('Account Confirmation Error', err.message);
        });
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
          invalid={isValidated && !isValid}
          type="text"
          id="confirmationNumber"
          label="Confirmation code"
          value={confirmationCode}
          maxLength={AWS_CONFIRMATION_CODE_MAX_LENGTH}
          text={INPUT_MESSAGE}
          onChange={onConfirmationCodeInputChangeHandler}
          autoFocus
          required
        />
      </CForm>
    </Modal>
  );
};

export default AccountConfirmationPage;
