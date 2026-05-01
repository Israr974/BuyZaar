import { createSlice } from "@reduxjs/toolkit";

// ================= CONSTANTS =================
const STORAGE_KEY = "product_filters";
const DEFAULT_LIMIT = 12;
const DEFAULT_SORT = "newest";

const SORT_OPTIONS = {
  NEWEST: "newest",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
  RATING: "rating",
  POPULARITY: "popularity",
  DISCOUNT: "discount",
};

const SORT_LABELS = {
  [SORT_OPTIONS.NEWEST]: "Newest First",
  [SORT_OPTIONS.PRICE_LOW]: "Price: Low to High",
  [SORT_OPTIONS.PRICE_HIGH]: "Price: High to Low",
  [SORT_OPTIONS.RATING]: "Top Rated",
  [SORT_OPTIONS.POPULARITY]: "Most Popular",
  [SORT_OPTIONS.DISCOUNT]: "Best Discount",
};

// ================= HELPER FUNCTIONS =================
const saveFiltersToLocalStorage = (filters) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
  }
};

const loadFiltersFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse product filters from localStorage", e);
      }
    }
  }
  return null;
};

const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  
  switch (sortBy) {
    case SORT_OPTIONS.PRICE_LOW:
      return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
    case SORT_OPTIONS.PRICE_HIGH:
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
    case SORT_OPTIONS.RATING:
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    case SORT_OPTIONS.POPULARITY:
      return sorted.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    case SORT_OPTIONS.DISCOUNT:
      return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
    case SORT_OPTIONS.NEWEST:
    default:
      return sorted.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }
};

const filterProducts = (products, filters) => {
  let filtered = [...products];
  
  // Filter by category
  if (filters.category) {
    filtered = filtered.filter(
      (product) => product.category?._id === filters.category || product.category === filters.category
    );
  }
  
  // Filter by subcategory
  if (filters.subCategory) {
    filtered = filtered.filter(
      (product) =>
        product.sub_category?.some((sub) => sub._id === filters.subCategory || sub === filters.subCategory)
    );
  }
  
  // Filter by price range
  if (filters.minPrice !== null && filters.minPrice !== "") {
    filtered = filtered.filter((product) => (product.price || 0) >= Number(filters.minPrice));
  }
  if (filters.maxPrice !== null && filters.maxPrice !== "") {
    filtered = filtered.filter((product) => (product.price || 0) <= Number(filters.maxPrice));
  }
  
  // Filter by stock
  if (filters.inStock) {
    filtered = filtered.filter((product) => (product.stock || 0) > 0);
  }
  
  // Filter by search
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (product) =>
        product.name?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};

// ================= INITIAL STATE =================
const getInitialFilters = () => {
  const savedFilters = loadFiltersFromLocalStorage();
  return savedFilters || {
    category: null,
    subCategory: null,
    minPrice: null,
    maxPrice: null,
    sortBy: DEFAULT_SORT,
    inStock: false,
    search: "",
    brand: null,
    rating: null,
  };
};

const initialState = {
  allCategory: [],
  loadingCategory: false,
  subCategory: [],
  products: [],
  filteredProducts: [],
  currentProduct: null,
  featuredProducts: [],
  recentProducts: [],
  popularProducts: [],
  relatedProducts: [],
  loading: false,
  error: null,
  filters: getInitialFilters(),
  pagination: {
    page: 1,
    limit: DEFAULT_LIMIT,
    total: 0,
    totalPages: 1,
    hasNext: false,
    hasPrev: false,
  },
};

// ================= SLICE =================
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    // ================= CATEGORY REDUCERS =================
    setAllCategory: (state, action) => {
      state.allCategory = [...action.payload];
    },
    
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload;
    },
    
    addCategory: (state, action) => {
      state.allCategory.unshift(action.payload);
    },
    
    updateCategory: (state, action) => {
      const index = state.allCategory.findIndex((cat) => cat._id === action.payload._id);
      if (index !== -1) {
        state.allCategory[index] = action.payload;
      }
    },
    
    removeCategory: (state, action) => {
      state.allCategory = state.allCategory.filter((cat) => cat._id !== action.payload);
    },
    
    // ================= SUBCATEGORY REDUCERS =================
    setSubCategory: (state, action) => {
      state.subCategory = [...action.payload];
    },
    
    addSubCategory: (state, action) => {
      state.subCategory.unshift(action.payload);
    },
    
    updateSubCategory: (state, action) => {
      const index = state.subCategory.findIndex((sub) => sub._id === action.payload._id);
      if (index !== -1) {
        state.subCategory[index] = action.payload;
      }
    },
    
    removeSubCategory: (state, action) => {
      state.subCategory = state.subCategory.filter((sub) => sub._id !== action.payload);
    },
    
    // ================= PRODUCT REDUCERS =================
    setProducts: (state, action) => {
      const products = action.payload;
      state.products = products;
      
      // Apply current filters and sorting
      const filtered = filterProducts(products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      
      // Update pagination total
      state.pagination.total = state.filteredProducts.length;
      state.pagination.totalPages = Math.ceil(state.filteredProducts.length / state.pagination.limit);
    },
    
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    
    addProduct: (state, action) => {
      state.products.unshift(action.payload);
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.total = state.filteredProducts.length;
      state.pagination.totalPages = Math.ceil(state.filteredProducts.length / state.pagination.limit);
    },
    
    updateProduct: (state, action) => {
      const index = state.products.findIndex((prod) => prod._id === action.payload._id);
      if (index !== -1) {
        state.products[index] = action.payload;
        
        // Reapply filters
        const filtered = filterProducts(state.products, state.filters);
        state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      }
      if (state.currentProduct?._id === action.payload._id) {
        state.currentProduct = action.payload;
      }
    },
    
    removeProduct: (state, action) => {
      state.products = state.products.filter((prod) => prod._id !== action.payload);
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.total = state.filteredProducts.length;
      state.pagination.totalPages = Math.ceil(state.filteredProducts.length / state.pagination.limit);
      
      if (state.currentProduct?._id === action.payload) {
        state.currentProduct = null;
      }
    },
    
    // ================= FEATURED PRODUCTS =================
    setFeaturedProducts: (state, action) => {
      state.featuredProducts = [...action.payload];
    },
    
    setRecentProducts: (state, action) => {
      state.recentProducts = [...action.payload];
    },
    
    setPopularProducts: (state, action) => {
      state.popularProducts = [...action.payload];
    },
    
    setRelatedProducts: (state, action) => {
      state.relatedProducts = [...action.payload];
    },
    
    // ================= FILTERS =================
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      saveFiltersToLocalStorage(state.filters);
      
      // Reapply filters to products
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      
      // Reset to first page when filters change
      state.pagination.page = 1;
      state.pagination.total = state.filteredProducts.length;
      state.pagination.totalPages = Math.ceil(state.filteredProducts.length / state.pagination.limit);
    },
    
    clearFilters: (state) => {
      state.filters = {
        category: null,
        subCategory: null,
        minPrice: null,
        maxPrice: null,
        sortBy: DEFAULT_SORT,
        inStock: false,
        search: "",
        brand: null,
        rating: null,
      };
      saveFiltersToLocalStorage(state.filters);
      
      // Reset products to unfiltered
      state.filteredProducts = sortProducts([...state.products], DEFAULT_SORT);
      state.pagination.page = 1;
      state.pagination.total = state.filteredProducts.length;
      state.pagination.totalPages = Math.ceil(state.filteredProducts.length / state.pagination.limit);
    },
    
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
      saveFiltersToLocalStorage(state.filters);
      state.filteredProducts = sortProducts(state.filteredProducts, action.payload);
    },
    
    setPriceRange: (state, action) => {
      state.filters.minPrice = action.payload.min;
      state.filters.maxPrice = action.payload.max;
      saveFiltersToLocalStorage(state.filters);
      
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.page = 1;
    },
    
    setCategoryFilter: (state, action) => {
      state.filters.category = action.payload;
      saveFiltersToLocalStorage(state.filters);
      
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.page = 1;
    },
    
    setSubCategoryFilter: (state, action) => {
      state.filters.subCategory = action.payload;
      saveFiltersToLocalStorage(state.filters);
      
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.page = 1;
    },
    
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      saveFiltersToLocalStorage(state.filters);
      
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.page = 1;
    },
    
    setBrandFilter: (state, action) => {
      state.filters.brand = action.payload;
      saveFiltersToLocalStorage(state.filters);
      
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.page = 1;
    },
    
    setRatingFilter: (state, action) => {
      state.filters.rating = action.payload;
      saveFiltersToLocalStorage(state.filters);
      
      let filtered = filterProducts(state.products, state.filters);
      if (action.payload) {
        filtered = filtered.filter((product) => (product.rating || 0) >= action.payload);
      }
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.page = 1;
    },
    
    toggleInStockFilter: (state) => {
      state.filters.inStock = !state.filters.inStock;
      saveFiltersToLocalStorage(state.filters);
      
      const filtered = filterProducts(state.products, state.filters);
      state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
      state.pagination.page = 1;
    },
    
    // ================= PAGINATION =================
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
      state.pagination.hasNext = state.pagination.page < state.pagination.totalPages;
      state.pagination.hasPrev = state.pagination.page > 1;
    },
    
    setPage: (state, action) => {
      const newPage = action.payload;
      state.pagination.page = newPage;
      state.pagination.hasNext = newPage < state.pagination.totalPages;
      state.pagination.hasPrev = newPage > 1;
    },
    
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1;
      state.pagination.totalPages = Math.ceil(state.pagination.total / action.payload);
    },
    
    setTotalProducts: (state, action) => {
      state.pagination.total = action.payload;
      state.pagination.totalPages = Math.ceil(action.payload / state.pagination.limit);
      state.pagination.hasNext = state.pagination.page < state.pagination.totalPages;
      state.pagination.hasPrev = state.pagination.page > 1;
    },
    
    resetPagination: (state) => {
      state.pagination = {
        page: 1,
        limit: DEFAULT_LIMIT,
        total: state.filteredProducts.length,
        totalPages: Math.ceil(state.filteredProducts.length / DEFAULT_LIMIT),
        hasNext: false,
        hasPrev: false,
      };
    },
    
    // ================= LOADING & ERROR STATES =================
    setProductsLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setProductsError: (state, action) => {
      state.error = action.payload;
    },
    
    clearError: (state) => {
      state.error = null;
    },
    
    // ================= RESET STATE =================
    resetProductState: () => initialState,
    
    // ================= SYNC WITH BACKEND =================
    syncProducts: (state, action) => {
      const { products, filters, pagination } = action.payload;
      
      if (products) {
        state.products = products;
        const filtered = filterProducts(products, state.filters);
        state.filteredProducts = sortProducts(filtered, state.filters.sortBy);
        state.pagination.total = state.filteredProducts.length;
        state.pagination.totalPages = Math.ceil(state.filteredProducts.length / state.pagination.limit);
      }
      
      if (filters) {
        state.filters = { ...state.filters, ...filters };
        saveFiltersToLocalStorage(state.filters);
      }
      
      if (pagination) {
        state.pagination = { ...state.pagination, ...pagination };
      }
    },
  },
});

// ================= EXPORT ACTIONS =================
export const {
  // Category actions
  setAllCategory,
  setLoadingCategory,
  addCategory,
  updateCategory,
  removeCategory,
  
  // SubCategory actions
  setSubCategory,
  addSubCategory,
  updateSubCategory,
  removeSubCategory,
  
  // Product actions
  setProducts,
  setCurrentProduct,
  clearCurrentProduct,
  addProduct,
  updateProduct,
  removeProduct,
  
  // Featured products
  setFeaturedProducts,
  setRecentProducts,
  setPopularProducts,
  setRelatedProducts,
  
  // Filter actions
  setFilters,
  clearFilters,
  setSortBy,
  setPriceRange,
  setCategoryFilter,
  setSubCategoryFilter,
  setSearchFilter,
  setBrandFilter,
  setRatingFilter,
  toggleInStockFilter,
  
  // Pagination actions
  setPagination,
  setPage,
  setLimit,
  setTotalProducts,
  resetPagination,
  
  // Loading and Error actions
  setProductsLoading,
  setProductsError,
  clearError,
  
  // Reset and Sync
  resetProductState,
  syncProducts,
} = productSlice.actions;

// ================= SELECTORS =================
export const selectAllCategories = (state) => state.product?.allCategory || [];
export const selectSubCategories = (state) => state.product?.subCategory || [];
export const selectAllProducts = (state) => state.product?.products || [];
export const selectFilteredProducts = (state) => state.product?.filteredProducts || [];
export const selectCurrentProduct = (state) => state.product?.currentProduct || null;
export const selectFeaturedProducts = (state) => state.product?.featuredProducts || [];
export const selectRecentProducts = (state) => state.product?.recentProducts || [];
export const selectPopularProducts = (state) => state.product?.popularProducts || [];
export const selectRelatedProducts = (state) => state.product?.relatedProducts || [];
export const selectProductLoading = (state) => state.product?.loading || false;
export const selectCategoryLoading = (state) => state.product?.loadingCategory || false;
export const selectProductError = (state) => state.product?.error || null;
export const selectProductFilters = (state) => state.product?.filters || {};
export const selectProductPagination = (state) => state.product?.pagination || {};

// ================= DERIVED SELECTORS =================
export const selectPaginatedProducts = (state) => {
  const products = selectFilteredProducts(state);
  const { page, limit } = selectProductPagination(state);
  const start = (page - 1) * limit;
  const end = start + limit;
  return products.slice(start, end);
};

export const selectProductsByCategory = (categoryId) => (state) => {
  const products = selectAllProducts(state);
  return products.filter(
    (product) => product.category?._id === categoryId || product.category === categoryId
  );
};

export const selectProductsBySubCategory = (subCategoryId) => (state) => {
  const products = selectAllProducts(state);
  return products.filter(
    (product) =>
      product.sub_category?.some((sub) => sub._id === subCategoryId || sub === subCategoryId)
  );
};

export const selectProductById = (productId) => (state) => {
  const products = selectAllProducts(state);
  return products.find((product) => product._id === productId) || null;
};

export const selectProductsByPriceRange = (min, max) => (state) => {
  const products = selectFilteredProducts(state);
  return products.filter((product) => (product.price || 0) >= min && (product.price || 0) <= max);
};

export const selectInStockProducts = (state) => {
  const products = selectFilteredProducts(state);
  return products.filter((product) => (product.stock || 0) > 0);
};

export const selectOutOfStockProducts = (state) => {
  const products = selectFilteredProducts(state);
  return products.filter((product) => (product.stock || 0) === 0);
};

export const selectDiscountedProducts = (state) => {
  const products = selectFilteredProducts(state);
  return products.filter((product) => (product.discount || 0) > 0);
};

export const selectProductCount = (state) => selectFilteredProducts(state).length;
export const selectTotalProductCount = (state) => selectAllProducts(state).length;

export const selectMinMaxPrice = (state) => {
  const products = selectAllProducts(state);
  const prices = products.map((p) => p.price || 0);
  return {
    min: prices.length ? Math.min(...prices) : 0,
    max: prices.length ? Math.max(...prices) : 0,
  };
};

export const selectUniqueBrands = (state) => {
  const products = selectAllProducts(state);
  const brands = new Set();
  products.forEach((product) => {
    if (product.brand) brands.add(product.brand);
  });
  return Array.from(brands).sort();
};

export const selectActiveFiltersCount = (state) => {
  const filters = selectProductFilters(state);
  let count = 0;
  if (filters.category) count++;
  if (filters.subCategory) count++;
  if (filters.minPrice) count++;
  if (filters.maxPrice) count++;
  if (filters.inStock) count++;
  if (filters.search) count++;
  if (filters.brand) count++;
  if (filters.rating) count++;
  if (filters.sortBy !== DEFAULT_SORT) count++;
  return count;
};

// ================= EXPORT CONSTANTS =================
export { SORT_OPTIONS, SORT_LABELS, DEFAULT_LIMIT, DEFAULT_SORT };

// ================= DEFAULT EXPORT =================
export default productSlice.reducer;