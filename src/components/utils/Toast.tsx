import CIcon from '@coreui/icons-react';
import { CToast, CToastBody, CToastHeader } from '@coreui/react';
import React, { type ReactElement } from 'react';
import styles from './Toast.module.css';

export const buildToast = (
  icon: string | string[],
  title: string,
  message: string,
): ReactElement => {
  return (
    <CToast>
      <CToastHeader closeButton>
        <CIcon icon={icon} className={styles['extra-space']} />
        <div className="fw-bold me-auto">{title}</div>
      </CToastHeader>
      <CToastBody>{message}</CToastBody>
    </CToast>
  );
};

export default buildToast;
