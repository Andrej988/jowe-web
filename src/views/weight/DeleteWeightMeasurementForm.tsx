import { cilBalanceScale, cilTrash, cilWarning } from '@coreui/icons';
import React from 'react';
import type { PropsWithChildren } from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'src/components/utils/Modal';
import type { Measurement } from 'src/model/weight/Measurement';
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

const DeleteWeightMeasurementForm: React.FC<Props> = (props) => {
  const dispatch = useDispatch();

  const onDeleteMeasurementHandler = (): void => {
    if (props.measurement?.measurementId !== undefined) {
      WeightMeasurementsService.getInstance()
        .deleteMeasurement(props.measurement?.measurementId)
        .then((x) => {
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(
                cilBalanceScale,
                TOAST_TITLE_DELETE_MEASUREMENT_DEFAULT,
                TOAST_MESSAGE_DELETE_MEASUREMENT_SUCCESSFUL,
              ),
            ),
          );
          props.onDeleteHandler();
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_DELETE_MEASUREMENT_ERROR, err.message),
            ),
          );
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
          Note: {props.measurement?.note}
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

export default DeleteWeightMeasurementForm;
