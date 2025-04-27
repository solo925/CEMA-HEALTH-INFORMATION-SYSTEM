import { apiSlice } from './apiSlice';
import { login as loginAction, logout } from '../slices/authSlice';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string; 
  email:string;
  password:string; 
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

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login/',
        method: 'POST',
        body: { email: credentials.email, password: credentials.password },
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(loginAction(data));  // Dispatch login action with token
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

    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/auth/logout/',
        method: 'POST',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());  // Dispatch logout action to clear auth state
        } catch (error) {
          console.error("Logout error in onQueryStarted:", error);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
} = authApi;
