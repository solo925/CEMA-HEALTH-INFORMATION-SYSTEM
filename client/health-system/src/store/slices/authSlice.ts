import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { secureStorage } from '../../utils/localStorage';
import { AuthState } from '../../types/index.types';

const initialState: AuthState = {
  token: secureStorage.getItem('token'),
  user: null,
  isAuthenticated: !!secureStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string; }, { rejectWithValue }) => {
    try {
      const data = await authService.login(credentials);
      secureStorage.setItem("token", data.token);  // Store the token
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    if (auth.token) {
      // Pass the refreshToken if required by your logout service
      await authService.logout(auth.token);  // Assuming you need to pass the token here
    }
    secureStorage.removeItem('token');  // Clear token from storage
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;  // Set token
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
