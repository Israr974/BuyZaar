
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
  totalItems: 0,
  loading: false,
  error: null,
  lastUpdated: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload;
      state.totalItems = action.payload.length;
      state.lastUpdated = new Date().toISOString();
    },
    
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(
        (item) => item.productId === product.productId || 
                  item.productId?._id === product._id ||
                  item._id === product._id
      );
      
      if (!exists) {
        // Normalize product structure
        const newItem = {
          productId: product.productId || product._id || product,
          product: product,
          addedAt: new Date().toISOString(),
          ...product
        };
        state.items.unshift(newItem);
        state.totalItems = state.items.length;
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.productId !== productId && 
                  item.productId?._id !== productId && 
                  item._id !== productId
      );
      state.totalItems = state.items.length;
      state.lastUpdated = new Date().toISOString();
    },
    
    removeMultipleFromWishlist: (state, action) => {
      const productIds = action.payload;
      state.items = state.items.filter(
        (item) => !productIds.includes(item.productId) && 
                  !productIds.includes(item.productId?._id) &&
                  !productIds.includes(item._id)
      );
      state.totalItems = state.items.length;
      state.lastUpdated = new Date().toISOString();
    },
    
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.lastUpdated = new Date().toISOString();
    },
    
    moveToCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(
        (item) => item.productId !== productId && 
                  item.productId?._id !== productId && 
                  item._id !== productId
      );
      state.totalItems = state.items.length;
      state.lastUpdated = new Date().toISOString();
    },
    
    moveAllToCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.lastUpdated = new Date().toISOString();
    },
    
    updateWishlistItem: (state, action) => {
      const { productId, updates } = action.payload;
      const index = state.items.findIndex(
        (item) => item.productId === productId || 
                  item.productId?._id === productId ||
                  item._id === productId
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...updates };
        state.lastUpdated = new Date().toISOString();
      }
    },
    
    setWishlistLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setWishlistError: (state, action) => {
      state.error = action.payload;
    },
    
    clearWishlistError: (state) => {
      state.error = null;
    },
    
    resetWishlist: () => initialState,
  },
});

export const { 
  setWishlist, 
  addToWishlist, 
  removeFromWishlist,
  removeMultipleFromWishlist,
  clearWishlist,
  moveToCart,
  moveAllToCart,
  updateWishlistItem,
  setWishlistLoading,
  setWishlistError,
  clearWishlistError,
  resetWishlist
} = wishlistSlice.actions;

export default wishlistSlice.reducer;