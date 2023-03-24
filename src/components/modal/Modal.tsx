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
  size?: 'sm' | 'lg' | 'xl' | undefined;
  primaryButtonText: string;
  primaryButtonColor?: string;
  primaryButtonHandler: () => void;
  showSecondaryButton: boolean;
  secondaryButtonText?: string;
  secondaryButtonColor?: string;
  secondaryButtonHandler?: () => void;
  onCloseButtonHandler: () => void;
}

const Modal: React.FC<Props> = (props) => {
  return (
    <CModal
      alignment="center"
      backdrop="static"
      scrollable
      visible={props.visible}
      onClose={props.onCloseButtonHandler}
      size={props.size}
    >
      <CModalHeader>
        <CModalTitle>{props.title}</CModalTitle>
      </CModalHeader>
      <CModalBody>{props.children}</CModalBody>
      <CModalFooter>
        <CButton
          color={props.primaryButtonColor === undefined ? 'dark' : props.primaryButtonColor}
          variant="outline"
          onClick={props.primaryButtonHandler}
        >
          {props.primaryButtonText}
        </CButton>
        {props.showSecondaryButton ? (
          <CButton
            color={props.secondaryButtonColor === undefined ? 'dark' : props.secondaryButtonColor}
            variant="outline"
            onClick={props.secondaryButtonHandler}
          >
            {props.secondaryButtonText}
          </CButton>
        ) : (
          <Fragment></Fragment>
        )}
      </CModalFooter>
    </CModal>
  );
};

export default Modal;
