import { API_PATHS } from '../constants/apiPaths';

class ApiService {
  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      // Get auth token from Redux store - COMMENTED OUT
      // const state = store.getState();
      // const token = state.auth.token;
      
      let headers = new Headers(options.headers || {});
      
      // AUTHENTICATION REMOVED
      // if (token) {
      //   headers.set('Authorization', `Bearer ${token}`);
      // }
      
      // Always send and receive JSON unless otherwise specified
      if (!headers.has('Content-Type') && options.method !== 'GET' && options.body) {
        headers.set('Content-Type', 'application/json');
      }
      
      console.log(`Making request to: ${url}`, { 
        method: options.method || 'GET',
        headers: Object.fromEntries(headers.entries()),
        body: options.body ? '(data)' : undefined 
      });
      
      const response = await fetch(url, {
        ...options,
        headers,
      });
      
      // TOKEN REFRESH LOGIC REMOVED
      // if (response.status === 401) {
      //   try {
      //     // Try to refresh the token
      //     await store.dispatch(refreshToken());
      //     
      //     // Retry the request with the new token
      //     return this.request<T>(url, options);
      //   } catch (refreshError) {
      //     // If refresh fails, log out the user
      //     store.dispatch(logout());
      //     throw new Error('Session expired. Please log in again.');
      //   }
      // }
      
      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', {
          status: response.status,
          statusText: response.statusText,
          data: errorData
        });
        
        throw new Error(
          errorData.message || errorData.detail || `Request failed with status ${response.status}`
        );
      }
      
      // Handle empty responses
      if (response.status === 204) {
        return {} as T;
      }
      
      // Parse JSON response
      const data = await response.json();
      console.log(`Response from ${url}:`, { status: response.status, data: '(data)' });
      return data as T;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }
  
  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' });
  }
  
  async post<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
  
  async put<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
  
  async patch<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
  
  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' });
  }
}

export const apiService = new ApiService();