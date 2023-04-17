import React from 'react';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  feedbackMsg: string;
}

const FormElementFeedback: React.FC<Props> = (props) => {
  return (
    <div className="invalid-feedback" style={{ display: 'block' }}>
      <p>{props.feedbackMsg}</p>
    </div>
  );
};

export default FormElementFeedback;
