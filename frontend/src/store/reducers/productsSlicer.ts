import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { type RootState } from '../store';
import { backendPath } from '../../../../shared/path';

export type Product = {
  product_id: number
  name: string
  description: string | null
  price: number
  remains: number
  is_available: boolean
  category_name: 'flowers' | 'gifts';
  images: string[]
};

export type ProductsByCategory = {
  flowers: Product[]
  gifts: Product[]
  loading: boolean
  error: string | null
}

export type ProductsWithPagination = {
  products: Product[]
  total: number
  page: number
  limit: number
  loading: boolean
  error: string | null
};

export type ProductState = {
  byCategory: ProductsByCategory
  withPagination: ProductsWithPagination
  currentProduct: Product | null
  loading: boolean
  error: string | null
}

const initialState: ProductState = {
  byCategory: {
    flowers: [],
    gifts: [],
    loading: false,
    error: null,
  },
  withPagination: {
    products: [],
    total: 0,
    page: 1,
    limit: 10,
    loading: false,
    error: null,
  },
  currentProduct: null,
  loading: false,
  error: null,
}

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchByCategory',
  async (category: 'flowers' | 'gifts', { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendPath.basePath}${backendPath.product.productsWithCategory.replace(':category', category)}`)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products by category')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const fetchProductsWithPagination = createAsyncThunk(
  'products/fetchWithPagination',
  async ({ page = 1, limit = 10 }: { page?: number; limit?: number }, { rejectWithValue }) => {
    try {
      console.log({ page, limit })
      const response = await axios.get(`${backendPath.basePath}${backendPath.product.products}`, {
        params: { page, limit },
      });
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${backendPath.basePath}${backendPath.product.productById.replace(':id', id.toString())}`)
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Product not found')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const createNewProduct = createAsyncThunk(
  'products/create',
  async (productData: Omit<Product, 'product_id'>, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${backendPath.basePath}${backendPath.product.productCreate}`, productData, {
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
      });
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to create product')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, data }: { id: number; data: Partial<Product> }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${backendPath.basePath}${backendPath.product.productUpdate.replace(':id', id.toString())}`, data)
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update product')
      }
      return rejectWithValue('Unknown error');
    }
  }
)

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${backendPath.basePath}${backendPath.product.productDelete.replace(':id', id.toString())}`)
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete product')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const toggleProductAvailability = createAsyncThunk(
  'products/toggleAvailability',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`${backendPath.basePath}${backendPath.product.productToggleAvailability.replace(':id', id.toString())}`)
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to toggle availability')
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const updateProductImages = createAsyncThunk(
  'products/updateImages',
  async ({ id, formData }: { id: number; formData: Partial<Omit<Product, 'id'>> }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${backendPath.basePath}${backendPath.product.productUpdateImages.replace(':id', id.toString())}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to update images');
      }
      return rejectWithValue('Unknown error')
    }
  }
)

export const deleteProductImages = createAsyncThunk(
  'products/deleteImages',
  async (id: number, { rejectWithValue }) => {
    try {
      await axios.delete(`${backendPath.basePath}${backendPath.product.deleteproduct_images.replace(':id', id.toString())}`);
      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || 'Failed to delete images');
      }
      return rejectWithValue('Unknown error');
    }
  }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchProductsByCategory.pending, (state) => {
          state.byCategory.loading = true
          state.byCategory.error = null
        })
        .addCase(fetchProductsByCategory.fulfilled, (state, action: PayloadAction<Product[], string, { arg: 'flowers' | 'gifts'; requestId: string; requestStatus: 'fulfilled' }>) => {
          state.byCategory.loading = false
          const category = action.meta.arg
          state.byCategory[category] = action.payload
        })
        .addCase(fetchProductsByCategory.rejected, (state, action) => {
          state.byCategory.loading = false
          state.byCategory.error = action.payload as string
        })


        .addCase(fetchProductsWithPagination.pending, (state) => {
          state.withPagination.loading = true
          state.withPagination.error = null
        })
        .addCase(fetchProductsWithPagination.fulfilled, (state, action: PayloadAction<{ products: Product[]; total: number }, string, { arg: { page?: number; limit?: number }; requestId: string; requestStatus: 'fulfilled' }>) => {
          state.withPagination.loading = false
          state.withPagination.products = action.payload.products
          state.withPagination.total = action.payload.total
          state.withPagination.page = action.meta.arg.page || 1
          state.withPagination.limit = action.meta.arg.limit || 10
        })
        .addCase(fetchProductsWithPagination.rejected, (state, action) => {
          state.withPagination.loading = false
          state.withPagination.error = action.payload as string
        })


        .addCase(fetchProductById.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
          state.loading = false
          state.currentProduct = action.payload
        })
        .addCase(fetchProductById.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })


        .addCase(createNewProduct.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(createNewProduct.fulfilled, (state, action: PayloadAction<Product>) => {
          state.loading = false
          state.withPagination.products.unshift(action.payload)
          state.withPagination.total += 1
        })
        .addCase(createNewProduct.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })


        .addCase(updateProduct.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
          state.loading = false
          

          const paginatedIndex = state.withPagination.products.findIndex(p => p.product_id === action.payload.product_id)
          if (paginatedIndex !== -1) {
            state.withPagination.products[paginatedIndex] = action.payload
          }
          

          const updateCategoryList = (category: 'flowers' | 'gifts') => {
            const categoryIndex = state.byCategory[category].findIndex(p => p.product_id === action.payload.product_id)
            if (categoryIndex !== -1) {
              state.byCategory[category][categoryIndex] = action.payload
            }
          }
          
          updateCategoryList('flowers')
          updateCategoryList('gifts')
          

          if (state.currentProduct?.product_id === action.payload.product_id) {
            state.currentProduct = action.payload
          }
        })
        .addCase(updateProduct.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })


        .addCase(deleteProduct.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
          state.loading = false
          const deletedId = action.payload
          

          state.withPagination.products = state.withPagination.products.filter(p => p.product_id !== deletedId)
          state.withPagination.total -= 1;
          

          const removeFromCategory = (category: 'flowers' | 'gifts') => {
            state.byCategory[category] = state.byCategory[category].filter(p => p.product_id !== deletedId)
          };
          
          removeFromCategory('flowers')
          removeFromCategory('gifts')
          

          if (state.currentProduct?.product_id === deletedId) {
            state.currentProduct = null
          }
        })
        .addCase(deleteProduct.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })


        .addCase(toggleProductAvailability.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(toggleProductAvailability.fulfilled, (state, action: PayloadAction<Product>) => {
          state.loading = false
          const updatedProduct = action.payload
          

          const updateProductInList = (list: Product[]) => {
            const index = list.findIndex(p => p.product_id === updatedProduct.product_id)
            if (index !== -1) {
              list[index] = updatedProduct
            }
          }
          
          updateProductInList(state.withPagination.products)
          updateProductInList(state.byCategory.flowers)
          updateProductInList(state.byCategory.gifts)
          
          if (state.currentProduct?.product_id === updatedProduct.product_id) {
            state.currentProduct = updatedProduct
          }
        })
        .addCase(toggleProductAvailability.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })


        .addCase(updateProductImages.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(updateProductImages.fulfilled, (state, action: PayloadAction<Product>) => {
          state.loading = false
          const updatedProduct = action.payload
          

          const updateImagesInList = (list: Product[]) => {
            const index = list.findIndex(p => p.product_id === updatedProduct.product_id)
            if (index !== -1) {
              list[index].images = updatedProduct.images
            }
          }
          
          updateImagesInList(state.withPagination.products)
          updateImagesInList(state.byCategory.flowers)
          updateImagesInList(state.byCategory.gifts)
          
          if (state.currentProduct?.product_id === updatedProduct.product_id) {
            state.currentProduct.images = updatedProduct.images
          }
        })
        .addCase(updateProductImages.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })


        .addCase(deleteProductImages.pending, (state) => {
          state.loading = true
          state.error = null
        })
        .addCase(deleteProductImages.fulfilled, (state, action: PayloadAction<number>) => {
          state.loading = false
          const productId = action.payload
        
          const clearImagesInList = (list: Product[]) => {
            const index = list.findIndex(p => p.product_id === productId)
            if (index !== -1) {
              list[index].images = []
            }
          }
          
          clearImagesInList(state.withPagination.products)
          clearImagesInList(state.byCategory.flowers)
          clearImagesInList(state.byCategory.gifts)
          
          if (state.currentProduct?.product_id === productId) {
            state.currentProduct.images = []
          }
        })
        .addCase(deleteProductImages.rejected, (state, action) => {
          state.loading = false
          state.error = action.payload as string
        })
    },
})

export const selectProductsByCategory = (state: RootState) => state.products.byCategory
export const selectCurrentProduct = (state: RootState) => state.products.currentProduct
export const selectProductsLoading = (state: RootState) => state.products.loading
export const selectProductsError = (state: RootState) => state.products.error
export const selectProductsWithPagination = (state: RootState) => state.products.withPagination

export default productSlice.reducer