import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type RootState } from '../store';
import { backendPath } from '../../../../shared/path';

export type OrderItem = {
  product_id: number
  quantity: number
  unit_price: number
  name: string
  discount_amount: number
}


export type OrderStatus = 'processing' | 'delivered' | 'finished' | 'cancelled'
export type PaymentStatus = 'pending' | 'finished' | 'cancelled'

export type Order = {
  id: number
  user_id: number
  shop_id: number
  recipient_name: string
  recipient_phone: string
  order_date: Date
  delivery_date: string
  delivery_time_slot: string
  delivery_instructions?: string
  gift_message?: string
  payment_status: PaymentStatus
  street: string
  house_number: string
  apartment_number: string
  entrance?: string
  floor?: string
  total_amount: number
  status: OrderStatus
  items: OrderItem[]
  shop?: {
    name: string
    address: string
    phone: string
  }
}


export type OrderState = {
  orders: Order[];
  currentOrder: Order | null
  loading: boolean
  error: string | null
};

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (orderData: {
    recipient_name: string;
    recipient_phone: string;
    delivery_date: string;
    delivery_time_slot: string;
    delivery_instructions?: string;
    gift_message?: string;
    street: string;
    house_number: string;
    apartment_number: string;
    entrance?: string;
    floor?: string;
  }, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.post(
        `${backendPath.basePath}${backendPath.order.create}`,
        orderData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create order');
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${backendPath.basePath}${backendPath.order.getById.replace(':id', id.toString())}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Order not found');
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async (_, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const userId = state.auth.user?.id;
      
      if (!userId) {
        return rejectWithValue('User not authenticated');
      }

      const response = await axios.get(
        `${backendPath.basePath}${backendPath.order.getUserOrders}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  'order/updateStatus',
  async ({ id, status }: { id: number; status: OrderStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `${backendPath.basePath}${backendPath.order.updateStatus.replace(':id', id.toString())}`,
        { status },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update order status');
      }
      return rejectWithValue('Unknown error');
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'order/cancel',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${backendPath.basePath}${backendPath.order.cancel.replace(':id', id.toString())}`,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
      }
      return rejectWithValue('Unknown error');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        state.orders.unshift(action.payload)
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })



      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserOrders.fulfilled, (state, action: PayloadAction<Order[]>) => {
        state.loading = false
        state.orders = action.payload
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })


      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateOrderStatus.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string
      })


      .addCase(cancelOrder.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(cancelOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.loading = false
        const index = state.orders.findIndex(o => o.id === action.payload.id)
        if (index !== -1) {
          state.orders[index] = action.payload
        }
        if (state.currentOrder?.id === action.payload.id) {
          state.currentOrder = action.payload
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  },
})

export const { clearCurrentOrder } = orderSlice.actions

export const selectOrders = (state: RootState) => state.order.orders
export const selectCurrentOrder = (state: RootState) => state.order.currentOrder
export const selectOrderLoading = (state: RootState) => state.order.loading
export const selectOrderError = (state: RootState) => state.order.error
export const selectActiveOrders = (state: RootState) => state.order.orders.filter(order => ['processing', 'shipped'].includes(order.status))

export default orderSlice.reducer