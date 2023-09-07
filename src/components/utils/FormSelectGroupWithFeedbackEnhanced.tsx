import React, { useEffect } from 'react';
import Select, { ActionMeta, SingleValue } from 'react-select';
import './FormSelectGroupWithFeedbackEnhanced.css';
import { CFormLabel, CInputGroup, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import FormElementFeedback from './FormElementFeedback';

export interface ListOption {
  value: string;
  label: string;
}

interface Props {
  className?: string | undefined;
  icon: string | string[];
  id: string;
  value: ListOption | null;
  setValue?: React.Dispatch<React.SetStateAction<ListOption | null>>;
  onChange?: (newValue: SingleValue<ListOption>, actionMeta: ActionMeta<ListOption>) => void;
  label?: string;
  placeholder: string;
  options: ListOption[];
  feedbackMsg?: string;
  showFeedbackMsg?: boolean;
  disabled?: boolean;
}

const FormSelectGroupWithFeedbackEnhanced: React.FC<Props> = (props) => {
  useEffect(() => {
    if (props.setValue && props.value === null) {
      props.setValue(props.options.length === 1 ? props.options[0] : props.value);
    }
  }, [props.options, props.setValue, props.value]);

  return (
    <div className={props.className}>
      {props.label && <CFormLabel htmlFor={props.id}>{props.label}</CFormLabel>}
      <CInputGroup>
        <CInputGroupText>
          <CIcon icon={props.icon} />
        </CInputGroupText>
        <Select
          id={props.id}
          options={props.options}
          value={props.value}
          onChange={props.onChange}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder={props.placeholder}
          isDisabled={
            props.disabled ||
            props.options.length === 0 ||
            (props.value !== null && props.options.length === 1)
          }
        />
      </CInputGroup>
      {props.feedbackMsg != null && !props.value && props.showFeedbackMsg === true && (
        <FormElementFeedback feedbackMsg={props.feedbackMsg} />
      )}
    </div>
  );
};

export default FormSelectGroupWithFeedbackEnhanced;
