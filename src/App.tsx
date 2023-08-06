import React, { type ReactElement, Suspense, useRef, useState, useEffect } from 'react';
import { Route, Routes, HashRouter } from 'react-router-dom';
import './scss/style.scss';
import ProtectedRoute from './components/security/ProtectedRoute';
import { useDispatch, useSelector } from 'react-redux';
import AuthService from './services/auth/AuthService';
import { CToaster } from '@coreui/react';
import buildToast from './components/utils/Toaster';
import { type ToastMsg } from './store/ToasterSlice';
import { toasterActions, type RootState } from './store/Store';
import AutoLogoutForm from './views/pages/auth/AutoLogoutForm';

// Containers
const MainLayout = React.lazy(async () => await import('./layout/MainLayout'));

// Pages
const LoginPage = React.lazy(async () => await import('./views/pages/auth/LoginPage'));
const RegisterPage = React.lazy(async () => await import('./views/pages/auth/RegisterPage'));
const Page404 = React.lazy(async () => await import('./views/pages/Page404'));

const App: React.FC = () => {
  const [autoLogoutVisible, setAutoLogoutVisible] = useState(false);
  const logoutTime = useSelector((state: any) => state.auth.autoLogoutAt);

  const [isLoading, setLoading] = useState(false);
  const isAuthenticated = useSelector((state: any) => state.auth.isAuthenticated);
  const [toast, addToast] = useState<ReactElement | undefined>();
  const toaster = useRef<HTMLDivElement | null>(null);
  const toastMessages: ToastMsg[] = useSelector((state: RootState) => state.toaster.toasts);
  const dispatch = useDispatch();

  const closeAutoLogoutFormHandler = (): void => {
    setAutoLogoutVisible(false);
  };

  useEffect(() => {
    if (toastMessages.length > 0) {
      for (const toastMsg of toastMessages) {
        addToast(buildToast(toastMsg));
        dispatch(toasterActions.removeMessage());
      }
    }
  }, [toastMessages]);

  useEffect(() => {
    if (isAuthenticated === true && logoutTime > Date.now()) {
      const showInMillis = logoutTime - Date.now() - AuthService.SHOW_SESSION_PROLONGATION_FORM;

      const timerId = setTimeout(() => {
        setAutoLogoutVisible(true);
      }, showInMillis);

      // Cleanup
      return () => {
        clearTimeout(timerId);
      };
    } else {
      setAutoLogoutVisible(false);
    }
  }, [logoutTime, isAuthenticated]);

  if (!isLoading && isAuthenticated === null) {
    setLoading(true);
    AuthService.getInstance()
      .autoLogin()
      .catch((err) => {
        console.error(err);
      })
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
    <HashRouter>
      <Suspense fallback={loading}>
        <CToaster ref={toaster} push={toast} placement="top-end" />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/404" element={<Page404 />} />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
        <AutoLogoutForm visible={autoLogoutVisible} onCloseForm={closeAutoLogoutFormHandler} />
      </Suspense>
    </HashRouter>
  );

  return !isLoading ? content : loading;
};

export default App;
