import { cilBalanceScale, cilTrash, cilWarning } from '@coreui/icons';
import React, { useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'src/components/utils/Modal';
import type { Measurement } from 'src/model/weight/Measurements';
import { toFormattedDateTimeString } from 'src/services/utils/DateUtils';
import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';
import { ToastMsg, toasterActions } from 'src/store/Store';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onDeleteHandler: () => void;
  measurement: Measurement | undefined;
}

const TOAST_TITLE_DELETE_MEASUREMENT_DEFAULT = 'Delete Measurement';
const TOAST_TITLE_DELETE_MEASUREMENT_ERROR = 'Delete Measurement Error';
const TOAST_MESSAGE_DELETE_MEASUREMENT_SUCCESSFUL = 'Measurement was deleted successfully.';

const DETAIL_NOT_AVAILABLE_STRING = '/';

const DeleteWeightMeasurementForm: React.FC<Props> = (props) => {
  const [isDeleteButtonDisabled, setIsDeleteButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const onDeleteMeasurementHandler = (): void => {
    if (props.measurement?.measurementId !== undefined) {
      setIsDeleteButtonDisabled(true);
      WeightMeasurementsService.getInstance()
        .deleteMeasurement(props.measurement?.measurementId)
        .then(() => {
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(
                cilBalanceScale,
                TOAST_TITLE_DELETE_MEASUREMENT_DEFAULT,
                TOAST_MESSAGE_DELETE_MEASUREMENT_SUCCESSFUL,
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
              new ToastMsg(cilWarning, TOAST_TITLE_DELETE_MEASUREMENT_ERROR, err.message),
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
      primaryButtonHandler={onDeleteMeasurementHandler}
      primaryButtonDisabled={isDeleteButtonDisabled}
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

export default DeleteWeightMeasurementForm;
