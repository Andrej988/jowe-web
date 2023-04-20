import CIcon from '@coreui/icons-react';
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react';
import React, { Fragment } from 'react';
import type { PropsWithChildren } from 'react';
import FormElementFeedback from './FormElementFeedback';
import PasswordPolicyFeedback from './PasswordPolicyFeedback';
import { type PasswordValidationResult } from 'src/services/auth/PasswordPolicy';

interface Props extends PropsWithChildren {
  className?: string | undefined;
  icon: string | string[];
  id: string;
  type: string;
  label: string;
  invalid?: boolean;
  autoFocus?: boolean;
  autoComplete: string;
  disabled?: boolean;
  required?: boolean;
  feedbackMsg?: string;
  feedbackPaswordPolicy?: boolean;
  value?: string | number | string[];
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  inputRef?: React.Ref<HTMLInputElement>;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  showValidIndicator?: boolean;
  passwordValidationResults?: PasswordValidationResult;
}

const FormInputGroupWithFeedback: React.FC<Props> = (props) => {
  return (
    <Fragment>
      <CInputGroup className={props.className}>
        <CInputGroupText>
          <CIcon icon={props.icon} />
        </CInputGroupText>
        <CFormInput
          id={props.id}
          type={props.type}
          floatingLabel={props.label}
          placeholder={props.label}
          invalid={props.invalid}
          autoFocus={props.autoFocus}
          autoComplete={props.autoComplete}
          required={props.required}
          disabled={props.disabled}
          value={props.value}
          onChange={props.onChange}
          ref={props.inputRef}
          minLength={props.minLength}
          maxLength={props.maxLength}
          pattern={props.pattern}
          valid={
            props.showValidIndicator === true &&
            props.invalid === false &&
            (props.disabled === false || props.disabled === undefined)
          }
        />
      </CInputGroup>
      {props.feedbackPaswordPolicy !== true &&
        props.feedbackMsg != null &&
        props.invalid != null &&
        props.invalid && <FormElementFeedback feedbackMsg={props.feedbackMsg} />}
      {props.feedbackPaswordPolicy === true && props.invalid != null && props.invalid && (
        <PasswordPolicyFeedback
          invalid={true}
          passwordValidationResults={props.passwordValidationResults}
        />
      )}
    </Fragment>
  );
};

export default FormInputGroupWithFeedback;
