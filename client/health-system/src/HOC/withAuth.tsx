// HOC/withAuth.tsx - Comment out or simplify to pass through

import React, { ComponentType } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAppSelector } from '../store/hooks';
// import { ROUTES } from '../constants/routes';
// import LoadingSpinner from '../components/common/LoadingSpinner';

export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  // Just return the component without auth checks
  const WithAuth: React.FC<P> = (props) => {
    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};