import React, { PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';
import { Measurement } from 'src/model/Measurement';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  measurement: Measurement | undefined;
}

const MeasurementDetailsForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Details"
      visible={props.visible}
      primaryButtonText="Close"
      primaryButtonHandler={props.onCloseHandler}
      showSecondaryButton={false}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <p>{props.measurement?.measurementId}</p>
    </Modal>
  );
};

export default MeasurementDetailsForm;
