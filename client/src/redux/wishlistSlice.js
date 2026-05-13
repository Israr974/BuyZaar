import { createSlice } from "@reduxjs/toolkit";


const STORAGE_KEY = "wishlist";
const MAX_WISHLIST_ITEMS = 100;

const saveToLocalStorage = (state) => {
  if (typeof window === "undefined") return;
  
  try {
    const toSave = {
      items: state.items,
      totalItems: state.totalItems,
      lastUpdated: state.lastUpdated,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (error) {
    console.error("Failed to save wishlist to localStorage:", error);
  }
};

const loadFromLocalStorage = () => {
  if (typeof window === "undefined") return null;
  
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load wishlist from localStorage:", error);
  }
  return null;
};

const normalizeProduct = (product) => {

  const productId = product?.productId?._id || 
                    product?.productId || 
                    product?._id || 
                    product;
  
  return {
    id: productId,
    productId: productId,
    name: product?.name || product?.product?.name || "",
    price: product?.price || product?.product?.price || 0,
    originalPrice: product?.originalPrice || product?.product?.originalPrice || null,
    discount: product?.discount || product?.product?.discount || 0,
    image: product?.image?.[0] || product?.product?.image?.[0] || product?.image || null,
    rating: product?.rating || product?.product?.rating || 0,
    reviewCount: product?.reviewCount || product?.product?.reviewCount || 0,
    stock: product?.stock || product?.product?.stock || 0,
    brand: product?.brand || product?.product?.brand || "",
    category: product?.category || product?.product?.category || null,
    addedAt: product?.addedAt || new Date().toISOString(),
    product: product?.product || product,
  };
};

const isProductInWishlist = (items, productId) => {
  return items.some(
    (item) => item.id === productId || 
              item.productId === productId || 
              item._id === productId
  );
};

const getInitialState = () => {
  const savedState = loadFromLocalStorage();
  
  if (savedState && Array.isArray(savedState.items)) {
    return {
      items: savedState.items,
      totalItems: savedState.items.length,
      loading: false,
      error: null,
      lastUpdated: savedState.lastUpdated || new Date().toISOString(),
      syncStatus: "idle", 
    };
  }
  
  return {
    items: [],
    totalItems: 0,
    loading: false,
    error: null,
    lastUpdated: null,
    syncStatus: "idle",
  };
};

const initialState = getInitialState();

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      const items = action.payload;
      const normalizedItems = items.map(normalizeProduct);
      
      state.items = normalizedItems;
      state.totalItems = normalizedItems.length;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
      
      saveToLocalStorage(state);
    },
    
    addToWishlist: (state, action) => {
      const product = action.payload;
      const productId = product?.productId?._id || product?._id || product?.productId;
      
      if (isProductInWishlist(state.items, productId)) {
        state.error = "Product already in wishlist";
        return;
      }
      
      if (state.items.length >= MAX_WISHLIST_ITEMS) {
        state.error = `Wishlist cannot exceed ${MAX_WISHLIST_ITEMS} items`;
        return;
      }
      
      const normalizedItem = normalizeProduct(product);
      state.items.unshift(normalizedItem);
      state.totalItems = state.items.length;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
      
      saveToLocalStorage(state);
    },
    
    removeFromWishlist: (state, action) => {
      const productId = action.payload;
      const originalLength = state.items.length;
      
      state.items = state.items.filter(
        (item) => item.id !== productId && 
                  item.productId !== productId && 
                  item._id !== productId
      );
      
      if (state.items.length < originalLength) {
        state.totalItems = state.items.length;
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(state);
      } else {
        state.error = "Product not found in wishlist";
      }
    },
    
    removeMultipleFromWishlist: (state, action) => {
      const productIds = new Set(action.payload);
      const originalLength = state.items.length;
      
      state.items = state.items.filter(
        (item) => !productIds.has(item.id) && 
                  !productIds.has(item.productId) && 
                  !productIds.has(item._id)
      );
      
      if (state.items.length < originalLength) {
        state.totalItems = state.items.length;
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(state);
      }
    },
    
    clearWishlist: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.lastUpdated = new Date().toISOString();
      state.error = null;
      saveToLocalStorage(state);
    },
    
    moveToCart: (state, action) => {
      const productId = action.payload;
      const itemToMove = state.items.find(
        (item) => item.id === productId || 
                  item.productId === productId || 
                  item._id === productId
      );
      
      if (itemToMove) {
        state.items = state.items.filter(
          (item) => item !== itemToMove
        );
        state.totalItems = state.items.length;
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(state);
        
        return { movedItem: itemToMove };
      }
      return null;
    },
    
    moveAllToCart: (state) => {
      const movedItems = [...state.items];
      state.items = [];
      state.totalItems = 0;
      state.lastUpdated = new Date().toISOString();
      saveToLocalStorage(state);
      
      return { movedItems };
    },
    
    updateWishlistItem: (state, action) => {
      const { productId, updates } = action.payload;
      const index = state.items.findIndex(
        (item) => item.id === productId || 
                  item.productId === productId || 
                  item._id === productId
      );
      
      if (index !== -1) {
        state.items[index] = { 
          ...state.items[index], 
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(state);
      } else {
        state.error = "Product not found in wishlist";
      }
    },
    
    bulkAddToWishlist: (state, action) => {
      const products = action.payload;
      const newItems = [];
      
      for (const product of products) {
        const productId = product?.productId?._id || product?._id;
        
        if (!isProductInWishlist(state.items, productId) && 
            state.items.length + newItems.length < MAX_WISHLIST_ITEMS) {
          newItems.push(normalizeProduct(product));
        }
      }
      
      if (newItems.length > 0) {
        state.items = [...newItems, ...state.items];
        state.totalItems = state.items.length;
        state.lastUpdated = new Date().toISOString();
        saveToLocalStorage(state);
      }
    },
    
    checkInWishlist: (state, action) => {
      const productId = action.payload;
      return isProductInWishlist(state.items, productId);
    },
    
    syncWishlistStart: (state) => {
      state.syncStatus = "syncing";
    },
    
    syncWishlistSuccess: (state, action) => {
      const serverItems = action.payload;
      const normalizedItems = serverItems.map(normalizeProduct);
      
      const localIds = new Set(state.items.map(item => item.id));
      const mergedItems = [...normalizedItems];
      
      for (const item of state.items) {
        if (!localIds.has(item.id)) {
          mergedItems.push(item);
        }
      }
      
      state.items = mergedItems;
      state.totalItems = mergedItems.length;
      state.lastUpdated = new Date().toISOString();
      state.syncStatus = "synced";
      state.error = null;
      
      saveToLocalStorage(state);
    },
    
    syncWishlistError: (state, action) => {
      state.syncStatus = "error";
      state.error = action.payload;
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
    
    resetWishlist: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
      return initialState;
    },
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
  bulkAddToWishlist,
  checkInWishlist,
  syncWishlistStart,
  syncWishlistSuccess,
  syncWishlistError,
  setWishlistLoading,
  setWishlistError,
  clearWishlistError,
  resetWishlist,
} = wishlistSlice.actions;

export const selectWishlistItems = (state) => state.wishlist?.items || [];
export const selectWishlistCount = (state) => state.wishlist?.totalItems || 0;
export const selectWishlistLoading = (state) => state.wishlist?.loading || false;
export const selectWishlistError = (state) => state.wishlist?.error || null;
export const selectWishlistLastUpdated = (state) => state.wishlist?.lastUpdated || null;
export const selectWishlistSyncStatus = (state) => state.wishlist?.syncStatus || "idle";

export const selectIsInWishlist = (productId) => (state) => {
  const items = selectWishlistItems(state);
  return items.some(
    (item) => item.id === productId || 
              item.productId === productId || 
              item._id === productId
  );
};

export const selectWishlistItemById = (productId) => (state) => {
  const items = selectWishlistItems(state);
  return items.find(
    (item) => item.id === productId || 
              item.productId === productId || 
              item._id === productId
  ) || null;
};

export const selectWishlistProductIds = (state) => {
  const items = selectWishlistItems(state);
  return items.map(item => item.id || item.productId || item._id);
};

export const selectWishlistItemsByCategory = (categoryId) => (state) => {
  const items = selectWishlistItems(state);
  return items.filter(item => item.category === categoryId);
};

export const selectWishlistTotalValue = (state) => {
  const items = selectWishlistItems(state);
  return items.reduce((total, item) => total + (item.price || 0), 0);
};

export const selectWishlistDiscountedValue = (state) => {
  const items = selectWishlistItems(state);
  return items.reduce((total, item) => {
    const price = item.price || 0;
    const discount = item.discount || 0;
    const discountedPrice = price - (price * discount / 100);
    return total + discountedPrice;
  }, 0);
};

export const selectWishlistSavings = (state) => {
  return selectWishlistTotalValue(state) - selectWishlistDiscountedValue(state);
};

export const selectWishlistItemsInStock = (state) => {
  const items = selectWishlistItems(state);
  return items.filter(item => (item.stock || 0) > 0);
};

export const selectWishlistItemsOutOfStock = (state) => {
  const items = selectWishlistItems(state);
  return items.filter(item => (item.stock || 0) === 0);
};

export const selectRecentWishlistItems = (limit = 5) => (state) => {
  const items = selectWishlistItems(state);
  return [...items]
    .sort((a, b) => new Date(b.addedAt || 0) - new Date(a.addedAt || 0))
    .slice(0, limit);
};

export const selectWishlistGroupedByCategory = (state) => {
  const items = selectWishlistItems(state);
  const grouped = {};
  
  items.forEach(item => {
    const category = item.category || "Uncategorized";
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(item);
  });
  
  return grouped;
};

export const selectHasWishlistItems = (state) => selectWishlistCount(state) > 0;
export const selectIsWishlistEmpty = (state) => selectWishlistCount(state) === 0;
export const selectIsWishlistFull = (state) => selectWishlistCount(state) >= MAX_WISHLIST_ITEMS;
export const selectRemainingWishlistSlots = (state) => MAX_WISHLIST_ITEMS - selectWishlistCount(state);

export { MAX_WISHLIST_ITEMS };

export default wishlistSlice.reducer;