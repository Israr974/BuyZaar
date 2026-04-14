import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  mobile: "",
  role: "",
  status: "",
  profile: "",
  address_details: [],
  orderHistory: [],
  shopping_cart: [],
  wishlist: [],
  createdAt: null,
  updatedAt: null,
  isVerified: false,
  isLoggedIn: false,
  lastLogin: null,
  preferences: {
    notifications: true,
    emailUpdates: true,
    language: "en",
    currency: "INR"
  },
  stats: {
    totalOrders: 0,
    totalSpent: 0,
    savedAddresses: 0,
    wishlistCount: 0
  }
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      if (user && Object.keys(user).length > 0) {
        Object.assign(state, user);
        state.isLoggedIn = true;
        
        state.stats.totalOrders = user.orderHistory?.length || 0;
        state.stats.savedAddresses = user.address_details?.length || 0;
        state.stats.wishlistCount = user.wishlist?.length || 0;
        state.stats.totalSpent = user.orderHistory?.reduce(
          (sum, order) => sum + (order.totalAmount || order.total || 0), 0
        ) || 0;
        
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch {}
      } else {
        Object.assign(state, initialState);
        state.isLoggedIn = false;
        try {
          localStorage.removeItem("user");
        } catch {}
      }
    },
    
    updateUser(state, action) {
      const updates = action.payload;
      Object.assign(state, updates);
      state.isLoggedIn = true;
      
      if (updates.orderHistory) {
        state.stats.totalOrders = updates.orderHistory.length;
        state.stats.totalSpent = updates.orderHistory.reduce(
          (sum, order) => sum + (order.totalAmount || order.total || 0), 0
        );
      }
      if (updates.address_details) {
        state.stats.savedAddresses = updates.address_details.length;
      }
      if (updates.wishlist) {
        state.stats.wishlistCount = updates.wishlist.length;
      }
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    logout(state) {
      Object.assign(state, initialState);
      state.isLoggedIn = false;
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      } catch {}
    },
    
    updateProfile(state, action) {
      const { name, email, mobile } = action.payload;
      if (name) state.name = name;
      if (email) state.email = email;
      if (mobile) state.mobile = mobile;
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    updateAddress(state, action) {
      const address = action.payload;
      const index = state.address_details.findIndex(addr => addr._id === address._id);
      if (index !== -1) {
        state.address_details[index] = address;
      } else {
        state.address_details.push(address);
      }
      state.stats.savedAddresses = state.address_details.length;
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    removeAddress(state, action) {
      const addressId = action.payload;
      state.address_details = state.address_details.filter(addr => addr._id !== addressId);
      state.stats.savedAddresses = state.address_details.length;
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    addToWishlist(state, action) {
      const product = action.payload;
      if (!state.wishlist.some(item => item.productId === product._id)) {
        state.wishlist.push(product);
        state.stats.wishlistCount = state.wishlist.length;
        
        try {
          localStorage.setItem("user", JSON.stringify(state));
        } catch {}
      }
    },
    
    removeFromWishlist(state, action) {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(item => item.productId !== productId);
      state.stats.wishlistCount = state.wishlist.length;
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    clearWishlist(state) {
      state.wishlist = [];
      state.stats.wishlistCount = 0;
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    addOrder(state, action) {
      const order = action.payload;
      state.orderHistory.unshift(order);
      state.stats.totalOrders = state.orderHistory.length;
      state.stats.totalSpent += order.totalAmount || order.total || 0;
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    updateOrderStatus(state, action) {
      const { orderId, status } = action.payload;
      const order = state.orderHistory.find(o => o._id === orderId);
      if (order) {
        order.status = status;
        order.orderStatus = status;
        
        try {
          localStorage.setItem("user", JSON.stringify(state));
        } catch {}
      }
    },
    
    updatePreferences(state, action) {
      state.preferences = { ...state.preferences, ...action.payload };
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    setLastLogin(state) {
      state.lastLogin = new Date().toISOString();
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    verifyEmail(state) {
      state.isVerified = true;
      
      try {
        localStorage.setItem("user", JSON.stringify(state));
      } catch {}
    },
    
    resetUserState() {
      return initialState;
    },
  },
});

export const { 
  setUser, 
  updateUser,
  logout, 
  updateProfile,
  updateAddress,
  removeAddress,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  addOrder,
  updateOrderStatus,
  updatePreferences,
  setLastLogin,
  verifyEmail,
  resetUserState
} = userSlice.actions;

export default userSlice.reducer;