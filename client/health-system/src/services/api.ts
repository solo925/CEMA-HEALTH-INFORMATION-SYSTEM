import { API_PATHS } from '../constants/apiPaths';
import { store } from '../store/store';
import { refreshToken, logout } from '../store/slices/authSlice';

interface RequestOptions extends RequestInit {
  skipAuth?: boolean;
}

class ApiService {
  private async request<T>(url: string, options: RequestOptions = {}): Promise<T> {
    try {
      const { skipAuth = false, ...fetchOptions } = options;
      
      // Get auth token from Redux store
      let headers = new Headers(fetchOptions.headers || {});
      
      if (!skipAuth) {
        const state = store.getState();
        const token = state.auth.token;
        
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      }
      
      // Always send and receive JSON unless otherwise specified
      if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
        headers.set('Content-Type', 'application/json');
      }
      
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });
      
      // Handle token expiration
      if (response.status === 401) {
        try {
          // Try to refresh the token
          await store.dispatch(refreshToken());
          
          // Retry the request with the new token
          return this.request<T>(url, options);
        } catch (refreshError) {
          // If refresh fails, log out the user
          store.dispatch(logout());
          throw new Error('Session expired. Please log in again.');
        }
      }
      
      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Request failed with status ${response.status}`
        );
      }
      
      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }
      
      // Parse JSON response
      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  async get<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
  
  async post<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async put<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async patch<T>(url: string, data: any, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
  
  async delete<T>(url: string, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const apiService = new ApiService();

