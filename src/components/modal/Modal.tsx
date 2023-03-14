import React, { Fragment, PropsWithChildren } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';

interface Props extends PropsWithChildren {
  title: string;
  visible: boolean;
  buttonOkText: string;
  buttonCloseText: string;
  showButtonOk: boolean;
  onCloseHandler: () => void;
  onOkHandler?: () => void;
}

const Modal: React.FC<Props> = (props) => {
  return (
    <CModal
      alignment="center"
      backdrop="static"
      scrollable
      visible={props.visible}
      onClose={props.onCloseHandler}
    >
      <CModalHeader>
        <CModalTitle>{props.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{props.children}</CModalBody>
      <CModalFooter>
        <CButton color="danger" variant="outline" onClick={props.onCloseHandler}>
          {props.buttonCloseText}
        </CButton>
        {props.showButtonOk ? (
          <CButton color="dark" variant="outline" onClick={props.onOkHandler}>
            {props.buttonOkText}
          </CButton>
        ) : (
          <Fragment></Fragment>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default Modal;
