 import { store } from '../store/store';
  import { addNotification } from '../store/slices/uiSlice';
  
  /**
   * Handle API error and display notification
   * @param error Error object
   * @param fallbackMessage Fallback message to display if error doesn't have a message
   */
  export const handleApiError = (
    error: any,
    fallbackMessage = 'An unexpected error occurred'
  ): void => {
    const errorMessage = error.message || fallbackMessage;
    
    // Dispatch notification to Redux store
    store.dispatch(
      addNotification({
        message: errorMessage,
        type: 'error',
      })
    );
    
    // Log error to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error('API Error:', error);
    }
  };
  
  /**
   * Handle form validation error
   * @param error Error object
   * @param setErrors Function to set form errors
   */
  export const handleFormError = (
    error: any,
    setErrors: (errors: Record<string, string>) => void
  ): void => {
    // If the error has a response with validation errors
    if (error.errors && typeof error.errors === 'object') {
      setErrors(error.errors);
    } else {
      // Display general error notification
      handleApiError(error);
    }
  };
  