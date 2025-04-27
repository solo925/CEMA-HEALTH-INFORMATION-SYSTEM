import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Remove Navigate
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Provider } from 'react-redux';
import { store } from './store/store';
// import { useAppSelector, useAppDispatch } from './store/hooks';
// import { refreshToken } from './store/slices/authSlice';
import { ROUTES } from './constants/routes';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';
import theme from './theme/theme';

// Lazy loaded components
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ClientProfilePage = lazy(() => import('./pages/ClientProfilePage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
// const LoginPage = lazy(() => import('./pages/LoginPage'));
// const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

/*
// Authentication guard removed
const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
  
  if (loading) {
    return <LoadingSpinner fullPage text="Checking authentication..." />;
  }
  
  return isAuthenticated ? element : <Navigate to={ROUTES.LOGIN} replace />;
};
*/

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

// Main App component without auth checks
const App: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const { isAuthenticated } = useAppSelector((state) => state.auth);
  
  // Remove auth refresh
  /*
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(refreshToken());
    }
  }, [dispatch, isAuthenticated]);
  */
  
  return (
    <Router>
      <Suspense fallback={<LoadingSpinner fullPage text="Loading..." />}>
        <Routes>
          {/* Remove authentication routes
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} /> 
          */}
          
          {/* All routes now accessible without auth */}
          <Route path="/" element={<Layout><DashboardPage /></Layout>} />
          <Route path={ROUTES.DASHBOARD} element={<Layout><DashboardPage /></Layout>} />
          <Route path={ROUTES.CLIENTS.LIST} element={<Layout><ClientsPage /></Layout>} />
          <Route path={ROUTES.CLIENTS.DETAIL()} element={<Layout><ClientProfilePage /></Layout>} />
          <Route path={ROUTES.PROGRAMS.LIST} element={<Layout><ProgramsPage /></Layout>} />
          
          {/* Catch all route */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default AppWrapper;