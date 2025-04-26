import React, { ComponentType, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { ROUTES } from '../constants/routes';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const WithAuth: React.FC<P> = (props) => {
    const { isAuthenticated, loading } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate(ROUTES.LOGIN, { replace: true });
      }
    }, [isAuthenticated, loading, navigate]);

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};
