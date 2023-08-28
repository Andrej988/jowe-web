import { cilBalanceScale, cilTrash, cilWarning } from '@coreui/icons';
import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'src/components/utils/Modal';
import type { UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';
import {
  toFormattedDateTimeString,
  toFormattedDateTimeStringFromTimestamp,
} from 'src/services/utils/DateUtils';
import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';
import { ToastMsg, toasterActions } from 'src/store/Store';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onDeleteHandler: () => void;
  item: UIWeightMeasurement | undefined;
}

const TOAST_TITLE_DELETE_DEFAULT = 'Delete Measurement';
const TOAST_TITLE_DELETE_ERROR = 'Delete Measurement Error';
const TOAST_MESSAGE_DELETE_SUCCESSFUL = 'Measurement was deleted successfully.';

const DETAIL_NOT_AVAILABLE_STRING = '/';

const DeleteWeightMeasurementForm: React.FC<Props> = (props) => {
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const onDeleteHandler = (): void => {
    if (props.item?.measurementId !== undefined) {
      setIsDeleteButtonDisabled(true);
      WeightMeasurementsService.getInstance()
        .deleteMeasurement(props.item?.measurementId)
        .then(() => {
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(
                cilBalanceScale,
                TOAST_TITLE_DELETE_DEFAULT,
                TOAST_MESSAGE_DELETE_SUCCESSFUL,
              ),
            ),
          );
          setIsDeleteButtonDisabled(false);
          props.onDeleteHandler();
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_DELETE_ERROR, err.message),
            ),
          );
          setIsDeleteButtonDisabled(false);
        });
    }
  };

  return (
    <Modal
      title="Delete a Measurement"
      visible={props.visible}
      primaryButtonIcon={cilTrash}
      primaryButtonColor="danger"
      primaryButtonText="Delete"
      primaryButtonHandler={onDeleteHandler}
      primaryButtonDisabled={isDeleteButtonDisabled}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonHandler={props.onCloseHandler}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <div>
        <p>Are you sure you want to delete the following measurement?</p>
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

export default DeleteWeightMeasurementForm;
