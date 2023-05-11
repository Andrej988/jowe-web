import { cilChartLine, cilWarning } from '@coreui/icons';
import { CForm, CFormInput } from '@coreui/react';
import React, {
  type FormEvent,
  type ChangeEvent,
  type PropsWithChildren,
  useEffect,
  useState,
} from 'react';
import { useDispatch } from 'react-redux';
import Modal from 'src/components/utils/Modal';
import WeightTargetsService from 'src/services/weight/WeightTargetsService';
import { ToastMsg, toasterActions } from 'src/store/Store';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

const MIN_TARGET_VALUE = 0;
const MAX_TARGET_VALUE = 999;
const INPUT_MESSAGE = `Target weight represents a reference point (line) on a weight graph. It serves as an indicator of how close you are to your target. Value must be between ${MIN_TARGET_VALUE} and ${MAX_TARGET_VALUE} kg.`;
const DEFAULT_VALUE_IS_TOUCHED = false;
const DEFAULT_VALUE_IS_VALID = false;
const DEFAULT_VALUE_TARGET_WEIGHT = '';

const TOAST_TITLE_SET_TARGET_WEIGHT_DEFAULT = 'Set Target Weight';
const TOAST_TITLE_SET_TARGET_WEIGHT_ERROR = 'Set Target Weight Error';
const TOAST_MESSAGE_SET_TARGET_WEIGHT_SUCCESSFUL = 'Target weight was successfully set.';

const isValidTargetWeight = (targetWeight: string | undefined): boolean => {
  if (targetWeight !== undefined) {
    const value = Number.parseFloat(targetWeight);
    if (!isNaN(value) && value >= MIN_TARGET_VALUE && value <= MAX_TARGET_VALUE) {
      return true;
    }
  }

  return false;
};

const SetTargetWeightForm: React.FC<Props> = (props) => {
  const [isTouched, setIsTouched] = useState(DEFAULT_VALUE_IS_TOUCHED);
  const [isValid, setIsValid] = useState(DEFAULT_VALUE_IS_VALID);
  const [targetWeight, setTargetWeight] = useState<string>(DEFAULT_VALUE_TARGET_WEIGHT);
  const [isbuttonDisabled, setIsButtonDisabled] = useState(false);
  const dispatch = useDispatch();

  const onTargetWeightInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!isTouched) {
      setIsTouched(true);
    }

    if (event.target.value.length <= 3) {
      setTargetWeight(event.target.value);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsValid(isValidTargetWeight(targetWeight));
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [targetWeight]);

  const clearForm = (): void => {
    setIsTouched(DEFAULT_VALUE_IS_TOUCHED);
    setIsValid(DEFAULT_VALUE_IS_VALID);
    setTargetWeight(DEFAULT_VALUE_TARGET_WEIGHT);
  };

  const onCloseFormHandler = (): void => {
    clearForm();
    props.onCloseHandler();
  };

  const onSetTargetWeightHandler = (): void => {
    if (isValidTargetWeight(targetWeight)) {
      setIsButtonDisabled(true);
      WeightTargetsService.getInstance()
        .addTargetWeight(Number.parseFloat(targetWeight))
        .then(() => {
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(
                cilChartLine,
                TOAST_TITLE_SET_TARGET_WEIGHT_DEFAULT,
                TOAST_MESSAGE_SET_TARGET_WEIGHT_SUCCESSFUL,
              ),
            ),
          );
          setIsButtonDisabled(false);
          props.onSaveHandler();
        })
        .catch((err) => {
          console.log(err);
          dispatch(
            toasterActions.addMessage(
              new ToastMsg(cilWarning, TOAST_TITLE_SET_TARGET_WEIGHT_ERROR, err.message),
            ),
          );
          setIsButtonDisabled(false);
        });
    }
  };

  const onSubmitHandler = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onSetTargetWeightHandler();
  };

  return (
    <Modal
      title="Set Target Weight"
      visible={props.visible}
      primaryButtonText="Save"
      primaryButtonHandler={onSetTargetWeightHandler}
      primaryButtonDisabled={isbuttonDisabled}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonColor="danger"
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm onSubmit={onSubmitHandler}>
        <CFormInput
          invalid={!isValid && isTouched}
          type="number"
          id="targetWeightInput"
          label="Target Weight (in kg)"
          pattern="[0-9]*"
          value={targetWeight}
          min={MIN_TARGET_VALUE}
          max={MAX_TARGET_VALUE}
          maxLength={3}
          text={INPUT_MESSAGE}
          onChange={onTargetWeightInputChangeHandler}
        />
      </CForm>
    </Modal>
  );
};

export default SetTargetWeightForm;
