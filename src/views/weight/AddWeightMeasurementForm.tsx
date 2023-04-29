import React, { type ChangeEvent, type PropsWithChildren, useState, useEffect } from 'react';
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
import {
  isEmpty,
  isLargerThan,
  isNumber,
  isValidDateString,
  isValidPercentageString,
} from 'src/services/utils/Validators';
import {
  DATE_GENERIC_FEEDBACK,
  STRICT_PERCENTAGE_VALUE_FEEDBACK,
  WEIGHT_FEEDBACK,
} from 'src/config/CommonStrings';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

interface FormValidityState {
  dateValid: boolean;
  noteValid: boolean;
  weightValid: boolean;
  bodyFatValid: boolean;
  waterValid: boolean;
  muscleMassValid: boolean;
  boneMassValid: boolean;
  energyExpenditureValid: boolean;
}

const USE_NORMAL_LABELS = true;
const DEFAULT_IS_VALIDATED = false;
const DEFAULT_FORM_VALIDITY_STATE: FormValidityState = {
  dateValid: false,
  noteValid: false,
  weightValid: false,
  bodyFatValid: false,
  waterValid: false,
  muscleMassValid: false,
  boneMassValid: false,
  energyExpenditureValid: false,
};

const AddWeightMeasurementForm: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );

  const [date, setDate] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [water, setWater] = useState<string>('');
  const [muscleMass, setMuscleMass] = useState<string>('');
  const [boneMass, setBoneMass] = useState<string>('');
  const [energyExpenditure, setEnergyExpenditure] = useState<string>('');

  const onDateInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setDate(event.target.value);
  };

  const onNoteInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setNote(event.target.value);
  };

  const onWeightInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setWeight(event.target.value);
  };

  const onBodyFatInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setBodyFat(event.target.value);
  };

  const onWaterInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setWater(event.target.value);
  };

  const onMuscleMassInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setMuscleMass(event.target.value);
  };

  const onBoneMassInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setBoneMass(event.target.value);
  };

  const onEnergyExpenditureInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    setEnergyExpenditure(event.target.value);
  };

  const validateForm = (): boolean => {
    const dateValid = isValidDateString(date);
    const noteValid = true;
    const weightValid = isNumber(weight) && isLargerThan(parseFloat(weight), 0);
    const bodyFatValid = isValidPercentageString(bodyFat, true);
    const waterValid = isValidPercentageString(water, true);
    const muscleMassValid = isValidPercentageString(muscleMass, true);
    const boneMassValid = isValidPercentageString(boneMass, true);
    const energyExpenditureValid = isEmpty(energyExpenditure) || isNumber(energyExpenditure);

    setIsValidated(true);
    setFormValidityState({
      dateValid,
      noteValid,
      weightValid,
      bodyFatValid,
      waterValid,
      muscleMassValid,
      boneMassValid,
      energyExpenditureValid,
    });

    return (
      dateValid &&
      noteValid &&
      weightValid &&
      bodyFatValid &&
      waterValid &&
      muscleMassValid &&
      boneMassValid &&
      energyExpenditureValid
    );
  };

  useEffect(() => {
    if (isValidated) {
      const timerId = setTimeout(() => {
        validateForm();
      }, 250);

      // Cleanup
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [date, note, weight, bodyFat, water, muscleMass, boneMass, energyExpenditure, isValidated]);

  const onAddMeasurementHandler = (): void => {
    const isFormValid = validateForm();

    if (isFormValid) {
      props.onSaveHandler();
      clearFormWithSlightTimeout();
    }
  };

  const clearForm = (): void => {
    setIsValidated(DEFAULT_IS_VALIDATED);
    setDate('');
    setNote('');
    setWeight('');
    setBodyFat('');
    setWater('');
    setMuscleMass('');
    setBoneMass('');
    setEnergyExpenditure('');
    setFormValidityState(DEFAULT_FORM_VALIDITY_STATE);
  };

  const clearFormWithSlightTimeout = (): void => {
    setTimeout(() => {
      clearForm();
    }, 250);
  };

  const onCloseFormHandler = (): void => {
    props.onCloseHandler();
    clearFormWithSlightTimeout();
  };

  return (
    <Modal
      title="Add Measurement"
      visible={props.visible}
      size="lg"
      primaryButtonText="Save Measurement"
      primaryButtonHandler={onAddMeasurementHandler}
      showSecondaryButton={true}
      secondaryButtonColor="danger"
      secondaryButtonText="Close"
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              id="date"
              icon={cilClock}
              type="datetime-local"
              label="Date of Measurement"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="date"
              // pattern="[0-9]*"
              value={date}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              // maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onDateInputChangeHandler}
              invalid={isValidated && !formValidtyState.dateValid}
              feedbackMsg={DATE_GENERIC_FEEDBACK}
            />
          </CCol>

          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              id="note"
              icon={cilNotes}
              type="text"
              label="Note (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="note"
              // pattern="[0-9]*"
              value={note}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              // maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onNoteInputChangeHandler}
              invalid={isValidated && !formValidtyState.noteValid}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              className="mt-2"
              id="weight"
              icon={cilBalanceScale}
              type="number"
              label="Weight (in kg)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="weight"
              pattern="[0-9]*"
              value={weight}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onWeightInputChangeHandler}
              invalid={isValidated && !formValidtyState.weightValid}
              feedbackMsg={WEIGHT_FEEDBACK}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              className="mt-2"
              id="bodyFat"
              icon={cilBurger}
              type="number"
              label="Body Fat % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="body-fat"
              pattern="[0-9]*"
              min={0}
              max={100}
              value={bodyFat}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onBodyFatInputChangeHandler}
              invalid={isValidated && !formValidtyState.bodyFatValid}
              feedbackMsg={STRICT_PERCENTAGE_VALUE_FEEDBACK}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              className="mt-2"
              id="water"
              icon={cilDrop}
              type="number"
              label="Body Water % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="water"
              pattern="[0-9]*"
              min={0}
              max={100}
              value={water}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onWaterInputChangeHandler}
              invalid={isValidated && !formValidtyState.waterValid}
              feedbackMsg={STRICT_PERCENTAGE_VALUE_FEEDBACK}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              className="mt-2"
              id="muscleMass"
              icon={cilWeightlifitng}
              type="number"
              label="Muscle Mass % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="muscle-mass"
              pattern="[0-9]*"
              min={0}
              max={100}
              value={muscleMass}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onMuscleMassInputChangeHandler}
              invalid={isValidated && !formValidtyState.muscleMassValid}
              feedbackMsg={STRICT_PERCENTAGE_VALUE_FEEDBACK}
            />
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              className="mt-2"
              id="boneMass"
              icon={cilSpreadsheet}
              type="number"
              label="Bone Mass % (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="bone-mass"
              pattern="[0-9]*"
              min={0}
              max={100}
              value={boneMass}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onBoneMassInputChangeHandler}
              invalid={isValidated && !formValidtyState.boneMassValid}
              feedbackMsg={STRICT_PERCENTAGE_VALUE_FEEDBACK}
            />
          </CCol>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              className="mt-2"
              id="eneryExpenditure"
              icon={cilBurn}
              type="number"
              label="Energy Expenditure (optional)"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="energy-expenditure"
              pattern="[0-9]*"
              min={0}
              max={100}
              value={energyExpenditure}
              // min={MIN_TARGET_VALUE}
              // max={MAX_TARGET_VALUE}
              maxLength={3}
              // text={INPUT_MESSAGE}
              onChange={onEnergyExpenditureInputChangeHandler}
              invalid={isValidated && !formValidtyState.energyExpenditureValid}
            />
          </CCol>
        </CRow>
      </CForm>
    </Modal>
  );
};

export default AddWeightMeasurementForm;
