import CIcon from '@coreui/icons-react';
import { CInputGroup, CInputGroupText, CFormInput, CFormLabel, CButton } from '@coreui/react';
import React, { Fragment, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import FormElementFeedback from './FormElementFeedback';
import PasswordPolicyFeedback from './PasswordPolicyFeedback';
import { type PasswordValidationResult } from 'src/services/auth/PasswordPolicy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
  min?: number;
  max?: number;
  pattern?: string;
  showValidIndicator?: boolean;
  passwordValidationResults?: PasswordValidationResult;
  normalLabel?: boolean;
}

const FormInputGroupWithFeedback: React.FC<Props> = (props) => {
  const [inputType, setInputType] = useState<string>(props.type);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const toggleShowPasswordHandler = (): void => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (props.type === 'password' && showPassword) {
      setInputType('text');
    } else {
      setInputType(props.type);
    }
  }, [showPassword]);

  return (
    <Fragment>
      <div className={props.className}>
        {props.normalLabel === true && <CFormLabel htmlFor={props.id}>{props.label}</CFormLabel>}
        <CInputGroup>
          <CInputGroupText>
            <CIcon icon={props.icon} />
          </CInputGroupText>
          <CFormInput
            id={props.id}
            type={inputType}
            floatingLabel={props.normalLabel === true ? undefined : props.label}
            placeholder={props.normalLabel === true ? undefined : props.label}
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
            min={props.min}
            max={props.max}
            pattern={props.pattern}
            valid={
              props.showValidIndicator === true &&
              props.invalid === false &&
              (props.disabled === false || props.disabled === undefined)
            }
          />
          {props.type === 'password' && (
            <CButton
              type="button"
              color="secondary"
              variant="outline"
              id="showPasswordBtn"
              onClick={toggleShowPasswordHandler}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </CButton>
          )}
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
      </div>
    </Fragment>
  );
};

export default FormInputGroupWithFeedback;
