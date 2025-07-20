import { configureStore } from "@reduxjs/toolkit";
import productsSlicer from "./reducers/productsSlicer"
import authSlicer from './reducers/authSlicer'
import cartSlicer from './reducers/cartSlicer'
import ordersSlicer from './reducers/ordersSlicer'
import shopSlice from './reducers/shopSlicer'
import adressSlice from './reducers/adressSlicer'
import orderSlice from './reducers/ordersSlicer'



const store = configureStore({
    reducer: {
        products: productsSlicer,
        auth: authSlicer,
        cart: cartSlicer,
        orders: ordersSlicer,
        shop: shopSlice,
        adress: adressSlice,
        order: orderSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch


export default store