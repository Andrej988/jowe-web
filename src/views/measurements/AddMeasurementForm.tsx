import { CCol, CForm, CFormInput, CRow } from '@coreui/react';
import React, { PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

const AddMeasurementForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Add Measurement"
      visible={props.visible}
      size="lg"
      primaryButtonText="Save"
      primaryButtonHandler={props.onSaveHandler}
      showSecondaryButton={true}
      secondaryButtonColor="danger"
      secondaryButtonText="Close"
      secondaryButtonHandler={props.onCloseHandler}
      onCloseButtonHandler={props.onCloseHandler}
    >
      <CForm>
        <CRow>
          <CCol sm={12}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="text"
              id="dateInput"
              label="Date"
              //pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              //maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="text"
              id="commentInput"
              label="Notes (optional)"
              //pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              //maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="number"
              id="weightInput"
              label="Weight (in kg)"
              pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="number"
              id="bodyFatInput"
              label="Body Fat % (optional)"
              pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="number"
              id="waterInput"
              label="Body Water % (optional)"
              pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="number"
              id="muscleMassInput"
              label="Muscle Mass % (optional)"
              pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="number"
              id="boneInput"
              label="Bone Mass % (optional)"
              pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <CFormInput
              //invalid={!isValid && isTouched}
              type="number"
              id="energyInput"
              label="Energy Expenditure (optional)"
              pattern="[0-9]*"
              //value={weight}
              //min={MIN_TARGET_VALUE}
              //max={MAX_TARGET_VALUE}
              maxLength={3}
              //text={INPUT_MESSAGE}
              //onChange={onTargetWeightInputChangeHandler}
            />
          </CCol>
        </CRow>
      </CForm>
    </Modal>
  );
};

export default AddMeasurementForm;
