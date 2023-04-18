import CIcon from '@coreui/icons-react';
import { CInputGroup, CInputGroupText, CFormSelect } from '@coreui/react';
import React, { Fragment } from 'react';
import type { PropsWithChildren } from 'react';
import FormElementFeedback from './FormElementFeedback';

interface Option {
  disabled?: boolean;
  label?: string;
  value?: string;
}

interface Props extends PropsWithChildren {
  className?: string | undefined;
  icon: string | string[];
  id: string;
  label: string;
  invalid?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
  required?: boolean;
  feedbackMsg: string;
  value?: string | number | string[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  defaultValue: string | number;
  options: Option[];
  ref?: React.Ref<HTMLSelectElement>;
  showValidIndicator?: boolean;
}

const FormSelectGroupWithFeedback: React.FC<Props> = (props) => {
  return (
    <Fragment>
      <CInputGroup className={props.className}>
        <CInputGroupText>
          <CIcon icon={props.icon} />
        </CInputGroupText>
        <CFormSelect
          id={props.id}
          floatingLabel=" "
          placeholder=""
          aria-label={props.label}
          required={props.required}
          disabled={props.disabled}
          invalid={props.invalid}
          value={props.value}
          onChange={props.onChange}
          options={props.options}
          ref={props.ref}
          valid={
            props.showValidIndicator === true &&
            props.invalid === false &&
            (props.disabled === false || props.disabled === undefined)
          }
        />
      </CInputGroup>
      {props.feedbackMsg != null && props.invalid != null && props.invalid && (
        <FormElementFeedback feedbackMsg={props.feedbackMsg} />
      )}
    </Fragment>
  );
};

export default FormSelectGroupWithFeedback;
