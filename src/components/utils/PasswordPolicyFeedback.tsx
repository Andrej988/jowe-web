import React, { type PropsWithChildren } from 'react';
import styles from './PasswordPolicyFeedback.module.css';

interface Props extends PropsWithChildren {
  invalid: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PasswordPolicyFeedback: React.FC<Props> = (props) => {
  let classNames = props.invalid ? 'invalid-feedback' : styles['feedback-valid'];

  if (props.className != null) {
    classNames = classNames + ' ' + props.className;
  }

  const style = props.style != null ? props.style : { display: 'block' };

  return (
    <div className={classNames} style={style}>
      Password must contain at least 8 characters and must include:
      <ul>
        <li>at least one number,</li>
        <li>at least one uppercase letter,</li>
        <li>at least one lowercase letter,</li>
        <li>at least one special character (!, @, #, $, %, ^, &, *, =, +, or -).</li>
      </ul>
    </div>
  );
};

export default PasswordPolicyFeedback;
