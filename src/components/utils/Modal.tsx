import React, { Fragment } from 'react';
import type { PropsWithChildren } from 'react';
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

interface Props extends PropsWithChildren {
  title: string;
  visible: boolean;
  size?: 'sm' | 'lg' | 'xl' | undefined;
  primaryButtonIcon?: string | string[];
  primaryButtonText: string;
  primaryButtonColor?: string;
  primaryButtonHandler: () => void;
  showSecondaryButton: boolean;
  secondaryButtonIcon?: string | string[];
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
          color={props.primaryButtonColor === undefined ? 'secondary' : props.primaryButtonColor}
          variant="outline"
          onClick={props.primaryButtonHandler}
        >
          {props.primaryButtonIcon !== undefined && <CIcon icon={props.primaryButtonIcon} />}{' '}
          {props.primaryButtonText}
        </CButton>
        {props.showSecondaryButton ? (
          <CButton
            color={
              props.secondaryButtonColor === undefined ? 'secondary' : props.secondaryButtonColor
            }
            variant="outline"
            onClick={props.secondaryButtonHandler}
          >
            {props.secondaryButtonIcon !== undefined && <CIcon icon={props.secondaryButtonIcon} />}{' '}
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
