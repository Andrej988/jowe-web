import { Amplify } from 'aws-amplify';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import awsExports from './aws-exports';
import React, { Suspense, useState } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './scss/style.scss';
import ProtectedRoute from './components/security/ProtectedRoute';
import { useSelector } from 'react-redux';
import AuthService from './security/AuthService';
Amplify.configure(awsExports);

// Containers
const DefaultLayout = React.lazy(async () => await import('./layout/DefaultLayout'));

// Pages
const LoginPage = React.lazy(async () => await import('./views/pages/LoginPage'));
const RegisterPage = React.lazy(async () => await import('./views/pages/RegisterPage'));
const Page404 = React.lazy(async () => await import('./views/pages/Page404'));

const App: React.FC = () => {
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
    <BrowserRouter>
      <Suspense fallback={loading}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
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
    </BrowserRouter>
  );

  return !isLoading ? content : loading;
};

export default App;
