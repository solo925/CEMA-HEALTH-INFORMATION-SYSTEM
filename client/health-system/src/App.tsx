import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { refreshToken } from './store/slices/authSlice';
import { ROUTES } from './constants/routes';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import theme from './theme/theme';

// Lazy loaded components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ClientProfilePage = lazy(() => import('./pages/ClientProfilePage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Auth guard component
type T = any
const PrivateRoute: React.FC<T> = ({ element }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  if (loading) {
    return <LoadingSpinner fullPage text="Checking authentication..." />;
  }
  
  return isAuthenticated ? element : <Navigate to={ROUTES.LOGIN} replace />;
};

// App wrapper for providers
const AppWrapper: React.FC = () => {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </Provider>
  );
};

// Main App component
const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Try to refresh token on app load
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(refreshToken());
    }
  }, [dispatch, isAuthenticated]);
  
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullPage text="Loading..." />}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <PrivateRoute
                element={<Layout><DashboardPage /></Layout>}
              />
            }
          />
          
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <PrivateRoute
                element={<Layout><DashboardPage /></Layout>}
              />
            }
          />
          
          <Route
            path={ROUTES.CLIENTS.LIST}
            element={
              <PrivateRoute
                element={<Layout><ClientsPage /></Layout>}
              />
            }
          />
          
          <Route
            path={ROUTES.CLIENTS.DETAIL()}
            element={
              <PrivateRoute
                element={<Layout><ClientProfilePage /></Layout>}
              />
            }
          />
          
          <Route
            path={ROUTES.PROGRAMS.LIST}
            element={
              <PrivateRoute
                element={<Layout><ProgramsPage /></Layout>}
              />
            }
          />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppWrapper;

