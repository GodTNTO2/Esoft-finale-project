import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type RootState } from '../store';
import { backendPath } from '../../../../shared/path';


export type User = {
  id: number
  name: string
  phone: string
  email: string | null
  role: 'user' | 'moderator' | 'admin'
};

export type AuthState = {
  user: User | null
  loading: boolean
  error: string | null
  isAuthenticated: boolean
}


const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}


if (typeof window !== 'undefined') {
  const authState = localStorage.getItem('authState');
  if (authState) {
    const parsed = JSON.parse(authState)
    initialState.user = parsed.user
    initialState.isAuthenticated = parsed.isAuthenticated
  }
}

const persistAuthState = (state: AuthState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      'authState',
      JSON.stringify({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      })
    )
  }
}

const clearAuthState = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authState')
  }
}


export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { phone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendPath.basePath}${backendPath.auth.login}`, credentials, {
        withCredentials: true, 
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Login failed')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; phone: string; password: string; email: string|null }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendPath.basePath}${backendPath.auth.registration}`, userData, {
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Registration failed')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${backendPath.basePath}${backendPath.auth.logout}`, {}, { withCredentials: true })
      return true
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Logout failed')
      }
      return rejectWithValue('Unknown error');
    }
  }
)

export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendPath.basePath}${backendPath.auth.check}`, { withCredentials: true })
      return response.data.user;
    } catch {
      return rejectWithValue('Not authenticated');
    }
  }
)


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        persistAuthState(state)
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        clearAuthState()
      })


      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        persistAuthState(state)
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(logout.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.isAuthenticated = false
        clearAuthState()
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(checkAuth.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        persistAuthState(state)
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.isAuthenticated = false
        clearAuthState()
      })
  },
})


export const selectCurrentUser = (state: RootState) => state.auth?.user
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated
export const selectUserRole = (state: RootState) => state.auth.user?.role


export default authSlice.reducer