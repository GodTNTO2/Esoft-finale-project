import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type RootState } from '../store';
import { backendPath } from '../../../../shared/path';

export type CartItem = {
  product_id: number
  quantity: number
  price: number
  name: string
  image: string
}

export type CartState = {
  items: CartItem[]
  loading: boolean
  error: string | null
  tempCartId: string | null
}

const getTempCartId = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tempCartId')
  }
  return null
}

const initialState: CartState = {
  items: [],
  loading: false,
  error: null,
  tempCartId: getTempCartId(),
}

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id || state.cart.tempCartId
      
      if (!userId) {
        return rejectWithValue('No user or temp cart ID')
      }

      const response = await axios.get(`${backendPath.basePath}${backendPath.cart.getCart}`, {
        headers: {
          'X-Temp-User-Id': typeof userId === 'number' ? undefined : userId,
        },
        withCredentials: true,
      })
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const addCartItem = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id || state.cart.tempCartId
      
      if (!userId) {
        return rejectWithValue('No user or temp cart ID')
      }

      const response = await axios.post(
        `${backendPath.basePath}${backendPath.cart.addItem}`,
        { productId, quantity },
        {
          headers: {
            'X-Temp-User-Id': typeof userId === 'number' ? undefined : userId,
          },
          withCredentials: true,
        }
      )
      return response.data.items
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to add item to cart')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ productId, quantity }: { productId: number; quantity: number }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id || state.cart.tempCartId
      
      if (!userId) {
        return rejectWithValue('No user or temp cart ID');
      }

      const response = await axios.patch(
        `${backendPath.basePath}${backendPath.cart.updateItem}`,
        { productId, quantity },
        {
          headers: {
            'X-Temp-User-Id': typeof userId === 'number' ? undefined : userId,
          },
          withCredentials: true,
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update cart item')
      }
      return rejectWithValue('Unknown error');
    }
  }
)

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (productId: number, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id || state.cart.tempCartId
      
      if (!userId) {
        return rejectWithValue('No user or temp cart ID')
      }

      const response = await axios.delete(
        `${backendPath.basePath}${backendPath.cart.removeItem.replace(':productId', productId.toString())}`,
        {
          headers: {
            'X-Temp-User-Id': typeof userId === 'number' ? undefined : userId,
          },
          withCredentials: true,
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to remove item from cart')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id || state.cart.tempCartId
      
      if (!userId) {
        return rejectWithValue('No user or temp cart ID')
      }

      const response = await axios.delete(
        `${backendPath.basePath}${backendPath.cart.clearCart}`,
        {
          headers: {
            'X-Temp-User-Id': typeof userId === 'number' ? undefined : userId,
          },
          withCredentials: true,
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const getempCartId = createAsyncThunk(
  'cart/getempCartId',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState
      const userId = state.auth.user?.id || state.cart.tempCartId
      
      if (userId) {
        return false
      }

      const response = await axios.get(
        `${backendPath.basePath}${backendPath.cart.getTempCartId}`,
        {
          withCredentials: true,
        }
      )
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed')
      }
      return rejectWithValue('Unknown error')
    }
  }
)


const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartItemQuantity: (state, action: PayloadAction<{ productId: number; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product_id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    setTempCartId: (state, action: PayloadAction<string>) => {
      state.tempCartId = action.payload
      if (typeof window !== 'undefined') {
        localStorage.setItem('tempCartId', action.payload)
      }
    },
    clearTempCartId: (state) => {
        state.tempCartId = null
        if (typeof window !== 'undefined') {
            localStorage.removeItem('tempCartId')
        }
    },
  },
  extraReducers: (builder) => {
    builder
        .addCase(fetchCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchCart.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(fetchCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })


        .addCase(addCartItem.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(addCartItem.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
            state.loading = false
            console.log(action.payload)
            state.items = action.payload
        })
        .addCase(addCartItem.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })


        .addCase(updateCartItem.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(updateCartItem.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(updateCartItem.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })


        .addCase(removeCartItem.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(removeCartItem.fulfilled, (state, action: PayloadAction<CartItem[]>) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(removeCartItem.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })


        .addCase(clearCart.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(clearCart.fulfilled, (state) => {
            state.loading = false
            state.items = []
        })
        .addCase(clearCart.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })


        .addCase(getempCartId.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(getempCartId.fulfilled, (state, action: PayloadAction<{"userId": string} | false>) => {
            state.loading = false
            if(!action.payload) {
                state.tempCartId = null
            } else {
                state.tempCartId = action.payload.userId
            }
        })
        .addCase(getempCartId.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload as string
        })
    },
})

export const { setTempCartId, clearTempCartId, updateCartItemQuantity } = cartSlice.actions

export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartLoading = (state: RootState) => state.cart.loading
export const selectCartError = (state: RootState) => state.cart.error
export const selectTempCartId = (state: RootState) => state.cart.tempCartId
export const selectCartTotal = (state: RootState) => state.cart.items.reduce((total, item) => total + (item.price * item.quantity), 0)
export const selectCartItemsCount = (state: RootState) => {
  if (!state.cart?.items || !Array.isArray(state.cart.items)) {
    console.error('Cart items is not an array:', state.cart?.items);
    return 0;
  }
  return state.cart.items.reduce((count, item) => count + item.quantity, 0);
};

export default cartSlice.reducer