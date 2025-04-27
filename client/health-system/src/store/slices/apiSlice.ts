import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { API_BASE_URL } from '../../constants/apiPaths';
import { logout, refreshToken } from '../slices/authSlice';

// Create a base query with auth token handling and refresh logic
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    // Get token from state
    const token = (getState() as RootState).auth.token;
    
    // Add auth header if token exists
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    
    // Add content type for JSON
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
  credentials: 'include',
});

// Create a custom base query with token refresh logic and better error handling
const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  console.log('Making request to:', args.url);
  
  // Try the initial query
  let result = await baseQuery(args, api, extraOptions);
  
  console.log('Request result:', result);
  
  // If we get a 401 Unauthorized response, try to refresh the token
  if (result.error && result.error.status === 401) {
    console.log('Request failed with 401, attempting token refresh');
    
    // Try to get a new token
    const refreshResult = await api.dispatch(refreshToken());
    
    // If token refresh was successful, retry the original query
    if (refreshResult.meta.requestStatus === 'fulfilled') {
      console.log('Token refresh successful, retrying original request');
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('Token refresh failed, logging out');
      // If token refresh failed, log the user out
      api.dispatch(logout());
    }
  }
  
  return result;
};

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Clients', 'Programs', 'User'],
  endpoints: () => ({}),
});