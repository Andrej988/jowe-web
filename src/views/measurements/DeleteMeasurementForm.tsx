import React, { PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';
import { Measurement } from 'src/model/Measurement';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onDeleteHandler: () => void;
  measurement: Measurement | undefined;
}

const DeleteMeasurementForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Delete"
      visible={props.visible}
      primaryButtonColor="danger"
      primaryButtonText="Delete"
      primaryButtonHandler={props.onDeleteHandler}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonHandler={props.onCloseHandler}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <p>Are you sure you want to delete the following measurement?</p>
      <p>{props.measurement?.measurementId}</p>
    </Modal>
  );
};

export default DeleteMeasurementForm;
