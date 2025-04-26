import { API_PATHS } from '../constants/apiPaths';

export const authService = {
  async login(email: string, password: string) {
    const response = await fetch(API_PATHS.AUTH.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error('Authentication failed');
    }
    
    return response.json();
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