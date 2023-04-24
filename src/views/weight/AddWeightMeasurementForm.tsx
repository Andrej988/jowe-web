import React from 'react';
import type { PropsWithChildren } from 'react';
import { CCol, CForm, CRow } from '@coreui/react';
import Modal from 'src/components/utils/Modal';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import {
  cilBalanceScale,
  cilBurger,
  cilBurn,
  cilClock,
  cilDrop,
  cilNotes,
  cilSpreadsheet,
  cilWeightlifitng,
} from '@coreui/icons';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

const USE_NORMAL_LABELS = true;

const AddWeightMeasurementForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Add Measurement"
      visible={props.visible}
      size="lg"
      primaryButtonText="Save Measurement"
      primaryButtonHandler={props.onSaveHandler}
      showSecondaryButton={true}
      secondaryButtonColor="danger"
      secondaryButtonText="Close"
      secondaryButtonHandler={props.onCloseHandler}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <CForm>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              id="date"
              icon={cilClock}
              type="datetime-local"
              label="Date"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="date"
              // pattern="[0-9]*"
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              // maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>

          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              id="note"
              icon={cilNotes}
              type="text"
              label="Note (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="note"
              // pattern="[0-9]*"
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              // maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              className="mt-3"
              id="weight"
              icon={cilBalanceScale}
              type="number"
              label="Weight (in kg)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="weight"
              pattern="[0-9]*"
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              className="mt-3"
              id="bodyFat"
              icon={cilBurger}
              type="number"
              label="Body Fat % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="body-fat"
              pattern="[0-9]*"
              min={0}
              max={100}
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              className="mt-3"
              id="water"
              icon={cilDrop}
              type="number"
              label="Body Water % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="water"
              pattern="[0-9]*"
              min={0}
              max={100}
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              className="mt-3"
              id="muscleMass"
              icon={cilWeightlifitng}
              type="number"
              label="Muscle Mass % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="muscle-mass"
              pattern="[0-9]*"
              min={0}
              max={100}
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              className="mt-3"
              id="boneMass"
              icon={cilSpreadsheet}
              type="number"
              label="Bone Mass % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="bone-mass"
              pattern="[0-9]*"
              min={0}
              max={100}
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              className="mt-3"
              id="eneryExpenditure"
              icon={cilBurn}
              type="number"
              label="Energy Expenditure (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="energy-expenditure"
              pattern="[0-9]*"
              min={0}
              max={100}
              // value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              // onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
      </CForm>
    </Modal>
  );
};

export default AddWeightMeasurementForm;
