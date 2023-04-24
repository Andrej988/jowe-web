import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Modal from 'src/components/utils/Modal';
import AuthService from 'src/services/auth/AuthService';

interface Props {
  visible: boolean;
  onCloseForm: () => void;
}

const calculateRemainingTime = (logoutAt: number): number => {
  return Math.round((logoutAt - Date.now()) / 1000) - 1;
};

const AutoLogoutForm: React.FC<Props> = (props) => {
  const autoLogoutAt = useSelector((state: any) => state.auth.autoLogoutAt);
  const [remainingTime, setRemainingTime] = useState<number>(-1);

  const onProlongSession = (): void => {
    AuthService.getInstance().extendUserSession();
    props.onCloseForm();
  };

  useEffect(() => {
    if (props.visible) {
      setRemainingTime(calculateRemainingTime(autoLogoutAt));
    }
  }, [props.visible]);

  useEffect(() => {
    if (remainingTime > 0) {
      const interval = setInterval(() => {
        setRemainingTime(remainingTime - 1);
      }, 1000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [remainingTime]);

  return (
    <Modal
      title="Session Timeout"
      visible={props.visible}
      primaryButtonText="Stay signed in"
      primaryButtonHandler={onProlongSession}
      showSecondaryButton={false}
      secondaryButtonHandler={onProlongSession}
      onCloseButtonHandler={onProlongSession}
    >
      <p>
        {`Your online session will expire in ${remainingTime}s.
        Please click "Stay signed in" to keep working.`}
      </p>
    </Modal>
  );
};

export default AutoLogoutForm;
