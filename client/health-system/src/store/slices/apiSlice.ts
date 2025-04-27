import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
// import { RootState } from '../store';
import { API_BASE_URL } from '../../constants/apiPaths';
// import { logout, refreshToken } from '../slices/authSlice';

// Create a base query without auth token handling
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers) => {
    // No auth header added
    
    // Add content type for JSON
    headers.set('Content-Type', 'application/json');
    
    return headers;
  },
});

// Create the API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQuery, // Using simple base query without auth logic
  tagTypes: ['Clients', 'Programs', 'User'],
  endpoints: () => ({}),
});