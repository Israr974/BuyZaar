import { createSlice } from "@reduxjs/toolkit";

// ================= CONSTANTS =================
const STORAGE_KEY = "order_stats";
const ORDER_STATUSES = {
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
};

const ORDER_STATUS_LIST = Object.values(ORDER_STATUSES);

// ================= HELPER FUNCTIONS =================
const getOrderStatus = (order) => {
  return order?.status || order?.orderStatus || ORDER_STATUSES.PENDING;
};

const getOrderTotal = (order) => {
  return order?.priceBreakdown?.total || order?.totalAmount || order?.total || 0;
};

const calculateOrderStats = (orders) => {
  const stats = {
    total: orders.length,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalSpent: 0,
  };

  orders.forEach((order) => {
    const status = getOrderStatus(order);
    const total = getOrderTotal(order);

    switch (status) {
      case ORDER_STATUSES.PENDING:
        stats.pending++;
        break;
      case ORDER_STATUSES.PROCESSING:
        stats.processing++;
        break;
      case ORDER_STATUSES.SHIPPED:
        stats.shipped++;
        break;
      case ORDER_STATUSES.DELIVERED:
        stats.delivered++;
        stats.totalSpent += total;
        break;
      case ORDER_STATUSES.CANCELLED:
        stats.cancelled++;
        break;
      default:
        break;
    }
  });

  return stats;
};

const saveStatsToLocalStorage = (stats) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  }
};

const loadStatsFromLocalStorage = () => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse order stats from localStorage", e);
      }
    }
  }
  return null;
};

// ================= INITIAL STATE =================
const getInitialState = () => {
  const savedStats = loadStatsFromLocalStorage();

  return {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
    totalOrders: 0,
    totalSpent: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippedOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    stats: savedStats || {
      total: 0,
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      totalSpent: 0,
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      limit: 10,
      hasNext: false,
      hasPrev: false,
    },
    filters: {
      status: "all",
      startDate: null,
      endDate: null,
      search: "",
    },
  };
};

const initialState = getInitialState();

// ================= SLICE =================
const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // ================= SET ORDERS =================
    setOrders: (state, action) => {
      const { orders = [], pagination = null } = action.payload;
      
      state.orders = orders;
      
      // Calculate stats from orders
      const stats = calculateOrderStats(orders);
      
      state.totalOrders = stats.total;
      state.pendingOrders = stats.pending;
      state.processingOrders = stats.processing;
      state.shippedOrders = stats.shipped;
      state.deliveredOrders = stats.delivered;
      state.cancelledOrders = stats.cancelled;
      state.totalSpent = stats.totalSpent;
      state.stats = stats;
      
      // Update pagination if provided
      if (pagination) {
        state.pagination = {
          ...state.pagination,
          ...pagination,
          hasNext: pagination.currentPage < pagination.totalPages,
          hasPrev: pagination.currentPage > 1,
        };
      }
      
      // Save stats to localStorage
      saveStatsToLocalStorage(stats);
    },
    
    // ================= ADD ORDER =================
    addOrder: (state, action) => {
      const order = action.payload;
      state.orders.unshift(order);
      
      // Update stats
      const status = getOrderStatus(order);
      const total = getOrderTotal(order);
      
      state.totalOrders++;
      
      switch (status) {
        case ORDER_STATUSES.PENDING:
          state.pendingOrders++;
          state.stats.pending++;
          break;
        case ORDER_STATUSES.PROCESSING:
          state.processingOrders++;
          state.stats.processing++;
          break;
        case ORDER_STATUSES.SHIPPED:
          state.shippedOrders++;
          state.stats.shipped++;
          break;
        case ORDER_STATUSES.DELIVERED:
          state.deliveredOrders++;
          state.totalSpent += total;
          state.stats.delivered++;
          state.stats.totalSpent += total;
          break;
        case ORDER_STATUSES.CANCELLED:
          state.cancelledOrders++;
          state.stats.cancelled++;
          break;
        default:
          break;
      }
      
      state.stats.total = state.totalOrders;
      saveStatsToLocalStorage(state.stats);
    },
    
    // ================= UPDATE ORDER =================
    updateOrder: (state, action) => {
      const { orderId, updates } = action.payload;
      const index = state.orders.findIndex((order) => order._id === orderId);
      
      if (index !== -1) {
        const oldStatus = getOrderStatus(state.orders[index]);
        const oldTotal = getOrderTotal(state.orders[index]);
        const newStatus = updates.status || updates.orderStatus || oldStatus;
        const newTotal = updates.totalAmount || updates.total || oldTotal;
        
        // Update the order
        state.orders[index] = { ...state.orders[index], ...updates };
        
        // Update stats if status changed
        if (oldStatus !== newStatus) {
          // Remove old status
          switch (oldStatus) {
            case ORDER_STATUSES.PENDING:
              state.pendingOrders--;
              state.stats.pending--;
              break;
            case ORDER_STATUSES.PROCESSING:
              state.processingOrders--;
              state.stats.processing--;
              break;
            case ORDER_STATUSES.SHIPPED:
              state.shippedOrders--;
              state.stats.shipped--;
              break;
            case ORDER_STATUSES.DELIVERED:
              state.deliveredOrders--;
              state.totalSpent -= oldTotal;
              state.stats.delivered--;
              state.stats.totalSpent -= oldTotal;
              break;
            case ORDER_STATUSES.CANCELLED:
              state.cancelledOrders--;
              state.stats.cancelled--;
              break;
            default:
              break;
          }
          
          // Add new status
          switch (newStatus) {
            case ORDER_STATUSES.PENDING:
              state.pendingOrders++;
              state.stats.pending++;
              break;
            case ORDER_STATUSES.PROCESSING:
              state.processingOrders++;
              state.stats.processing++;
              break;
            case ORDER_STATUSES.SHIPPED:
              state.shippedOrders++;
              state.stats.shipped++;
              break;
            case ORDER_STATUSES.DELIVERED:
              state.deliveredOrders++;
              state.totalSpent += newTotal;
              state.stats.delivered++;
              state.stats.totalSpent += newTotal;
              break;
            case ORDER_STATUSES.CANCELLED:
              state.cancelledOrders++;
              state.stats.cancelled++;
              break;
            default:
              break;
          }
          
          state.stats.total = state.totalOrders;
          saveStatsToLocalStorage(state.stats);
        }
      }
    },
    
    // ================= BULK UPDATE ORDERS =================
    bulkUpdateOrders: (state, action) => {
      const { orderIds, updates } = action.payload;
      
      orderIds.forEach((orderId) => {
        const index = state.orders.findIndex((order) => order._id === orderId);
        if (index !== -1) {
          state.orders[index] = { ...state.orders[index], ...updates };
        }
      });
      
      // Recalculate all stats
      const stats = calculateOrderStats(state.orders);
      state.totalOrders = stats.total;
      state.pendingOrders = stats.pending;
      state.processingOrders = stats.processing;
      state.shippedOrders = stats.shipped;
      state.deliveredOrders = stats.delivered;
      state.cancelledOrders = stats.cancelled;
      state.totalSpent = stats.totalSpent;
      state.stats = stats;
      
      saveStatsToLocalStorage(stats);
    },
    
    // ================= SET CURRENT ORDER =================
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    
    // ================= CLEAR CURRENT ORDER =================
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // ================= REMOVE ORDER =================
    removeOrder: (state, action) => {
      const orderId = action.payload;
      const orderIndex = state.orders.findIndex((order) => order._id === orderId);
      
      if (orderIndex !== -1) {
        const order = state.orders[orderIndex];
        const status = getOrderStatus(order);
        const total = getOrderTotal(order);
        
        // Update counts
        state.totalOrders--;
        
        switch (status) {
          case ORDER_STATUSES.PENDING:
            state.pendingOrders--;
            state.stats.pending--;
            break;
          case ORDER_STATUSES.PROCESSING:
            state.processingOrders--;
            state.stats.processing--;
            break;
          case ORDER_STATUSES.SHIPPED:
            state.shippedOrders--;
            state.stats.shipped--;
            break;
          case ORDER_STATUSES.DELIVERED:
            state.deliveredOrders--;
            state.totalSpent -= total;
            state.stats.delivered--;
            state.stats.totalSpent -= total;
            break;
          case ORDER_STATUSES.CANCELLED:
            state.cancelledOrders--;
            state.stats.cancelled--;
            break;
          default:
            break;
        }
        
        // Remove order
        state.orders = state.orders.filter((order) => order._id !== orderId);
        
        state.stats.total = state.totalOrders;
        saveStatsToLocalStorage(state.stats);
      }
    },
    
    // ================= FILTER ORDERS =================
    setOrderFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },
    
    clearOrderFilters: (state) => {
      state.filters = {
        status: "all",
        startDate: null,
        endDate: null,
        search: "",
      };
    },
    
    // ================= PAGINATION =================
    setPagination: (state, action) => {
      state.pagination = {
        ...state.pagination,
        ...action.payload,
        hasNext: action.payload.currentPage < action.payload.totalPages,
        hasPrev: action.payload.currentPage > 1,
      };
    },
    
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    
    // ================= UI STATES =================
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    resetError: (state) => {
      state.error = null;
    },
    
    // ================= CLEAR ORDERS =================
    clearOrders: (state) => {
      state.orders = [];
      state.currentOrder = null;
      state.totalOrders = 0;
      state.totalSpent = 0;
      state.pendingOrders = 0;
      state.processingOrders = 0;
      state.shippedOrders = 0;
      state.deliveredOrders = 0;
      state.cancelledOrders = 0;
      state.stats = {
        total: 0,
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
        totalSpent: 0,
      };
      state.error = null;
      localStorage.removeItem(STORAGE_KEY);
    },
    
    // ================= SYNC WITH BACKEND =================
    syncOrders: (state, action) => {
      const { orders, stats, pagination } = action.payload;
      
      if (orders) {
        state.orders = orders;
      }
      
      if (stats) {
        state.stats = stats;
        state.totalOrders = stats.total;
        state.pendingOrders = stats.pending;
        state.processingOrders = stats.processing;
        state.shippedOrders = stats.shipped;
        state.deliveredOrders = stats.delivered;
        state.cancelledOrders = stats.cancelled;
        state.totalSpent = stats.totalSpent;
        saveStatsToLocalStorage(stats);
      }
      
      if (pagination) {
        state.pagination = { ...state.pagination, ...pagination };
      }
    },
  },
});

// ================= EXPORT ACTIONS =================
export const {
  setOrders,
  addOrder,
  updateOrder,
  bulkUpdateOrders,
  setCurrentOrder,
  clearCurrentOrder,
  removeOrder,
  setOrderFilter,
  clearOrderFilters,
  setPagination,
  setCurrentPage,
  setLoading,
  setError,
  resetError,
  clearOrders,
  syncOrders,
} = orderSlice.actions;

// ================= SELECTORS =================
export const selectAllOrders = (state) => state.orders?.orders || [];
export const selectCurrentOrder = (state) => state.orders?.currentOrder || null;
export const selectOrderStats = (state) => state.orders?.stats || {};
export const selectOrderLoading = (state) => state.orders?.loading || false;
export const selectOrderError = (state) => state.orders?.error || null;
export const selectPagination = (state) => state.orders?.pagination || {};
export const selectFilters = (state) => state.orders?.filters || {};

// ================= FILTERED SELECTORS =================
export const selectFilteredOrders = (state) => {
  const orders = selectAllOrders(state);
  const filters = selectFilters(state);
  const { status, startDate, endDate, search } = filters;
  
  let filtered = [...orders];
  
  // Filter by status
  if (status && status !== "all") {
    filtered = filtered.filter(
      (order) => getOrderStatus(order) === status
    );
  }
  
  // Filter by date range
  if (startDate) {
    filtered = filtered.filter(
      (order) => new Date(order.createdAt) >= new Date(startDate)
    );
  }
  
  if (endDate) {
    filtered = filtered.filter(
      (order) => new Date(order.createdAt) <= new Date(endDate)
    );
  }
  
  // Filter by search (order ID or customer name)
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(
      (order) =>
        order.orderNumber?.toLowerCase().includes(searchLower) ||
        order._id?.toLowerCase().includes(searchLower) ||
        order.user?.name?.toLowerCase().includes(searchLower) ||
        order.customer?.name?.toLowerCase().includes(searchLower)
    );
  }
  
  return filtered;
};

// ================= STATS SELECTORS =================
export const selectOrdersByStatus = (status) => (state) => {
  const orders = selectAllOrders(state);
  return orders.filter((order) => getOrderStatus(order) === status);
};

export const selectDeliveredOrders = (state) => 
  selectOrdersByStatus(ORDER_STATUSES.DELIVERED)(state);

export const selectPendingOrders = (state) => 
  selectOrdersByStatus(ORDER_STATUSES.PENDING)(state);

export const selectProcessingOrders = (state) => 
  selectOrdersByStatus(ORDER_STATUSES.PROCESSING)(state);

export const selectShippedOrders = (state) => 
  selectOrdersByStatus(ORDER_STATUSES.SHIPPED)(state);

export const selectCancelledOrders = (state) => 
  selectOrdersByStatus(ORDER_STATUSES.CANCELLED)(state);

// ================= ORDER SPECIFIC SELECTORS =================
export const selectOrderById = (orderId) => (state) => {
  const orders = selectAllOrders(state);
  return orders.find((order) => order._id === orderId) || null;
};

export const selectRecentOrders = (limit = 5) => (state) => {
  const orders = selectAllOrders(state);
  return [...orders].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  ).slice(0, limit);
};

export const selectOrdersSummary = (state) => ({
  total: state.orders?.totalOrders || 0,
  pending: state.orders?.pendingOrders || 0,
  processing: state.orders?.processingOrders || 0,
  shipped: state.orders?.shippedOrders || 0,
  delivered: state.orders?.deliveredOrders || 0,
  cancelled: state.orders?.cancelledOrders || 0,
  totalSpent: state.orders?.totalSpent || 0,
});

export const selectHasOrders = (state) => (state.orders?.totalOrders || 0) > 0;
export const selectOrderCount = (state) => state.orders?.totalOrders || 0;

// ================= HELPER SELECTORS =================
export const selectOrderStatusCounts = (state) => ({
  pending: state.orders?.pendingOrders || 0,
  processing: state.orders?.processingOrders || 0,
  shipped: state.orders?.shippedOrders || 0,
  delivered: state.orders?.deliveredOrders || 0,
  cancelled: state.orders?.cancelledOrders || 0,
});

// ================= EXPORT CONSTANTS =================
export { ORDER_STATUSES, ORDER_STATUS_LIST };

// ================= DEFAULT EXPORT =================
export default orderSlice.reducer;