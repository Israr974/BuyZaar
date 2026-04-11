

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
    wishlist: wishlistReducer,  // Added wishlist reducer
    ui: uiReducer,
  },
  // Optional: Add middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if they contain non-serializable data
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these paths in the state
        ignoredPaths: ['user.lastLogin', 'wishlist.lastUpdated'],
      },
    }),
  // Optional: Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
});

// Optional: Add type for RootState and AppDispatch (if using TypeScript)
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

export default store;