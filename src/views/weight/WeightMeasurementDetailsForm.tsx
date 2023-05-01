import React from 'react';
import type { PropsWithChildren } from 'react';
import Modal from 'src/components/utils/Modal';
import type { Measurement } from 'src/model/weight/Measurement';
import { toFormattedDateTimeString } from 'src/services/utils/DateUtils';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  measurement: Measurement | undefined;
}

const WeightMeasurementDetailsForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Measurement Details"
      visible={props.visible}
      primaryButtonText="Close"
      primaryButtonHandler={props.onCloseHandler}
      showSecondaryButton={false}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <div>
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
          <li>Body Water: {props.measurement?.measurements.waterPercentage} %</li>
          <li>Muscle Mass: {props.measurement?.measurements.muscleMassPercentage} %</li>
          <li>Bone Mass: {props.measurement?.measurements.bonePercentage} %</li>
          <li>Energy Expenditure: {props.measurement?.measurements.energyExpenditure} kcal</li>
        </ul>
      </div>
    </Modal>
  );
};

export default WeightMeasurementDetailsForm;
