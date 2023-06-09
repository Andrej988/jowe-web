import { cilTrash } from '@coreui/icons';
import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import AuthService from 'src/services/auth/AuthService';
import Modal from 'src/components/utils/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
}

const DeleteAccountPage: React.FC<Props> = (props) => {
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const onDeleteConfirmationHandler = (): void => {
    setIsButtonDisabled(true);
    AuthService.getInstance()
      .deleteUser()
      .then(() => {
        setIsButtonDisabled(false);
        props.onConfirmHandler();
      })
      .catch((err) => {
        console.error(err);
        setIsButtonDisabled(false);
      });
  };

  const onCloseHandler = (): void => {
    setIsButtonDisabled(false);
    props.onCloseHandler();
  };

  return (
    <Modal
      title="Delete Account"
      visible={props.visible}
      primaryButtonIcon={cilTrash}
      primaryButtonText="Delete"
      primaryButtonHandler={onDeleteConfirmationHandler}
      primaryButtonColor="danger"
      primaryButtonDisabled={isButtonDisabled}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonHandler={onCloseHandler}
      onCloseButtonHandler={onCloseHandler}
    >
      <div>
        <p>
          Are you sure you want to delete your account? <br /> All your user data will be deleted.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteAccountPage;
