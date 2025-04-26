/**
   * Validate an email address
   * @param email Email string to validate
   * @returns True if email is valid, false otherwise
   */
  export const isValidEmail = (email: string): boolean => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };
  
  /**
   * Validate a phone number
   * @param phone Phone number to validate
   * @returns True if phone number is valid, false otherwise
   */
  export const isValidPhone = (phone: string): boolean => {
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Check if the result is either 10 digits, or 11 digits starting with 1
    return (
      digitsOnly.length === 10 ||
      (digitsOnly.length === 11 && digitsOnly[0] === '1')
    );
  };
  
  /**
   * Validate a date string
   * @param dateString Date string to validate
   * @returns True if date is valid, false otherwise
   */
  export const isValidDate = (dateString: string): boolean => {
    // Check if the input creates a valid date
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };
  
  /**
   * Validate password strength
   * @param password Password to validate
   * @returns Object with validation result and message
   */
  export const validatePassword = (
    password: string
  ): { isValid: boolean; message: string } => {
    if (password.length < 8) {
      return {
        isValid: false,
        message: 'Password must be at least 8 characters long',
      };
    }
    
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChars = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase) {
      return {
        isValid: false,
        message: 'Password must contain both uppercase and lowercase letters',
      };
    }
    
    if (!hasNumbers) {
      return {
        isValid: false,
        message: 'Password must contain at least one number',
      };
    }
    
    if (!hasSpecialChars) {
      return {
        isValid: false,
        message: 'Password must contain at least one special character',
      };
    }
    
    return { isValid: true, message: 'Password is strong' };
  };
  
  /**
   * Validate required fields in an object
   * @param data Object to validate
   * @param requiredFields Array of required field names
   * @returns Object with validation result and errors
   */
  export const validateRequiredFields = (
    data: Record<string, any>,
    requiredFields: string[]
  ): { isValid: boolean; errors: Record<string, string> } => {
    const errors: Record<string, string> = {};
    
    for (const field of requiredFields) {
      if (
        data[field] === undefined ||
        data[field] === null ||
        data[field] === ''
      ) {
        errors[field] = 'This field is required';
      }
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };
