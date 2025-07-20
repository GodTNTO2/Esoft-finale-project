import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type RootState } from '../store';
import { backendPath } from '../../../../shared/path';

export type Shop = {
    shop_id: number
    name: string
    street: string
    house_number: string
    phone: string
    is_active: boolean
}

export type ShopState = {
    shops: Shop[]
    currentShop: Shop | null
    loading: boolean
    error: string | null
}

const initialState: ShopState = {
  shops: [],
  currentShop: null,
  loading: false,
  error: null,
}

export const createShop = createAsyncThunk(
  'shop/create',
  async (shopData: Omit<Shop, 'id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendPath.basePath}${backendPath.shop.create}`, shopData)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create shop')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const fetchAllShops = createAsyncThunk(
  'shop/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendPath.basePath}${backendPath.shop.getAll}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch shops')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

const shopSlice = createSlice({
  name: 'shop',
  initialState,
  reducers: {
    clearCurrentShop: (state) => {
      state.currentShop = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createShop.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createShop.fulfilled, (state, action: PayloadAction<Shop>) => {
        state.loading = false
        state.shops.push(action.payload)
      })
      .addCase(createShop.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(fetchAllShops.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllShops.fulfilled, (state, action: PayloadAction<Shop[]>) => {
        state.loading = false
        state.shops = action.payload
      })
      .addCase(fetchAllShops.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentShop } = shopSlice.actions;

export const selectShops = (state: RootState) => state.shop.shops;
export const selectCurrentShop = (state: RootState) => state.shop.currentShop;
export const selectShopLoading = (state: RootState) => state.shop.loading;
export const selectShopError = (state: RootState) => state.shop.error;

export default shopSlice.reducer