import React from 'react';
import type { PropsWithChildren } from 'react';
import Modal from 'src/components/utils/Modal';
import type { Measurement } from 'src/model/weight/Measurements';
import { toFormattedDateTimeString } from 'src/services/utils/DateUtils';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  measurement: Measurement | undefined;
}

const DETAIL_NOT_AVAILABLE_STRING = '/';

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
          Note:{' '}
          {props.measurement?.note !== undefined
            ? props.measurement?.note
            : DETAIL_NOT_AVAILABLE_STRING}
        </p>
        Measurements:
        <ul>
          <li>
            Weight:{' '}
            {props.measurement?.measurements.weight !== undefined
              ? `${props.measurement?.measurements.weight} kg`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Body Fat:{' '}
            {props.measurement?.measurements.bodyFatPercentage !== undefined
              ? `${props.measurement?.measurements.bodyFatPercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Body Water:{' '}
            {props.measurement?.measurements.waterPercentage !== undefined
              ? `${props.measurement?.measurements.waterPercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Muscle Mass:{' '}
            {props.measurement?.measurements.muscleMassPercentage !== undefined
              ? `${props.measurement?.measurements.muscleMassPercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Bone Mass:{' '}
            {props.measurement?.measurements.bonePercentage !== undefined
              ? `${props.measurement?.measurements.bonePercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Energy Expenditure:{' '}
            {props.measurement?.measurements.energyExpenditure !== undefined
              ? `${props.measurement?.measurements.energyExpenditure} kcal`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
        </ul>
      </div>
    </Modal>
  );
};

export default WeightMeasurementDetailsForm;
