/**
 * Format a date string to a localized date display
 * @param dateString ISO date string
 * @param locale Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (
    dateString: string | null | undefined,
    locale = 'en-US'
  ): string => {
    if (!dateString) return '-';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };
  
  /**
   * Format a date-time string to a localized date-time display
   * @param dateTimeString ISO date-time string
   * @param locale Locale string (default: 'en-US')
   * @returns Formatted date-time string
   */
  export const formatDateTime = (
    dateTimeString: string | null | undefined,
    locale = 'en-US'
  ): string => {
    if (!dateTimeString) return '-';
    
    try {
      const date = new Date(dateTimeString);
      return new Intl.DateTimeFormat(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(date);
    } catch (error) {
      console.error('Error formatting date-time:', error);
      return dateTimeString;
    }
  };
  
  /**
   * Format a number as currency
   * @param amount Number to format
   * @param currency Currency code (default: 'USD')
   * @param locale Locale string (default: 'en-US')
   * @returns Formatted currency string
   */
  export const formatCurrency = (
    amount: number | null | undefined,
    currency = 'USD',
    locale = 'en-US'
  ): string => {
    if (amount === null || amount === undefined) return '-';
    
    try {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return `${amount}`;
    }
  };
  
  /**
   * Format a phone number to a readable format
   * @param phone Phone number string
   * @returns Formatted phone number
   */
  export const formatPhoneNumber = (phone: string | null | undefined): string => {
    if (!phone) return '-';
    
    // Remove all non-digits
    const digitsOnly = phone.replace(/\D/g, '');
    
    // Format based on length
    if (digitsOnly.length === 10) {
      return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6, 10)}`;
    } else if (digitsOnly.length === 11 && digitsOnly[0] === '1') {
      return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7, 11)}`;
    }
    
    // If no formatting rules match, return the original
    return phone;
  };
  
  /**
   * Format a name to title case
   * @param name Name string
   * @returns Title-cased name
   */
  export const formatName = (name: string | null | undefined): string => {
    if (!name) return '-';
    
    return name
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  /**
   * Truncate a long text to a specified length with ellipsis
   * @param text Text to truncate
   * @param maxLength Maximum length before truncation
   * @returns Truncated text with ellipsis if needed
   */
  export const truncateText = (
    text: string | null | undefined,
    maxLength = 100
  ): string => {
    if (!text) return '-';
    
    if (text.length <= maxLength) return text;
    
    return text.substring(0, maxLength) + '...';
  };
  