// auth.service.ts - Updated version
import { API_PATHS } from '../constants/apiPaths';
import { Credentials } from '../types/index.types';

export const authService = {
  async login(credentials: Credentials) {


    // Debugging logs with actual values
    console.log('Processed credentials:', {
      processedEmail: credentials.email,
      processedPassword: credentials.password
    });

    if (!credentials.email || !credentials.password) {
      throw new Error(`Validation failed - Email: "${credentials.email}", Password: "${credentials.password}"`);
    }

    const response = await fetch(API_PATHS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
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

