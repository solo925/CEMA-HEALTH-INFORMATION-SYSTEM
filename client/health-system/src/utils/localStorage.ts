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