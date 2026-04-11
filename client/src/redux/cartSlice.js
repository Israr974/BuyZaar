import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartitems: [],
  totalQuantity: 0,
  totalPrice: 0,
  loading: false,
  error: null
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartitems = [...action.payload];
      // Recalculate totals
      state.totalQuantity = state.cartitems.reduce(
        (total, item) => total + (item.quantity || 0), 0
      );
      state.totalPrice = state.cartitems.reduce(
        (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 0
      );
    },
    
    addToCart: (state, action) => {
      const { productId, quantity = 1 } = action.payload;
      const existingItem = state.cartitems.find(
        (item) => item.productId?._id === productId._id || item.productId === productId._id
      );
      
      if (existingItem) {
        existingItem.quantity = (existingItem.quantity || 0) + quantity;
      } else {
        state.cartitems.push({
          productId: productId,
          quantity: quantity,
        });
      }
      
      // Recalculate totals
      state.totalQuantity = state.cartitems.reduce(
        (total, item) => total + (item.quantity || 0), 0
      );
      state.totalPrice = state.cartitems.reduce(
        (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 0
      );
    },
    
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartitems = state.cartitems.filter(
        (item) => item.productId?._id !== productId && item.productId !== productId
      );
      
      // Recalculate totals
      state.totalQuantity = state.cartitems.reduce(
        (total, item) => total + (item.quantity || 0), 0
      );
      state.totalPrice = state.cartitems.reduce(
        (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 0
      );
    },
    
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartitems.find(
        (item) => item.productId?._id === productId || item.productId === productId
      );
      
      if (item) {
        if (quantity <= 0) {
          // Remove item if quantity becomes 0 or negative
          state.cartitems = state.cartitems.filter(
            (i) => i !== item
          );
        } else {
          item.quantity = quantity;
        }
        
        // Recalculate totals
        state.totalQuantity = state.cartitems.reduce(
          (total, item) => total + (item.quantity || 0), 0
        );
        state.totalPrice = state.cartitems.reduce(
          (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 0
        );
      }
    },
    
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartitems.find(
        (item) => item.productId?._id === productId || item.productId === productId
      );
      
      if (item) {
        const maxQuantity = Math.min(item.productId?.stock || 10, 10);
        if (item.quantity < maxQuantity) {
          item.quantity += 1;
          
          // Recalculate totals
          state.totalQuantity = state.cartitems.reduce(
            (total, item) => total + (item.quantity || 0), 0
          );
          state.totalPrice = state.cartitems.reduce(
            (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 0
          );
        }
      }
    },
    
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartitems.find(
        (item) => item.productId?._id === productId || item.productId === productId
      );
      
      if (item && item.quantity > 1) {
        item.quantity -= 1;
        
        // Recalculate totals
        state.totalQuantity = state.cartitems.reduce(
          (total, item) => total + (item.quantity || 0), 0
        );
        state.totalPrice = state.cartitems.reduce(
          (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 0
        );
      } else if (item && item.quantity === 1) {
        // Remove item if quantity becomes 0
        state.cartitems = state.cartitems.filter(
          (i) => i !== item
        );
        
        // Recalculate totals
        state.totalQuantity = state.cartitems.reduce(
          (total, item) => total + (item.quantity || 0), 0
        );
        state.totalPrice = state.cartitems.reduce(
          (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 0
        );
      }
    },
    
    clearCart: (state) => {
      state.cartitems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.error = null;
    },
    
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setCartError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { 
  setCartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCartLoading,
  setCartError
} = cartSlice.actions;

export default cartSlice.reducer;