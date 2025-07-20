import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type RootState } from '../store';
import { backendPath } from '../../../../shared/path';

export type adress = {
  id: number
  user_id: number
  street: string
  house_number: string
  apartment_number: string
  entrance?: string
  floor?: string
  is_primary: boolean
}

export type adressState = {
  adresses: adress[];
  currentadress: adress | null
  loading: boolean
  error: string | null
}

const initialState: adressState = {
  adresses: [],
  currentadress: null,
  loading: false,
  error: null,
}

export const createadress = createAsyncThunk(
  'adress/create',
  async (adressData: Omit<adress, 'id' | 'user_id'>, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id
      
      if (!userId) {
        return rejectWithValue('User not authenticated')
      }

      const response = await axios.post(
        `${backendPath.basePath}${backendPath.adress.create}`,
        { ...adressData, user_id: userId },
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create adress')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const fetchUseradresses = createAsyncThunk(
  'adress/fetchUseradresses',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(
        `${backendPath.basePath}${backendPath.adress.getAll}`,
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch adresses')
      }
      return rejectWithValue('Unknown error')
    }
  }
)



export const updateadress = createAsyncThunk(
  'adress/update',
  async ({ id, data }: { id: number; data: Partial<adress> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${backendPath.basePath}${backendPath.adress.update.replace(':id', id.toString())}`,
        data,
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update adress')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const deleteadress = createAsyncThunk(
  'adress/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(
        `${backendPath.basePath}${backendPath.adress.delete.replace(':id', id.toString())}`,
        { withCredentials: true }
      );
      return id
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete adress')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const setPrimaryadress = createAsyncThunk(
  'adress/setPrimary',
  async (id: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id
      
      if (!userId) {
        return rejectWithValue('User not authenticated')
      }

      const response = await axios.post(
        `${backendPath.basePath}${backendPath.adress.setPrimary.replace(':id', id.toString())}`,
        {},
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to set primary adress')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

const adressSlice = createSlice({
  name: 'adress',
  initialState,
  reducers: {
    clearCurrentadress: (state) => {
      state.currentadress = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createadress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createadress.fulfilled, (state, action: PayloadAction<adress>) => {
        state.loading = false
        state.adresses.push(action.payload)
        if (action.payload.is_primary) {
          state.adresses.forEach(addr => {
            if (addr.id !== action.payload.id) addr.is_primary = false
          })
        }
      })
      .addCase(createadress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(fetchUseradresses.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUseradresses.fulfilled, (state, action: PayloadAction<adress[]>) => {
        state.loading = false
        state.adresses = action.payload
      })
      .addCase(fetchUseradresses.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })



      .addCase(updateadress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateadress.fulfilled, (state, action: PayloadAction<adress>) => {
        state.loading = false
        const index = state.adresses.findIndex(a => a.id === action.payload.id)
        if (index !== -1) {
          state.adresses[index] = action.payload
          if (action.payload.is_primary) {
            state.adresses.forEach(addr => {
              if (addr.id !== action.payload.id) addr.is_primary = false
            })
          }
        }
        if (state.currentadress?.id === action.payload.id) {
          state.currentadress = action.payload
        }
      })
      .addCase(updateadress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(deleteadress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteadress.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.adresses = state.adresses.filter(a => a.id !== action.payload);
        if (state.currentadress?.id === action.payload) {
          state.currentadress = null
        }
      })
      .addCase(deleteadress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(setPrimaryadress.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(setPrimaryadress.fulfilled, (state, action: PayloadAction<adress[]>) => {
        state.loading = false
        state.adresses = action.payload
      })
      .addCase(setPrimaryadress.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentadress } = adressSlice.actions

export const selectadresses = (state: RootState) => state.adress.adresses
export const selectCurrentadress = (state: RootState) => state.adress.currentadress
export const selectPrimaryadress = (state: RootState) => state.adress.adresses.find(a => a.is_primary) || null
export const selectadressLoading = (state: RootState) => state.adress.loading
export const selectadressError = (state: RootState) => state.adress.error

export default adressSlice.reducer