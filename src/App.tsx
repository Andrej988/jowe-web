import React, { type ReactElement, Suspense, useRef, useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './scss/style.scss';
import ProtectedRoute from './components/security/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from './services/auth/AuthService';
import { CToaster } from '@coreui/react';
import buildToast from './components/utils/Toaster';
import { type ToastMsg } from './store/ToasterSlice';
import { toasterActions, type RootState } from './store/Store';

// Containers
const MainLayout = React.lazy(async () => await import('./layout/MainLayout'));

// Pages
const LoginPage = React.lazy(async () => await import('./views/pages/auth/LoginPage'));
const RegisterPage = React.lazy(async () => await import('./views/pages/auth/RegisterPage'));
const Page404 = React.lazy(async () => await import('./views/pages/Page404'));

const App: React.FC = () => {
  const [isLoading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const [toast, addToast] = useState<ReactElement | undefined>();
  const toaster = useRef<HTMLDivElement | null>(null);
  const toastMessages: ToastMsg[] = useSelector((state: RootState) => state.toaster.toasts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (toastMessages.length > 0) {
      for (const toastMsg of toastMessages) {
        addToast(buildToast(toastMsg));
        dispatch(toasterActions.removeMessage());
      }
    }
  }, [toastMessages]);

  if (!isLoading && isAuthenticated === null) {
    setLoading(true);
    AuthService.getInstance()
      .autoLogin()
      .catch(() => {})
      .finally(() => {
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
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/404" element={<Page404 />} />
          <Route
            path="*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <MainLayout />
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
