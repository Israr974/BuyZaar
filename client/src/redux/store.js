import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import wishlistReducer from "./wishlistSlice";
import uiReducer from "./uiSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    
    ui: uiReducer,
  },
});

export default store;
