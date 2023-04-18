import React, { type PropsWithChildren } from 'react';
import styles from './PasswordPolicyFeedback.module.css';
import { PASSWORD_POLICY } from 'src/config/ServiceConfig';
import { type PasswordPolicyDetail } from 'src/config/PasswordPolicy';

interface Props extends PropsWithChildren {
  invalid: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const getStringForPolicyDetail = (
  policyDetail: PasswordPolicyDetail,
  isLastItem: boolean,
): string => {
  const delimiter = isLastItem ? '.' : ',';
  return `${policyDetail}${delimiter}`;
};

const PasswordPolicyFeedback: React.FC<Props> = (props) => {
  let classNames = props.invalid ? 'invalid-feedback' : styles['feedback-valid'];

  if (props.className != null) {
    classNames = classNames + ' ' + props.className;
  }

  const style = props.style != null ? props.style : { display: 'block' };

  return (
    <div className={classNames} style={style}>
      Password must contain at least {PASSWORD_POLICY.minNumberOfChars} characters and must include:
      {PASSWORD_POLICY.policyDetails.length > 0 && (
        <ul>
          {PASSWORD_POLICY.policyDetails.map((detail, index) => {
            return (
              <li key={index}>
                {getStringForPolicyDetail(
                  detail,
                  index === PASSWORD_POLICY.policyDetails.length - 1,
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default PasswordPolicyFeedback;
