import React from 'react';
import type { PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onConfirmHandler: () => void;
}

const DeleteAccountPage: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Delete Account"
      visible={props.visible}
      primaryButtonText="Delete"
      primaryButtonHandler={props.onConfirmHandler}
      primaryButtonColor="danger"
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonHandler={props.onCloseHandler}
      onCloseButtonHandler={props.onCloseHandler}
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
