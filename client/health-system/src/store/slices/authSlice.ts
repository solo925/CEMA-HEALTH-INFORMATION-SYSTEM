import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/auth.service';
import { secureStorage } from '../../utils/secureStorage';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: any | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: secureStorage.getItem('token'),
  refreshToken: secureStorage.getItem('refreshToken'),
  user: null,
  isAuthenticated: !!secureStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const data = await authService.login(email, password);
      secureStorage.setItem('token', data.access);
      secureStorage.setItem('refreshToken', data.refresh);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (!auth.refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const data = await authService.refreshToken(auth.refreshToken);
      secureStorage.setItem('token', data.access);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const { auth } = getState() as { auth: AuthState };
    if (auth.refreshToken) {
      await authService.logout(auth.refreshToken);
    }
    secureStorage.removeItem('token');
    secureStorage.removeItem('refreshToken');
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
        state.token = action.payload.access;
        state.refreshToken = action.payload.refresh;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Refresh Token
      .addCase(refreshToken.fulfilled, (state, action) => {
        state.token = action.payload.access;
      })
      .addCase(refreshToken.rejected, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
        secureStorage.removeItem('token');
        secureStorage.removeItem('refreshToken');
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.token = null;
        state.refreshToken = null;
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;