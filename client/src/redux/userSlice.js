import { createSlice } from "@reduxjs/toolkit";

// ================= CONSTANTS =================
const STORAGE_KEYS = {
  USER: "user",
  TOKEN: "token",
  REFRESH_TOKEN: "refreshToken",
};

const USER_ROLES = {
  USER: "user",
  ADMIN: "admin",
  SELLER: "seller",
  MODERATOR: "moderator",
};

const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
  PENDING: "pending",
};

const DEFAULT_PREFERENCES = {
  notifications: true,
  emailUpdates: true,
  smsNotifications: false,
  marketingEmails: true,
  language: "en",
  currency: "INR",
  theme: "light",
  twoFactorEnabled: false,
};

// ================= HELPER FUNCTIONS =================
const loadUserFromStorage = () => {
  if (typeof window === "undefined") return null;
  
  try {
    const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
    if (savedUser) {
      const user = JSON.parse(savedUser);
      // Don't restore sensitive data from storage
      delete user.token;
      delete user.refreshToken;
      return user;
    }
  } catch (error) {
    console.error("Failed to load user from localStorage:", error);
  }
  return null;
};

const saveUserToStorage = (user) => {
  if (typeof window === "undefined") return;
  
  try {
    const userToSave = { ...user };
    // Don't store sensitive data
    delete userToSave.token;
    delete userToSave.refreshToken;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userToSave));
  } catch (error) {
    console.error("Failed to save user to localStorage:", error);
  }
};

const clearUserStorage = () => {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
};

const calculateUserStats = (user) => {
  const orderHistory = user.orderHistory || [];
  const addressDetails = user.address_details || [];
  const wishlist = user.wishlist || [];
  
  return {
    totalOrders: orderHistory.length,
    totalSpent: orderHistory.reduce(
      (sum, order) => sum + (order.priceBreakdown?.total || order.totalAmount || order.total || 0), 
      0
    ),
    savedAddresses: addressDetails.length,
    wishlistCount: wishlist.length,
    averageOrderValue: orderHistory.length > 0 
      ? orderHistory.reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0) / orderHistory.length 
      : 0,
    lastOrderDate: orderHistory[0]?.createdAt || null,
  };
};

// ================= INITIAL STATE =================
const getInitialState = () => {
  const savedUser = loadUserFromStorage();
  
  if (savedUser && savedUser.isLoggedIn) {
    return {
      ...savedUser,
      stats: calculateUserStats(savedUser),
    };
  }
  
  return {
    // Basic Info
    id: "",
    name: "",
    email: "",
    mobile: "",
    alternativeMobile: "",
    avatar: "",
    role: USER_ROLES.USER,
    status: USER_STATUS.PENDING,
    
    // Addresses
    address_details: [],
    defaultAddress: null,
    
    // Orders
    orderHistory: [],
    currentOrder: null,
    
    // Cart & Wishlist
    shopping_cart: [],
    wishlist: [],
    
    // Timestamps
    createdAt: null,
    updatedAt: null,
    lastLogin: null,
    lastActivity: null,
    
    // Verification
    isVerified: false,
    isEmailVerified: false,
    isMobileVerified: false,
    isLoggedIn: false,
    
    // Preferences
    preferences: { ...DEFAULT_PREFERENCES },
    
    // Security
    twoFactorEnabled: false,
    lastPasswordChange: null,
    
    // Stats
    stats: {
      totalOrders: 0,
      totalSpent: 0,
      savedAddresses: 0,
      wishlistCount: 0,
      averageOrderValue: 0,
      lastOrderDate: null,
    },
    
    // Session
    sessionId: null,
    tokenExpiry: null,
  };
};

const initialState = getInitialState();

// ================= SLICE =================
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ================= SET USER =================
    setUser: (state, action) => {
      const user = action.payload;
      
      if (user && Object.keys(user).length > 0 && user.id) {
        // Update all user fields
        Object.assign(state, user);
        state.isLoggedIn = true;
        state.lastActivity = new Date().toISOString();
        
        // Calculate stats
        state.stats = calculateUserStats(state);
        
        // Save to localStorage
        saveUserToStorage(state);
      } else {
        // Clear user state
        Object.assign(state, getInitialState());
        state.isLoggedIn = false;
        clearUserStorage();
      }
    },
    
    // ================= UPDATE USER =================
    updateUser: (state, action) => {
      const updates = action.payload;
      
      // Update fields
      Object.assign(state, updates);
      state.isLoggedIn = true;
      state.updatedAt = new Date().toISOString();
      
      // Recalculate stats if related fields changed
      if (updates.orderHistory || updates.address_details || updates.wishlist) {
        state.stats = calculateUserStats(state);
      }
      
      saveUserToStorage(state);
    },
    
    // ================= LOGOUT =================
    logout: (state) => {
      // Clear all user data
      Object.assign(state, getInitialState());
      state.isLoggedIn = false;
      
      // Clear storage
      clearUserStorage();
      
      // Clear any other session data
      if (typeof window !== "undefined") {
        sessionStorage.clear();
      }
    },
    
    // ================= PROFILE UPDATES =================
    updateProfile: (state, action) => {
      const { name, email, mobile, alternativeMobile, avatar } = action.payload;
      
      if (name !== undefined) state.name = name;
      if (email !== undefined) state.email = email;
      if (mobile !== undefined) state.mobile = mobile;
      if (alternativeMobile !== undefined) state.alternativeMobile = alternativeMobile;
      if (avatar !== undefined) state.avatar = avatar;
      
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    updateAvatar: (state, action) => {
      state.avatar = action.payload;
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    // ================= ADDRESS MANAGEMENT =================
    addAddress: (state, action) => {
      const address = action.payload;
      const newAddress = {
        ...address,
        _id: address._id || Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      
      state.address_details.push(newAddress);
      state.stats.savedAddresses = state.address_details.length;
      
      // Set as default if it's the first address
      if (!state.defaultAddress && state.address_details.length === 1) {
        state.defaultAddress = newAddress._id;
      }
      
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    updateAddress: (state, action) => {
      const address = action.payload;
      const index = state.address_details.findIndex(addr => addr._id === address._id);
      
      if (index !== -1) {
        state.address_details[index] = { 
          ...state.address_details[index], 
          ...address,
          updatedAt: new Date().toISOString(),
        };
        saveUserToStorage(state);
      }
    },
    
    removeAddress: (state, action) => {
      const addressId = action.payload;
      state.address_details = state.address_details.filter(addr => addr._id !== addressId);
      state.stats.savedAddresses = state.address_details.length;
      
      // Clear default address if it was removed
      if (state.defaultAddress === addressId) {
        state.defaultAddress = state.address_details[0]?._id || null;
      }
      
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    setDefaultAddress: (state, action) => {
      const addressId = action.payload;
      const addressExists = state.address_details.some(addr => addr._id === addressId);
      
      if (addressExists) {
        state.defaultAddress = addressId;
        saveUserToStorage(state);
      }
    },
    
    // ================= WISHLIST MANAGEMENT =================
    addToWishlist: (state, action) => {
      const product = action.payload;
      
      if (!state.wishlist.some(item => item.productId === product._id || item._id === product._id)) {
        const wishlistItem = {
          productId: product._id,
          product: product,
          addedAt: new Date().toISOString(),
        };
        
        state.wishlist.push(wishlistItem);
        state.stats.wishlistCount = state.wishlist.length;
        saveUserToStorage(state);
      }
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      state.wishlist = state.wishlist.filter(
        item => item.productId !== productId && item._id !== productId
      );
      state.stats.wishlistCount = state.wishlist.length;
      saveUserToStorage(state);
    },
    
    clearWishlist: (state) => {
      state.wishlist = [];
      state.stats.wishlistCount = 0;
      saveUserToStorage(state);
    },
    
    // ================= ORDER MANAGEMENT =================
    addOrder: (state, action) => {
      const order = action.payload;
      const newOrder = {
        ...order,
        orderDate: order.createdAt || new Date().toISOString(),
      };
      
      state.orderHistory.unshift(newOrder);
      state.stats = calculateUserStats(state);
      saveUserToStorage(state);
    },
    
    updateOrderStatus: (state, action) => {
      const { orderId, status, trackingNumber, deliveryDate } = action.payload;
      const order = state.orderHistory.find(o => o._id === orderId);
      
      if (order) {
        order.status = status;
        order.orderStatus = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (deliveryDate) order.deliveryDate = deliveryDate;
        
        // Recalculate stats if order status affects totals
        if (status === "delivered" && !order.wasCounted) {
          order.wasCounted = true;
          state.stats = calculateUserStats(state);
        }
        
        saveUserToStorage(state);
      }
    },
    
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // ================= PREFERENCES =================
    updatePreferences: (state, action) => {
      state.preferences = { ...state.preferences, ...action.payload };
      saveUserToStorage(state);
    },
    
    toggleNotification: (state, action) => {
      const { type, enabled } = action.payload;
      if (state.preferences.hasOwnProperty(type)) {
        state.preferences[type] = enabled;
        saveUserToStorage(state);
      }
    },
    
    // ================= VERIFICATION =================
    verifyEmail: (state) => {
      state.isEmailVerified = true;
      state.isVerified = state.isEmailVerified && state.isMobileVerified;
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    verifyMobile: (state) => {
      state.isMobileVerified = true;
      state.isVerified = state.isEmailVerified && state.isMobileVerified;
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    // ================= SESSION MANAGEMENT =================
    setLastLogin: (state) => {
      state.lastLogin = new Date().toISOString();
      state.lastActivity = state.lastLogin;
      saveUserToStorage(state);
    },
    
    updateLastActivity: (state) => {
      state.lastActivity = new Date().toISOString();
    },
    
    setSession: (state, action) => {
      const { sessionId, tokenExpiry } = action.payload;
      state.sessionId = sessionId;
      state.tokenExpiry = tokenExpiry;
      saveUserToStorage(state);
    },
    
    clearSession: (state) => {
      state.sessionId = null;
      state.tokenExpiry = null;
      saveUserToStorage(state);
    },
    
    // ================= SECURITY =================
    enableTwoFactor: (state) => {
      state.twoFactorEnabled = true;
      saveUserToStorage(state);
    },
    
    disableTwoFactor: (state) => {
      state.twoFactorEnabled = false;
      saveUserToStorage(state);
    },
    
    updatePasswordTimestamp: (state) => {
      state.lastPasswordChange = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    // ================= ROLE & STATUS =================
    updateUserRole: (state, action) => {
      const { role, updatedBy } = action.payload;
      state.role = role;
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    updateUserStatus: (state, action) => {
      state.status = action.payload;
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    // ================= BULK OPERATIONS =================
    syncUserData: (state, action) => {
      const { orders, wishlist, addresses, preferences } = action.payload;
      
      if (orders) state.orderHistory = orders;
      if (wishlist) state.wishlist = wishlist;
      if (addresses) state.address_details = addresses;
      if (preferences) state.preferences = { ...state.preferences, ...preferences };
      
      state.stats = calculateUserStats(state);
      state.updatedAt = new Date().toISOString();
      saveUserToStorage(state);
    },
    
    // ================= RESET =================
    resetUserState: () => getInitialState(),
  },
});

// ================= EXPORT ACTIONS =================
export const {
  // User
  setUser,
  updateUser,
  logout,
  
  // Profile
  updateProfile,
  updateAvatar,
  
  // Addresses
  addAddress,
  updateAddress,
  removeAddress,
  setDefaultAddress,
  
  // Wishlist
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  
  // Orders
  addOrder,
  updateOrderStatus,
  setCurrentOrder,
  clearCurrentOrder,
  
  // Preferences
  updatePreferences,
  toggleNotification,
  
  // Verification
  verifyEmail,
  verifyMobile,
  
  // Session
  setLastLogin,
  updateLastActivity,
  setSession,
  clearSession,
  
  // Security
  enableTwoFactor,
  disableTwoFactor,
  updatePasswordTimestamp,
  
  // Role & Status
  updateUserRole,
  updateUserStatus,
  
  // Bulk
  syncUserData,
  
  // Reset
  resetUserState,
} = userSlice.actions;

// ================= SELECTORS =================
export const selectUser = (state) => state.user || {};
export const selectUserId = (state) => state.user?.id || "";
export const selectUserName = (state) => state.user?.name || "";
export const selectUserEmail = (state) => state.user?.email || "";
export const selectUserMobile = (state) => state.user?.mobile || "";
export const selectUserAvatar = (state) => state.user?.avatar || "";
export const selectUserRole = (state) => state.user?.role || USER_ROLES.USER;
export const selectIsAdmin = (state) => state.user?.role === USER_ROLES.ADMIN;
export const selectIsLoggedIn = (state) => state.user?.isLoggedIn || false;
export const selectIsVerified = (state) => state.user?.isVerified || false;
export const selectIsEmailVerified = (state) => state.user?.isEmailVerified || false;
export const selectIsMobileVerified = (state) => state.user?.isMobileVerified || false;

// Address selectors
export const selectAddresses = (state) => state.user?.address_details || [];
export const selectDefaultAddress = (state) => {
  const addresses = selectAddresses(state);
  const defaultId = state.user?.defaultAddress;
  return addresses.find(addr => addr._id === defaultId) || addresses[0] || null;
};

// Wishlist selectors
export const selectWishlist = (state) => state.user?.wishlist || [];
export const selectWishlistCount = (state) => state.user?.stats?.wishlistCount || 0;
export const selectIsInWishlist = (productId) => (state) => {
  const wishlist = selectWishlist(state);
  return wishlist.some(item => item.productId === productId || item._id === productId);
};

// Order selectors
export const selectOrderHistory = (state) => state.user?.orderHistory || [];
export const selectOrderCount = (state) => state.user?.stats?.totalOrders || 0;
export const selectTotalSpent = (state) => state.user?.stats?.totalSpent || 0;
export const selectAverageOrderValue = (state) => state.user?.stats?.averageOrderValue || 0;

// Preference selectors
export const selectPreferences = (state) => state.user?.preferences || DEFAULT_PREFERENCES;
export const selectNotificationPreference = (state) => state.user?.preferences?.notifications ?? true;
export const selectEmailUpdatesPreference = (state) => state.user?.preferences?.emailUpdates ?? true;
export const selectUserLanguage = (state) => state.user?.preferences?.language || "en";
export const selectUserCurrency = (state) => state.user?.preferences?.currency || "INR";

// Stats selectors
export const selectUserStats = (state) => state.user?.stats || {};
export const selectSavedAddressesCount = (state) => state.user?.stats?.savedAddresses || 0;

// Session selectors
export const selectLastLogin = (state) => state.user?.lastLogin || null;
export const selectLastActivity = (state) => state.user?.lastActivity || null;
export const selectUserStatus = (state) => state.user?.status || USER_STATUS.PENDING;

// Security selectors
export const selectTwoFactorEnabled = (state) => state.user?.twoFactorEnabled || false;

// ================= HELPER SELECTORS =================
export const selectHasAddresses = (state) => (state.user?.address_details?.length || 0) > 0;
export const selectHasOrders = (state) => (state.user?.orderHistory?.length || 0) > 0;
export const selectHasWishlist = (state) => (state.user?.wishlist?.length || 0) > 0;

export const selectUserDisplayName = (state) => {
  const user = selectUser(state);
  return user.name || user.email?.split("@")[0] || "Guest";
};

export const selectUserInitials = (state) => {
  const name = selectUserName(state);
  if (!name) return "U";
  return name
    .split(" ")
    .map(part => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

// ================= EXPORT CONSTANTS =================
export { USER_ROLES, USER_STATUS, DEFAULT_PREFERENCES, STORAGE_KEYS };

// ================= DEFAULT EXPORT =================
export default userSlice.reducer;