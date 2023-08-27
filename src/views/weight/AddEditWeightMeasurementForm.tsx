import React, {
  type ChangeEvent,
  type PropsWithChildren,
  useState,
  useEffect,
  type FormEvent,
} from 'react';
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
  cilWarning,
  cilWeightlifitng,
} from '@coreui/icons';
import {
  isEmpty,
  isMoreThan,
  isNumber,
  isValidDateString,
  isValidPercentageString,
} from 'src/services/utils/Validators';
import {
  DATE_GENERIC_FEEDBACK,
  STRICT_PERCENTAGE_VALUE_FEEDBACK,
  WEIGHT_FEEDBACK,
} from 'src/config/CommonStrings';
import WeightMeasurementsService from 'src/services/weight/WeightMeasurementsService';
import { tryParseFloat, tryParseFloatStrict } from 'src/services/utils/Parsers';
import { useDispatch } from 'react-redux';
import { ToastMsg, toasterActions } from 'src/store/Store';
import { UIWeightMeasurement } from 'src/model/weight/UIWeightMeasurements';
import {
  AddWeightMeasurementRequestDto,
  EditWeightMeasurementRequestDto,
  buildAddWeightMeasurementRequestDto,
  buildEditWeightMeasurementRequestDto,
} from 'src/model/weight/WeightMeasurementDtos';

interface Props extends PropsWithChildren {
  visible: boolean;
  existingItem?: UIWeightMeasurement;
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

const TITLE_ADD = 'Add Measurement';
const TITLE_EDIT = 'Edit Measurement';
const TOAST_TITLE_ADD_DEFAULT = 'Add Measurement';
const TOAST_TITLE_ADD_ERROR = 'Add Measurement Error';
const TOAST_MESSAGE_ADD_SUCCESSFUL = 'Measurement was added successfully.';
const TOAST_TITLE_EDIT_DEFAULT = 'Edit Measurement';
const TOAST_TITLE_EDIT_ERROR = 'Edit Measurement Error';
const TOAST_MESSAGE_EDIT_SUCCESSFUL = 'Measurement was updated successfully.';

const isDateInTheFuture = (dateString: string): boolean => {
  const date = Date.parse(dateString);
  return !isNaN(date) && date > Date.now();
};

const getCurrentDate = (): string => {
  return parseDate(new Date());
};

const parseDate = (date: Date): string => {
  const twoDigitValue = (val: number): string => {
    return `0${val}`.slice(-2);
  };
  const hours = twoDigitValue(date.getHours());
  const minutes = twoDigitValue(date.getMinutes());

  return `${date.toLocaleDateString('en-CA')} ${hours}:${minutes}`;
};

const AddEditWeightMeasurementForm: React.FC<Props> = (props) => {
  const [isValidated, setIsValidated] = useState(DEFAULT_IS_VALIDATED);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [formValidtyState, setFormValidityState] = useState<FormValidityState>(
    DEFAULT_FORM_VALIDITY_STATE,
  );

  const [title, setTitle] = useState(TITLE_ADD);
  const [measurementId, setMeasurementId] = useState('');
  const [date, setDate] = useState<string>(getCurrentDate());
  const [note, setNote] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [water, setWater] = useState<string>('');
  const [muscleMass, setMuscleMass] = useState<string>('');
  const [boneMass, setBoneMass] = useState<string>('');
  const [energyExpenditure, setEnergyExpenditure] = useState<string>('');
  const dispatch = useDispatch();

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
    const dateValid = isValidDateString(date) && !isDateInTheFuture(date);
    const noteValid = true;
    const weightValid = isNumber(weight) && isMoreThan(parseFloat(weight), 0);
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
    if (props.existingItem) {
      setTitle(TITLE_EDIT);
      setMeasurementId(props.existingItem.measurementId);
      setDate(parseDate(props.existingItem.date));
      setNote(props.existingItem.note ? props.existingItem.note : '');
      setWeight(
        props.existingItem.measurements?.weight ? props.existingItem.measurements.weight + '' : '',
      );
      setBodyFat(
        props.existingItem.measurements?.bodyFatPercentage
          ? props.existingItem.measurements.bodyFatPercentage + ''
          : '',
      );
      setWater(
        props.existingItem.measurements?.waterPercentage
          ? props.existingItem.measurements.waterPercentage + ''
          : '',
      );
      setMuscleMass(
        props.existingItem.measurements?.muscleMassPercentage
          ? props.existingItem.measurements.muscleMassPercentage + ''
          : '',
      );
      setBoneMass(
        props.existingItem.measurements?.bonePercentage
          ? props.existingItem.measurements.bonePercentage + ''
          : '',
      );
      setEnergyExpenditure(
        props.existingItem.measurements?.energyExpenditure
          ? props.existingItem.measurements.energyExpenditure + ''
          : '',
      );
    } else {
      setTitle(TITLE_ADD);
      setDate(getCurrentDate());
    }
  }, [props.existingItem]);

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

  const addItem = (dto: AddWeightMeasurementRequestDto): void => {
    WeightMeasurementsService.getInstance()
      .addMeasurement(dto)
      .then(() => {
        dispatch(
          toasterActions.addMessage(
            new ToastMsg(cilBalanceScale, TOAST_TITLE_ADD_DEFAULT, TOAST_MESSAGE_ADD_SUCCESSFUL),
          ),
        );
        props.onSaveHandler();
        clearFormWithSlightTimeout();
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          toasterActions.addMessage(new ToastMsg(cilWarning, TOAST_TITLE_ADD_ERROR, err.message)),
        );
        setIsAddButtonDisabled(false);
      });
  };

  const editItem = (dto: EditWeightMeasurementRequestDto): void => {
    WeightMeasurementsService.getInstance()
      .editMeasurement(dto)
      .then(() => {
        dispatch(
          toasterActions.addMessage(
            new ToastMsg(cilBalanceScale, TOAST_TITLE_EDIT_DEFAULT, TOAST_MESSAGE_EDIT_SUCCESSFUL),
          ),
        );
        props.onSaveHandler();
        clearFormWithSlightTimeout();
      })
      .catch((err) => {
        console.error(err);
        dispatch(
          toasterActions.addMessage(new ToastMsg(cilWarning, TOAST_TITLE_EDIT_ERROR, err.message)),
        );
        setIsAddButtonDisabled(false);
      });
  };

  const onAddHandler = (): void => {
    const isFormValid = validateForm();

    if (isFormValid) {
      setIsAddButtonDisabled(true);
      if (!props.existingItem) {
        addItem(
          buildAddWeightMeasurementRequestDto(
            Date.parse(date),
            note,
            tryParseFloatStrict(weight),
            tryParseFloat(bodyFat),
            tryParseFloat(water),
            tryParseFloat(muscleMass),
            tryParseFloat(boneMass),
            tryParseFloat(energyExpenditure),
          ),
        );
      } else {
        editItem(
          buildEditWeightMeasurementRequestDto(
            measurementId,
            Date.parse(date),
            note,
            tryParseFloatStrict(weight),
            tryParseFloat(bodyFat),
            tryParseFloat(water),
            tryParseFloat(muscleMass),
            tryParseFloat(boneMass),
            tryParseFloat(energyExpenditure),
          ),
        );
      }
    }
  };

  const clearForm = (): void => {
    setIsValidated(DEFAULT_IS_VALIDATED);
    setDate(getCurrentDate());
    setNote('');
    setWeight('');
    setBodyFat('');
    setWater('');
    setMuscleMass('');
    setBoneMass('');
    setEnergyExpenditure('');
    setFormValidityState(DEFAULT_FORM_VALIDITY_STATE);
    setIsAddButtonDisabled(false);
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

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onAddHandler();
  };

  return (
    <Modal
      title={title}
      visible={props.visible}
      size="lg"
      primaryButtonText="Save Measurement"
      primaryButtonHandler={onAddHandler}
      primaryButtonDisabled={isAddButtonDisabled}
      showSecondaryButton={true}
      secondaryButtonColor="danger"
      secondaryButtonText="Close"
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm onSubmit={onSubmitHandler}>
        <CRow>
          <CCol sm={12} lg={6}>
            <FormInputGroupWithFeedback
              id="date"
              icon={cilClock}
              type="datetime-local"
              label="Date of Measurement"
              normalLabel={USE_NORMAL_LABELS}
              autoComplete="date"
              value={date}
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
              value={note}
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
              maxLength={3}
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
              maxLength={3}
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
              maxLength={3}
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
              maxLength={3}
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
              maxLength={3}
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
              maxLength={3}
              onChange={onEnergyExpenditureInputChangeHandler}
              invalid={isValidated && !formValidtyState.energyExpenditureValid}
            />
          </CCol>
        </CRow>
      </CForm>
    </Modal>
  );
};

export default AddEditWeightMeasurementForm;
