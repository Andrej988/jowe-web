import { CForm, CFormInput } from '@coreui/react';
import React, { ChangeEvent, PropsWithChildren, useEffect, useState } from 'react';
import Modal from 'src/components/modal/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onSaveHandler: () => void;
}

const MIN_TARGET_VALUE = 40;
const MAX_TARGET_VALUE = 200;
const INPUT_MESSAGE = `Target weight represents a reference point (line) on a weight graph. It serves as an indicator of how close you are to your target. Value must be between ${MIN_TARGET_VALUE} and ${MAX_TARGET_VALUE} kg.`;
const DEFAULT_VALUE_IS_TOUCHED = false;
const DEFAULT_VALUE_IS_VALID = false;
const DEFAULT_VALUE_TARGET_WEIGHT = '';

const SetTargetWeightForm: React.FC<Props> = (props) => {
  const [isTouched, setIsTouched] = useState(DEFAULT_VALUE_IS_TOUCHED);
  const [isValid, setIsValid] = useState(DEFAULT_VALUE_IS_VALID);
  const [targetWeight, setTargetWeight] = useState<string>(DEFAULT_VALUE_TARGET_WEIGHT);

  const onTargetWeightInputChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
    if (!isTouched) {
      setIsTouched(true);
    }

    if (event.target.value.length <= 3) {
      setTargetWeight(event.target.value);
    }
  };

  useEffect(() => {
    const value = Number(targetWeight);
    const timer = setTimeout(() => {
      setIsValid(value !== undefined && value >= MIN_TARGET_VALUE && value <= MAX_TARGET_VALUE);
    }, 250);

    return () => {
      clearTimeout(timer);
    };
  }, [targetWeight]);

  const clearForm = () => {
    setIsTouched(DEFAULT_VALUE_IS_TOUCHED);
    setIsValid(DEFAULT_VALUE_IS_VALID);
    setTargetWeight(DEFAULT_VALUE_TARGET_WEIGHT);
  };

  const onCloseFormHandler = (): void => {
    clearForm();
    props.onCloseHandler();
  };

  return (
    <Modal
      title="Set Target Weight"
      visible={props.visible}
      primaryButtonText="Save"
      primaryButtonHandler={props.onSaveHandler}
      showSecondaryButton={true}
      secondaryButtonText="Cancel"
      secondaryButtonColor="danger"
      secondaryButtonHandler={onCloseFormHandler}
      onCloseButtonHandler={onCloseFormHandler}
    >
      <CForm>
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
