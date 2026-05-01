import { configureStore } from "@reduxjs/toolkit";

// Import all reducers
import userReducer from "./userSlice";
import productReducer from "./productSlice";
import cartReducer from "./cartSlice";
import orderReducer from "./orderSlice";
import wishlistReducer from "./wishlistSlice";
import uiReducer from "./uiSlice";

// ================= CONSTANTS =================
const PERSIST_KEYS = ["cart", "wishlist", "ui"];
const STORAGE_KEY = "redux_store";

// ================= PERSISTENCE HELPERS =================
const loadState = () => {
  if (typeof window === "undefined") return undefined;
  
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (!serializedState) return undefined;
    
    const savedState = JSON.parse(serializedState);
    
    // Only restore specific slices
    const restoredState = {};
    PERSIST_KEYS.forEach(key => {
      if (savedState[key]) {
        restoredState[key] = savedState[key];
      }
    });
    
    return restoredState;
  } catch (err) {
    console.error("Failed to load state from localStorage:", err);
    return undefined;
  }
};

const saveState = (state) => {
  if (typeof window === "undefined") return;
  
  try {
    const stateToSave = {};
    PERSIST_KEYS.forEach(key => {
      if (state[key]) {
        stateToSave[key] = state[key];
      }
    });
    
    const serializedState = JSON.stringify(stateToSave);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage:", err);
  }
};

// ================= MIDDLEWARE =================
const persistenceMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Save to localStorage after specific actions
  const actionsToPersist = [
    "cart/addToCart",
    "cart/removeFromCart",
    "cart/updateQuantity",
    "cart/clearCart",
    "cart/incrementQuantity",
    "cart/decrementQuantity",
    "cart/setCartItems",
    "wishlist/addToWishlist",
    "wishlist/removeFromWishlist",
    "wishlist/clearWishlist",
    "wishlist/setWishlist",
    "ui/setTheme",
    "ui/setSidebarOpen",
    "ui/setToast",
  ];
  
  if (actionsToPersist.includes(action.type)) {
    saveState(store.getState());
  }
  
  return result;
};

const loggerMiddleware = (store) => (next) => (action) => {
  if (process.env.NODE_ENV === "development") {
    console.group(`🎯 Action: ${action.type}`);
    console.log("Payload:", action.payload);
    console.log("Prev State:", store.getState());
    const result = next(action);
    console.log("Next State:", store.getState());
    console.groupEnd();
    return result;
  }
  return next(action);
};

const errorMiddleware = (store) => (next) => (action) => {
  try {
    return next(action);
  } catch (error) {
    console.error(`❌ Error in action ${action.type}:`, error);
    
    // Dispatch error action if available
    if (action.type?.startsWith("cart/")) {
      store.dispatch({ type: "cart/setCartError", payload: error.message });
    } else if (action.type?.startsWith("product/")) {
      store.dispatch({ type: "product/setProductsError", payload: error.message });
    }
    
    throw error;
  }
};

// ================= STORE CONFIGURATION =================
const preloadedState = loadState();

const store = configureStore({
  reducer: {
    user: userReducer,
    product: productReducer,
    cart: cartReducer,
    orders: orderReducer,
    wishlist: wishlistReducer,
    ui: uiReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "cart/addToCart",
          "user/setUser",
          "orders/setOrders",
          "orders/setCurrentOrder",
          "wishlist/setWishlist",
        ],
        ignoredPaths: [
          "user.lastLogin",
          "wishlist.lastUpdated",
          "cart.lastUpdated",
          "user.user.updatedAt",
          "user.user.createdAt",
          "orders.currentOrder",
        ],
        warnAfter: 100,
      },
      immutableCheck: {
        warnAfter: 100,
      },
    }).concat(persistenceMiddleware, errorMiddleware, loggerMiddleware),
  
  devTools: process.env.NODE_ENV !== "production",
});

// ================= SUBSCRIBE TO STORE CHANGES =================
store.subscribe(() => {
  // Optional: Add analytics or logging on specific state changes
  const state = store.getState();
  
  // Log cart changes in development
  if (process.env.NODE_ENV === "development") {
    if (state.cart?.totalQuantity > 0) {
      console.log(`🛒 Cart has ${state.cart.totalQuantity} items totaling ₹${state.cart.totalPrice}`);
    }
  }
});

// ================= HELPER FUNCTIONS =================
export const getStoreState = () => store.getState();
export const getCurrentUser = () => store.getState().user;
export const getCartItems = () => store.getState().cart.cartitems;
export const getCartTotal = () => store.getState().cart.totalPrice;
export const getWishlistItems = () => store.getState().wishlist.items || [];
export const getIsAuthenticated = () => !!store.getState().user?.id;

// ================= RESET STORE FUNCTION =================
export const resetStore = () => {
  // Reset each slice to its initial state
  store.dispatch({ type: "user/resetUserState" });
  store.dispatch({ type: "product/resetProductState" });
  store.dispatch({ type: "cart/clearCart" });
  store.dispatch({ type: "orders/clearOrders" });
  store.dispatch({ type: "wishlist/clearWishlist" });
  store.dispatch({ type: "ui/resetUI" });
  
  // Clear localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("cart");
  }
};

// ================= PERSISTENCE SETUP =================
// Save store on window/beforeunload events for critical data
if (typeof window !== "undefined") {
  window.addEventListener("beforeunload", () => {
    saveState(store.getState());
  });
}

// ================= EXPORT =================
export default store;