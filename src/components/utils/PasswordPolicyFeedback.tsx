import React, { type PropsWithChildren } from 'react';
import styles from './PasswordPolicyFeedback.module.css';
import { PASSWORD_POLICY } from 'src/config/ServiceConfig';
import {
  type PasswordValidationResult,
  type PasswordPolicyDetail,
} from 'src/services/auth/PasswordPolicy';

interface Props extends PropsWithChildren {
  invalid: boolean;
  className?: string;
  style?: React.CSSProperties;
  passwordValidationResults?: PasswordValidationResult;
}

const getStringForPolicyDetail = (
  policyDetail: PasswordPolicyDetail,
  isLastItem: boolean,
): string => {
  const delimiter = isLastItem ? '.' : ',';
  return `${policyDetail}${delimiter}`;
};

const isPolicyDetailValid = (
  policyDetail: PasswordPolicyDetail,
  passwordValidationResults: PasswordValidationResult,
): boolean => {
  if (passwordValidationResults === undefined) {
    return true;
  } else {
    const validationForPolicy = passwordValidationResults.detailValid.get(policyDetail);
    return validationForPolicy !== undefined ? validationForPolicy : true;
  }
};

const getPolicyDetailStyle = (
  isInvalidPrint: boolean,
  policyDetail: PasswordPolicyDetail,
  passwordValidationResults: PasswordValidationResult | undefined,
): React.CSSProperties | undefined => {
  if (
    isInvalidPrint &&
    passwordValidationResults !== undefined &&
    isPolicyDetailValid(policyDetail, passwordValidationResults)
  ) {
    return { color: 'green' };
  } else {
    return undefined;
  }
};

const getPasswordLengthStyle = (
  isInvalidPrint: boolean,
  passwordValidationResults: PasswordValidationResult | undefined,
): React.CSSProperties | undefined => {
  if (
    isInvalidPrint &&
    passwordValidationResults !== undefined &&
    !passwordValidationResults.notEnoughChars
  ) {
    return { color: 'darkgreen' };
  } else {
    return undefined;
  }
};

const PasswordPolicyFeedback: React.FC<Props> = (props) => {
  let classNames = props.invalid ? 'invalid-feedback' : styles['feedback-valid'];

  if (props.className != null) {
    classNames = classNames + ' ' + props.className;
  }

  const style = props.style != null ? props.style : { display: 'block' };

  return (
    <div className={classNames} style={style}>
      Password must contain the following: at least {PASSWORD_POLICY.minNumberOfChars} characters
      and must include:
      <ul>
        <li key={0} style={getPasswordLengthStyle(props.invalid, props.passwordValidationResults)}>
          at least {PASSWORD_POLICY.minNumberOfChars} characters,
        </li>

        {PASSWORD_POLICY.policyDetails.map((detail, index) => {
          return (
            <li
              key={index + 1}
              style={getPolicyDetailStyle(
                props.invalid,
                detail,
                props.passwordValidationResults !== undefined
                  ? props.passwordValidationResults
                  : undefined,
              )}
            >
              {getStringForPolicyDetail(detail, index === PASSWORD_POLICY.policyDetails.length - 1)}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PasswordPolicyFeedback;
