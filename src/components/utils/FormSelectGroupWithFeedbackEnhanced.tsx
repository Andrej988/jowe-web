import React, { useState } from 'react';
import Select from 'react-select';
import './FormSelectGroupWithFeedbackEnhanced.css';
import { CFormLabel, CInputGroup, CInputGroupText } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import FormElementFeedback from './FormElementFeedback';

interface Option {
  value: string;
  label: string;
}

interface Props {
  className?: string | undefined;
  icon: string | string[];
  id: string;
  label?: string;
  placeholder: string;
  options: Option[];
  feedbackMsg?: string;
  showFeedbackMsg?: boolean;
}

const FormSelectGroupWithFeedbackEnhanced: React.FC<Props> = (props) => {
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);

  const handleChange = (option: Option | null) => {
    setSelectedOption(option);
  };

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
          value={selectedOption}
          onChange={handleChange}
          className="react-select-container"
          classNamePrefix="react-select"
          placeholder={props.placeholder}
        />
      </CInputGroup>
      {props.feedbackMsg != null && !selectedOption && props.showFeedbackMsg === true && (
        <FormElementFeedback feedbackMsg={props.feedbackMsg} />
      )}
    </div>
  );
};

export default FormSelectGroupWithFeedbackEnhanced;
