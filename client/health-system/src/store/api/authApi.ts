import { apiSlice } from './apiSlice';
import { login as loginAction, logout } from '../slices/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    is_staff: boolean;
  };
}

export interface RegistrationRequest {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
  password_confirm: string;
}

export interface RegistrationResponse {
  message: string;
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface RefreshRequest {
  refresh: string;
}

export interface RefreshResponse {
  access: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Update the login mutation in authApi.ts to use the correct field names
login: builder.mutation({
  query: (credentials) => ({
    url: '/auth/login/',
    method: 'POST',
    body: credentials,
  }),
  async onQueryStarted(_, { dispatch, queryFulfilled }) {
    try {
      console.log("Login request started");
      const { data } = await queryFulfilled;
      console.log("Login successful, dispatching login action");
      dispatch(loginAction(data));
    } catch (error) {
      console.error("Login error in onQueryStarted:", error);
    }
  },
}),

    
    register: builder.mutation<RegistrationResponse, RegistrationRequest>({
      query: (userData) => ({
        url: '/auth/register/',
        method: 'POST',
        body: userData,
      }),
    }),
    
    refresh: builder.mutation<RefreshResponse, RefreshRequest>({
      query: (refreshToken) => ({
        url: '/auth/refresh/',
        method: 'POST',
        body: refreshToken,
      }),
    }),
    
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST'
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Dispatch logout action to clear auth state
          dispatch(logout());
        } catch (error) {
          // Error is handled by RTK Query
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshMutation,
  useLogoutMutation,
} = authApi;