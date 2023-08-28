import React from 'react';
import type { PropsWithChildren } from 'react';
import Modal from 'src/components/utils/Modal';
import type { UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';
import {
  toFormattedDateTimeString,
  toFormattedDateTimeStringFromTimestamp,
} from 'src/services/utils/DateUtils';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  item: UIWeightMeasurement | undefined;
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
          Measurement ID: {props.item?.measurementId}
          <br />
          Date: {toFormattedDateTimeString(props.item?.date)}
          <br />
          Note: {props.item?.note !== undefined ? props.item?.note : DETAIL_NOT_AVAILABLE_STRING}
          <br />
          Last modified:{' '}
          {props.item?.lastModified !== undefined
            ? toFormattedDateTimeStringFromTimestamp(props.item?.lastModified)
            : DETAIL_NOT_AVAILABLE_STRING}{' '}
          {}
        </p>
        Measurements:
        <ul>
          <li>
            Weight:{' '}
            {props.item?.measurements.weight !== undefined
              ? `${props.item?.measurements.weight} kg`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Body Fat:{' '}
            {props.item?.measurements.bodyFatPercentage !== undefined
              ? `${props.item?.measurements.bodyFatPercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Body Water:{' '}
            {props.item?.measurements.waterPercentage !== undefined
              ? `${props.item?.measurements.waterPercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Muscle Mass:{' '}
            {props.item?.measurements.muscleMassPercentage !== undefined
              ? `${props.item?.measurements.muscleMassPercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Bone Mass:{' '}
            {props.item?.measurements.bonePercentage !== undefined
              ? `${props.item?.measurements.bonePercentage} %`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
          <li>
            Energy Expenditure:{' '}
            {props.item?.measurements.energyExpenditure !== undefined
              ? `${props.item?.measurements.energyExpenditure} kcal`
              : DETAIL_NOT_AVAILABLE_STRING}
          </li>
        </ul>
      </div>
    </Modal>
  );
};

export default WeightMeasurementDetailsForm;
