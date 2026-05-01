import { createSlice } from "@reduxjs/toolkit";

// ================= CONSTANTS =================
const MAX_QUANTITY_PER_ITEM = 10;
const STORAGE_KEY = "cart";

// ================= HELPER FUNCTIONS =================
const calculateTotals = (cartitems) => {
  const totalQuantity = cartitems.reduce(
    (total, item) => total + (item.quantity || 0), 
    0
  );
  
  const totalPrice = cartitems.reduce(
    (total, item) => total + ((item.productId?.price || 0) * (item.quantity || 0)), 
    0
  );
  
  return { totalQuantity, totalPrice };
};

const saveToLocalStorage = (state) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      cartitems: state.cartitems,
      totalQuantity: state.totalQuantity,
      totalPrice: state.totalPrice
    }));
  }
};

const loadFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse cart from localStorage", e);
      }
    }
  }
  return null;
};

// ================= INITIAL STATE =================
const getInitialState = () => {
  const savedState = loadFromLocalStorage();
  if (savedState) {
    return {
      cartitems: savedState.cartitems || [],
      totalQuantity: savedState.totalQuantity || 0,
      totalPrice: savedState.totalPrice || 0,
      loading: false,
      error: null,
    };
  }
  
  return {
    cartitems: [],
    totalQuantity: 0,
    totalPrice: 0,
    loading: false,
    error: null,
  };
};

const initialState = getInitialState();

// ================= SLICE =================
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // ================= SET CART =================
    setCartItems: (state, action) => {
      state.cartitems = [...action.payload];
      const { totalQuantity, totalPrice } = calculateTotals(state.cartitems);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      state.error = null;
      saveToLocalStorage(state);
    },
    
    // ================= ADD TO CART =================
    addToCart: (state, action) => {
      const { productId, quantity = 1 } = action.payload;
      
      if (!productId || !productId._id) {
        state.error = "Invalid product data";
        return;
      }
      
      const productStock = productId.stock || 0;
      if (productStock === 0) {
        state.error = "Product is out of stock";
        return;
      }
      
      const existingItem = state.cartitems.find(
        (item) => item.productId?._id === productId._id
      );
      
      if (existingItem) {
        const newQuantity = (existingItem.quantity || 0) + quantity;
        if (newQuantity > MAX_QUANTITY_PER_ITEM) {
          state.error = `Maximum ${MAX_QUANTITY_PER_ITEM} items allowed per product`;
          return;
        }
        if (newQuantity > productStock) {
          state.error = `Only ${productStock} items available in stock`;
          return;
        }
        existingItem.quantity = newQuantity;
      } else {
        if (quantity > productStock) {
          state.error = `Only ${productStock} items available in stock`;
          return;
        }
        state.cartitems.push({
          productId: productId,
          quantity: Math.min(quantity, MAX_QUANTITY_PER_ITEM),
        });
      }
      
      const { totalQuantity, totalPrice } = calculateTotals(state.cartitems);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      state.error = null;
      saveToLocalStorage(state);
    },
    
    // ================= REMOVE FROM CART =================
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cartitems = state.cartitems.filter(
        (item) => item.productId?._id !== productId
      );
      
      const { totalQuantity, totalPrice } = calculateTotals(state.cartitems);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      saveToLocalStorage(state);
    },
    
    // ================= UPDATE QUANTITY =================
    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      
      if (quantity < 0) {
        state.error = "Quantity cannot be negative";
        return;
      }
      
      const itemIndex = state.cartitems.findIndex(
        (item) => item.productId?._id === productId
      );
      
      if (itemIndex === -1) {
        state.error = "Product not found in cart";
        return;
      }
      
      const item = state.cartitems[itemIndex];
      const productStock = item.productId?.stock || 0;
      
      if (quantity === 0) {
        state.cartitems.splice(itemIndex, 1);
      } else {
        if (quantity > MAX_QUANTITY_PER_ITEM) {
          state.error = `Maximum ${MAX_QUANTITY_PER_ITEM} items allowed per product`;
          return;
        }
        if (quantity > productStock) {
          state.error = `Only ${productStock} items available in stock`;
          return;
        }
        item.quantity = quantity;
      }
      
      const { totalQuantity, totalPrice } = calculateTotals(state.cartitems);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      state.error = null;
      saveToLocalStorage(state);
    },
    
    // ================= INCREMENT QUANTITY =================
    incrementQuantity: (state, action) => {
      const productId = action.payload;
      const item = state.cartitems.find(
        (item) => item.productId?._id === productId
      );
      
      if (!item) {
        state.error = "Product not found in cart";
        return;
      }
      
      const productStock = item.productId?.stock || 0;
      const currentQuantity = item.quantity || 0;
      
      if (currentQuantity >= MAX_QUANTITY_PER_ITEM) {
        state.error = `Maximum ${MAX_QUANTITY_PER_ITEM} items allowed per product`;
        return;
      }
      
      if (currentQuantity + 1 > productStock) {
        state.error = `Only ${productStock} items available in stock`;
        return;
      }
      
      item.quantity = currentQuantity + 1;
      
      const { totalQuantity, totalPrice } = calculateTotals(state.cartitems);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      state.error = null;
      saveToLocalStorage(state);
    },
    
    // ================= DECREMENT QUANTITY =================
    decrementQuantity: (state, action) => {
      const productId = action.payload;
      const itemIndex = state.cartitems.findIndex(
        (item) => item.productId?._id === productId
      );
      
      if (itemIndex === -1) {
        state.error = "Product not found in cart";
        return;
      }
      
      const item = state.cartitems[itemIndex];
      const currentQuantity = item.quantity || 0;
      
      if (currentQuantity <= 1) {
        state.cartitems.splice(itemIndex, 1);
      } else {
        item.quantity = currentQuantity - 1;
      }
      
      const { totalQuantity, totalPrice } = calculateTotals(state.cartitems);
      state.totalQuantity = totalQuantity;
      state.totalPrice = totalPrice;
      state.error = null;
      saveToLocalStorage(state);
    },
    
    // ================= CLEAR CART =================
    clearCart: (state) => {
      state.cartitems = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },
    
    // ================= LOADING STATES =================
    setCartLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setCartError: (state, action) => {
      state.error = action.payload;
    },
    
    // ================= CLEAR ERROR =================
    clearCartError: (state) => {
      state.error = null;
    },
    
    // ================= SYNC WITH BACKEND =================
    syncCart: (state, action) => {
      const backendCart = action.payload;
      if (Array.isArray(backendCart) && backendCart.length > 0) {
        state.cartitems = backendCart;
        const { totalQuantity, totalPrice } = calculateTotals(state.cartitems);
        state.totalQuantity = totalQuantity;
        state.totalPrice = totalPrice;
        saveToLocalStorage(state);
      }
    },
  },
});

// ================= EXPORT ACTIONS =================
export const { 
  setCartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity,
  incrementQuantity,
  decrementQuantity,
  clearCart,
  setCartLoading,
  setCartError,
  clearCartError,
  syncCart
} = cartSlice.actions;

// ================= SELECTORS =================
export const selectCartItems = (state) => state.cart?.cartitems || [];
export const selectTotalQuantity = (state) => state.cart?.totalQuantity || 0;
export const selectTotalPrice = (state) => state.cart?.totalPrice || 0;
export const selectCartLoading = (state) => state.cart?.loading || false;
export const selectCartError = (state) => state.cart?.error || null;
export const selectCartItemCount = (state) => state.cart?.cartitems?.length || 0;

// ================= HELPER SELECTORS =================
export const selectIsInCart = (productId) => (state) => {
  return state.cart?.cartitems?.some(item => item.productId?._id === productId) || false;
};

export const selectCartItemQuantity = (productId) => (state) => {
  const item = state.cart?.cartitems?.find(item => item.productId?._id === productId);
  return item?.quantity || 0;
};

// ================= DEFAULT EXPORT =================
export default cartSlice.reducer;