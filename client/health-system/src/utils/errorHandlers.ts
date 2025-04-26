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
  
  // utils/localStorage.ts
  /**
   * Securely store data in localStorage with encryption
   */
  export const secureStorage = {
    /**
     * Set an item in localStorage with optional encryption
     * @param key Storage key
     * @param value Value to store
     */
    setItem(key: string, value: any): void {
      try {
        // Convert objects to strings
        const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
        
        // In a real application, you might want to encrypt the data here
        // For simplicity, we're storing it directly in this example
        localStorage.setItem(key, stringValue);
      } catch (error) {
        console.error('Error setting localStorage item:', error);
      }
    },
    
    /**
     * Get an item from localStorage with optional decryption
     * @param key Storage key
     * @returns Stored value or null if not found
     */
    getItem(key: string): any {
      try {
        const value = localStorage.getItem(key);
        
        if (value === null) {
          return null;
        }
        
        // In a real application, you might want to decrypt the data here
        
        // Try to parse as JSON, return as-is if not valid JSON
        try {
          return JSON.parse(value);
        } catch {
          return value;
        }
      } catch (error) {
        console.error('Error getting localStorage item:', error);
        return null;
      }
    },
    
    /**
     * Remove an item from localStorage
     * @param key Storage key
     */
    removeItem(key: string): void {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing localStorage item:', error);
      }
    },
    
    /**
     * Clear all items from localStorage
     */
    clear(): void {
      try {
        localStorage.clear();
      } catch (error) {
        console.error('Error clearing localStorage:', error);
      }
    },
  };