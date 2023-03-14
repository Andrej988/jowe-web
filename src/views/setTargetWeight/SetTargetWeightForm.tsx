import React, { PropsWithChildren } from 'react';
import Modal from 'src/components/modal/Modal';

interface Props extends PropsWithChildren {
  visible: boolean;
  onCloseHandler: () => void;
  onOkHandler: () => void;
}

const SetTargetWeightForm: React.FC<Props> = (props) => {
  return (
    <Modal
      title="Set Target Weight"
      visible={props.visible}
      showButtonOk={true}
      buttonOkText="Save"
      buttonCloseText="Close"
      onCloseHandler={props.onCloseHandler}
      onOkHandler={props.onOkHandler}
    >
      <p>Set target weight</p>
      <p>
        Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis lacus
        vel augue laoreet rutrum faucibus dolor auctor.
      </p>
    </Modal>
  );
};

export default SetTargetWeightForm;
