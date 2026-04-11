
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allCategory: [],
    loadingCategory: false,
    subCategory: [],
    products: [],
    currentProduct: null,
    featuredProducts: [],
    recentProducts: [],
    popularProducts: [],
    loading: false,
    error: null,
    filters: {
        category: null,
        subCategory: null,
        minPrice: null,
        maxPrice: null,
        sortBy: "newest",
        inStock: false
    },
    pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 1
    }
};

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        // Category reducers
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
            const index = state.allCategory.findIndex(cat => cat._id === action.payload._id);
            if (index !== -1) {
                state.allCategory[index] = action.payload;
            }
        },
        removeCategory: (state, action) => {
            state.allCategory = state.allCategory.filter(cat => cat._id !== action.payload);
        },
        
        // SubCategory reducers
        setSubCategory: (state, action) => {
            state.subCategory = [...action.payload];
        },
        addSubCategory: (state, action) => {
            state.subCategory.unshift(action.payload);
        },
        updateSubCategory: (state, action) => {
            const index = state.subCategory.findIndex(sub => sub._id === action.payload._id);
            if (index !== -1) {
                state.subCategory[index] = action.payload;
            }
        },
        removeSubCategory: (state, action) => {
            state.subCategory = state.subCategory.filter(sub => sub._id !== action.payload);
        },
        
        // Product reducers
        setProducts: (state, action) => {
            state.products = [...action.payload];
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload;
        },
        clearCurrentProduct: (state) => {
            state.currentProduct = null;
        },
        addProduct: (state, action) => {
            state.products.unshift(action.payload);
        },
        updateProduct: (state, action) => {
            const index = state.products.findIndex(prod => prod._id === action.payload._id);
            if (index !== -1) {
                state.products[index] = action.payload;
            }
            if (state.currentProduct?._id === action.payload._id) {
                state.currentProduct = action.payload;
            }
        },
        removeProduct: (state, action) => {
            state.products = state.products.filter(prod => prod._id !== action.payload);
            if (state.currentProduct?._id === action.payload) {
                state.currentProduct = null;
            }
        },
        
        // Featured products
        setFeaturedProducts: (state, action) => {
            state.featuredProducts = [...action.payload];
        },
        setRecentProducts: (state, action) => {
            state.recentProducts = [...action.payload];
        },
        setPopularProducts: (state, action) => {
            state.popularProducts = [...action.payload];
        },
        
        // Filters
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = initialState.filters;
        },
        setSortBy: (state, action) => {
            state.filters.sortBy = action.payload;
        },
        setPriceRange: (state, action) => {
            state.filters.minPrice = action.payload.min;
            state.filters.maxPrice = action.payload.max;
        },
        setCategoryFilter: (state, action) => {
            state.filters.category = action.payload;
        },
        setSubCategoryFilter: (state, action) => {
            state.filters.subCategory = action.payload;
        },
        toggleInStockFilter: (state) => {
            state.filters.inStock = !state.filters.inStock;
        },
        
        // Pagination
        setPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        setPage: (state, action) => {
            state.pagination.page = action.payload;
        },
        setLimit: (state, action) => {
            state.pagination.limit = action.payload;
            state.pagination.page = 1; // Reset to first page when changing limit
        },
        setTotalProducts: (state, action) => {
            state.pagination.total = action.payload;
            state.pagination.totalPages = Math.ceil(action.payload / state.pagination.limit);
        },
        resetPagination: (state) => {
            state.pagination = initialState.pagination;
        },
        
        // Loading and Error states
        setProductsLoading: (state, action) => {
            state.loading = action.payload;
        },
        setProductsError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        
        // Reset entire product state
        resetProductState: () => initialState,
    },
});

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
    
    // Filter actions
    setFilters,
    clearFilters,
    setSortBy,
    setPriceRange,
    setCategoryFilter,
    setSubCategoryFilter,
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
    
    // Reset state
    resetProductState,
} = productSlice.actions;

export default productSlice.reducer;