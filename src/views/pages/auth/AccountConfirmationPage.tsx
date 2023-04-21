import { CForm, CFormFeedback } from '@coreui/react';
import React, { useEffect, useState, type ChangeEvent } from 'react';
import Modal from 'src/components/utils/Modal';
import AuthService from 'src/services/auth/AuthService';
import { isValidConfirmationCodeLength } from 'src/services/utils/Validators';
import { AWS_CONFIRMATION_CODE_MAX_LENGTH } from 'src/config/ServiceConfig';
import { CONFIRMATION_CODE_FEEDBACK } from 'src/config/CommonStrings';
import { cilDialpad, cilEnvelopeClosed, cilWarning } from '@coreui/icons';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import { useDispatch } from 'react-redux';
import { ToastMsg, toasterActions } from 'src/store/Store';

interface Props {
  visible: boolean;
  username: string;
  sendToastVerificationCodeSent?: boolean;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

const DEFAULT_VALUE_IS_VALIDATED = false;
const DEFAULT_VALUE_IS_VALID = false;
const DEFAULT_VALUE = '';

const INPUT_MESSAGE = `Account verification code was sent to your e-mail address.`;
const TOAST_TITLE_ACCOUNT_CONFIRMATION_DEFAULT = 'Account Confirmation';
const TOAST_TITLE_ACCOUNT_CONFIRMATION_FAILURE = 'Account Confirmation Error';
const TOAST_MESSAGE_VERIFICATION_CODE_SENT = 'Verification code was sent to your email address.';

const RESEND_CONFIRMATION_CODE_LABEL = 'Resend Verification Code';
const RESEND_CONFIRMATION_CODE_TIMEOUT = 59;

const AccountConfirmationPage: React.FC<Props> = (props) => {
  const [resendConfirmationTimeout, setResendConfirmationTimeout] = useState(0);

  const [isValidated, setIsValidated] = useState(DEFAULT_VALUE_IS_VALIDATED);
  const [isValid, setIsValid] = useState(DEFAULT_VALUE_IS_VALID);
  const [confirmationCode, setConfirmatioCode] = useState<string>(DEFAULT_VALUE);
  const dispatch = useDispatch();

  const onConfirmationCodeInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setConfirmatioCode(event.target.value);
  };

  const validateForm = (): boolean => {
    setIsValidated(true);

    const isValid = isValidConfirmationCodeLength(confirmationCode);
    setIsValid(isValid);
    return isValid;
  };

  const sendVerificationCodeSentToast = (): void => {
    setTimeout(() => {
      dispatch(
        toasterActions.addMessage(
          new ToastMsg(
            cilEnvelopeClosed,
            TOAST_TITLE_ACCOUNT_CONFIRMATION_DEFAULT,
            TOAST_MESSAGE_VERIFICATION_CODE_SENT,
          ),
        ),
      );
    }, 500);
  };

  useEffect(() => {
    if (resendConfirmationTimeout > 0) {
      const interval = setInterval(() => {
        setResendConfirmationTimeout(resendConfirmationTimeout - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [resendConfirmationTimeout]);

  useEffect(() => {
    if (props.sendToastVerificationCodeSent === true && props.visible) {
      sendVerificationCodeSentToast();
    }
  }, [props.visible]);

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
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_ACCOUNT_CONFIRMATION_FAILURE, err.message),
            ),
          );
        });
    }
  };

  const onResendVerificationCode = (): void => {
    AuthService.getInstance()
      .resendSignupConfirmationCode(props.username)
      .then(() => {
        sendVerificationCodeSentToast();
        setResendConfirmationTimeout(RESEND_CONFIRMATION_CODE_TIMEOUT);
      })
      .catch((err: Error) => {
        console.error(err);
        dispatch(
          toasterActions.addMessage(
            new ToastMsg(cilWarning, TOAST_TITLE_ACCOUNT_CONFIRMATION_FAILURE, err.message),
          ),
        );
      });
  };

  return (
    <Modal
      title="Account Confirmation"
      visible={props.visible}
      primaryButtonText={
        resendConfirmationTimeout > 0
          ? `${RESEND_CONFIRMATION_CODE_LABEL} (${resendConfirmationTimeout})`
          : RESEND_CONFIRMATION_CODE_LABEL
      }
      primaryButtonDisabled={resendConfirmationTimeout > 0}
      primaryButtonHandler={onResendVerificationCode}
      showSecondaryButton={true}
      secondaryButtonText="Confirm"
      secondaryButtonHandler={onAccountConfirmation}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm>
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
          feedbackMsg={CONFIRMATION_CODE_FEEDBACK}
          invalid={isValidated && !isValid}
          autoFocus
          required
        />
        <CFormFeedback className="mt-4">{INPUT_MESSAGE}</CFormFeedback>
      </CForm>
    </Modal>
  );
};

export default AccountConfirmationPage;
