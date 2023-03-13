import { Amplify } from 'aws-amplify';
// @ts-ignore
import awsExports from './aws-exports';
import React, { Suspense, useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import './scss/style.scss';
import ProtectedRoute from './components/security/ProtectedRoute';
import { useSelector } from 'react-redux';
import AuthService from './security/AuthService';
Amplify.configure(awsExports);

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const LoginPage = React.lazy(() => import('./views/pages/LoginPage'));
const Page404 = React.lazy(() => import('./views/pages/Page404'));

const App: React.FC<{}> = () => {
  const [isLoading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);

  if (!isLoading && isAuthenticated === null) {
    setLoading(true);
    AuthService.checkIfUserAlreadySignedIn().finally(() => {
      setLoading(false);
    });
  }

  const loading = (
    <div className="pt-3 text-center">
      <div className="sk-spinner sk-spinner-pulse"></div>
    </div>
  );

  const content = (
    <HashRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/404" element={<Page404 />} />
          <Route
            path="*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DefaultLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </HashRouter>
  );

  return !isLoading ? content : loading;
};

export default App;
