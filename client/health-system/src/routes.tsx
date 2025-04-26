import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingSpinner from './components/common/LoadingSpinner';
import { ROUTES } from './constants/routes';

// Lazy-loaded components
const Dashboard = lazy(() => import('./pages/DashboardPage'));
const ClientsPage = lazy(() => import('./pages/ClientsPage'));
const ClientProfilePage = lazy(() => import('./pages/ClientProfilePage'));
const ProgramsPage = lazy(() => import('./pages/ProgramsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.CLIENTS.LIST} element={<ClientsPage />} />
        <Route path={ROUTES.CLIENTS.DETAIL()} element={<ClientProfilePage />} />
        <Route path={ROUTES.PROGRAMS.LIST} element={<ProgramsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;