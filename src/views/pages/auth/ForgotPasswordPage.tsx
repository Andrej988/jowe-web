import { CForm, CFormInput } from '@coreui/react';
import React, { useState } from 'react';
import type { ChangeEvent, PropsWithChildren } from 'react';
import AuthService from 'src/auth/AuthService';
import Modal from 'src/components/utils/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
}

const STATE_INIT = {
  primaryButtonText: 'Send Confirmation Code',
  usernameDisabled: false,
  confirmationCodeDisabled: true,
  newPasswordDisabled: true,
  passwordConfirmationDisabled: true,
};

const STATE_CODE_SENT = {
  primaryButtonText: 'Confirm',
  usernameDisabled: true,
  confirmationCodeDisabled: false,
  newPasswordDisabled: false,
  passwordConfirmationDisabled: false,
};

const MAX_LENGTH = 10;

const ForgotPasswordPage: React.FC<Props> = (props) => {
  const [formState, setFormState] = useState(STATE_INIT);
  const [isTouched, setIsTouched] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const [username, setUsername] = useState('');
  const [confirmationCode, setConfirmatioCode] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const onUsernameChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setUsername(event.target.value);
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
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsValid(isConfirmationCodeValid());
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [confirmationCode]); */

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    resetForm();
  };

  const resetForm = (): void => {
    setTimeout(() => {
      setFormState(STATE_INIT);
      setUsername('');
      setConfirmatioCode('');
      setPassword('');
      setPasswordConfirmation('');
      setIsTouched(false);
      setIsValid(false);
    }, 500);
  };

  const onConfirmHandler = (): void => {
    if (formState === STATE_INIT) {
      AuthService.getInstance()
        .initForgotPasswordFlos(username)
        .then(() => {
          setFormState(STATE_CODE_SENT);
        })
        .catch((err) => {
          console.error(err);
        });
    } else {
      AuthService.getInstance()
        .completeForgotPasswordFlow(username, confirmationCode, password)
        .then(() => {
          props.onConfirmHandler();
          resetForm();
        })
        .catch((err) => {
          console.error(err);
        });
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
          invalid={!isValid && isTouched}
          type="type"
          id="Username"
          autoComplete="username"
          label="Username or Email Address"
          value={username}
          onChange={onUsernameChangeHandler}
          disabled={formState.usernameDisabled}
          required
          autoFocus
        />
        <CFormInput
          invalid={!isValid && isTouched}
          type="text"
          id="confirmationNumber"
          autoComplete="confirmationNumber"
          label="Confirmation code"
          value={confirmationCode}
          maxLength={MAX_LENGTH}
          onChange={onConfirmationCodeInputChangeHandler}
          disabled={formState.confirmationCodeDisabled}
          required
        />
        <CFormInput
          invalid={!isValid && isTouched}
          type="password"
          id="newPassword"
          autoComplete="newPassword"
          label="New Password"
          value={password}
          onChange={onPasswordChangeHandler}
          disabled={formState.newPasswordDisabled}
          required
        />
        <CFormInput
          invalid={!isValid && isTouched}
          type="password"
          id="confirmNewPassword"
          autoComplete="confirmNewPassword"
          label="Confirm Password"
          value={passwordConfirmation}
          onChange={onPasswordConfirmationChangeHandler}
          disabled={formState.passwordConfirmationDisabled}
          required
        />
      </CForm>
    </Modal>
  );
};

export default ForgotPasswordPage;
