import React, { Fragment, PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

interface Props extends PropsWithChildren {
  isAuthenticated: boolean;
}

const ProtectedRoute: React.FC<Props> = (props) => {
  if (!props.isAuthenticated) {
    return <Navigate replace to="/login" />;
  }
  return <Fragment>{props.children}</Fragment>;
};

export default ProtectedRoute;
