import React, { Fragment, useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<PropsWithChildren> = (props) => {
  const isAuthenticatedRedux: boolean = useSelector((state: any) => state.auth.isAuthenticated);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(isAuthenticatedRedux);

  useEffect(() => {
    setIsAuthenticated(isAuthenticatedRedux);
  }, [isAuthenticatedRedux]);

  if (!isAuthenticated) {
    return <Navigate replace to="/login" />;
  }
  return <Fragment>{props.children}</Fragment>;
};

export default ProtectedRoute;
