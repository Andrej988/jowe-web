import CIcon from '@coreui/icons-react';
import { CToast, CToastBody, CToastHeader } from '@coreui/react';
import React, { type ReactElement } from 'react';
import styles from './Toaster.module.css';
import { type ToastMsg } from 'src/store/ToasterSlice';

export const buildToast = (toastMsg: ToastMsg): ReactElement => {
  return (
    <CToast>
      <CToastHeader closeButton>
        <CIcon icon={toastMsg.icon} className={styles['extra-space']} />
        <div className="fw-bold me-auto">{toastMsg.title}</div>
      </CToastHeader>
      <CToastBody>{toastMsg.messsage}</CToastBody>
    </CToast>
  );
};

export default buildToast;
