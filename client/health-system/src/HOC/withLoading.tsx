import React, { ComponentType } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';

interface WithLoadingProps {
  isLoading: boolean;
}

export const withLoading = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const WithLoading: React.FC<P & WithLoadingProps> = ({ isLoading, ...props }) => {
    if (isLoading) {
      return <LoadingSpinner />;
    }

    return <WrappedComponent {...(props as P)} />;
  };

  return WithLoading;
};