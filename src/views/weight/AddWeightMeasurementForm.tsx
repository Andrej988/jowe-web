import React from 'react';
import type { PropsWithChildren } from 'react';
import {
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import Modal from 'src/components/utils/Modal';
import FormInputGroupWithFeedback from 'src/components/utils/FormInputGroupWithFeedback';
import { cilClock, cilNotes, cilWarning } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

const AddWeightMeasurementForm: React.FC<Props> = (props) => {
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
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              // invalid={!isValid && isTouched}
              id="date"
              icon={cilClock}
              type="datetime-local"
              label="Date"
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
              icon={cilWarning}
              type="number"
              label="Weight (in kg)"
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
              icon={cilWarning}
              type="number"
              label="Body Fat % (optional)"
              autoComplete="body-fat"
              pattern="[0-9]*"
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
          <CCol sm={12} lg={6} className="mt-3">
            <CFormLabel htmlFor="water">Body Water % (optional)</CFormLabel>
            <CInputGroup className="has-validation">
              <CInputGroupText id="inputGroupPrepend03">
                <CIcon icon={cilWarning} />
              </CInputGroupText>
              <CFormInput
                // invalid={!isValid && isTouched}
                type="number"
                id="water"
                // label="Body Water % (optional)"
                pattern="[0-9]*"
                // value={weight}
                // min={MIN_TARGET_VALUE}
                // max={MAX_TARGET_VALUE}
                maxLength={3}
                // text={INPUT_MESSAGE}
                // onChange={onTargetWeightInputChangeHandler}
              />
            </CInputGroup>
          </CCol>
          <CCol sm={12} lg={6}>
            <CFormInput
              // invalid={!isValid && isTouched}
              type="number"
              id="muscleMassInput"
              label="Muscle Mass % (optional)"
              pattern="[0-9]*"
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
            <CFormInput
              // invalid={!isValid && isTouched}
              type="number"
              id="boneInput"
              label="Bone Mass % (optional)"
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
            <CFormInput
              // invalid={!isValid && isTouched}
              type="number"
              id="energyInput"
              label="Energy Expenditure (optional)"
              pattern="[0-9]*"
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
