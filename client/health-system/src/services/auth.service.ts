// auth.service.ts - Updated version
import { API_PATHS } from '../constants/apiPaths';
export const authService = {
  async login(email: unknown, password: unknown) {
    // Convert inputs with strict type checking
    const convertValue = (val: unknown) => {
      if (typeof val !== 'string') {
        console.error('Invalid type received:', { val, type: typeof val });
        return '';
      }
      return val.trim();
    };

    const strEmail = convertValue(email);
    const strPassword = convertValue(password);

    // Debugging logs with actual values
    console.log('Processed credentials:', {
      originalEmail: email,
      originalPassword: password,
      processedEmail: strEmail,
      processedPassword: strPassword
    });

    if (!strEmail || !strPassword) {
      throw new Error(`Validation failed - Email: "${strEmail}", Password: "${strPassword}"`);
    }

    // Rest of the existing code remains unchanged
    const response = await fetch(API_PATHS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: strEmail,
        password: strPassword
      }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error('Login response error:', errorData || response.statusText);
      throw new Error(errorData?.detail || 'Authentication failed');
    }

    const data = await response.json();
    console.log('Login response (sanitized):', { ...data, access: '[REDACTED]', refresh: '[REDACTED]' });
    return data;
  },

  async refreshToken(refreshToken: string) {
    const response = await fetch(API_PATHS.AUTH.REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (!response.ok) {
      throw new Error('Token refresh failed');
    }
    
    return response.json();
  },
  
  async logout(refreshToken: string) {
    const response = await fetch(API_PATHS.AUTH.LOGOUT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    return response.ok;
  },
};

