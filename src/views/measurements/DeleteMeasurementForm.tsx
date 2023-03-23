import React, { PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';
import { Measurement } from 'src/model/Measurement';
import { toFormattedDateTimeString } from 'src/utils/DateUtils';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onDeleteHandler: () => void;
  measurement: Measurement | undefined;
}

const DeleteMeasurementForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Delete a Measurement"
      visible={props.visible}
      primaryButtonColor="danger"
      primaryButtonText="Delete"
      primaryButtonHandler={props.onDeleteHandler}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonHandler={props.onCloseHandler}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <div>
        <p>Are you sure you want to delete the following measurement?</p>
        <p>
          Measurement ID: {props.measurement?.measurementId}
          <br />
          Date: {toFormattedDateTimeString(props.measurement?.date)}
          <br />
          Note: {props.measurement?.comment}
        </p>
        Measurements:
        <ul>
          <li>Weight: {props.measurement?.measurements.weight} kg</li>
          <li>Body Fat: {props.measurement?.measurements.bodyFatPercentage} %</li>
          <li>Water: {props.measurement?.measurements.waterPercentage} %</li>
          <li>Muscle Mass: {props.measurement?.measurements.muscleMassPercentage} %</li>
          <li>Bone: {props.measurement?.measurements.bonePercentage} %</li>
          <li>Energy Expenditure: {props.measurement?.measurements.energyExpenditure} kcal</li>
        </ul>
      </div>
    </Modal>
  );
};

export default DeleteMeasurementForm;
