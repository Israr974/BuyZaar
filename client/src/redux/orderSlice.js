
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
  stats: {
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalSpent: 0
  }
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    // Set all orders
    setOrders: (state, action) => {
      state.orders = action.payload;
      
      // Update stats
      state.totalOrders = action.payload.length;
      
      // Calculate order status counts
      state.pendingOrders = action.payload.filter(o => 
        o.status === 'pending' || o.orderStatus === 'pending'
      ).length;
      state.processingOrders = action.payload.filter(o => 
        o.status === 'processing' || o.orderStatus === 'processing'
      ).length;
      state.shippedOrders = action.payload.filter(o => 
        o.status === 'shipped' || o.orderStatus === 'shipped'
      ).length;
      state.deliveredOrders = action.payload.filter(o => 
        o.status === 'delivered' || o.orderStatus === 'delivered'
      ).length;
      state.cancelledOrders = action.payload.filter(o => 
        o.status === 'cancelled' || o.orderStatus === 'cancelled'
      ).length;
      
      // Calculate total spent (only delivered orders)
      state.totalSpent = action.payload
        .filter(o => o.status === 'delivered' || o.orderStatus === 'delivered')
        .reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
      
      // Update stats object
      state.stats = {
        total: state.totalOrders,
        pending: state.pendingOrders,
        processing: state.processingOrders,
        shipped: state.shippedOrders,
        delivered: state.deliveredOrders,
        cancelled: state.cancelledOrders,
        totalSpent: state.totalSpent
      };
    },
    
    // Add a new order
    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      
      // Update stats
      state.totalOrders += 1;
      if (action.payload.status === 'pending' || action.payload.orderStatus === 'pending') {
        state.pendingOrders += 1;
        state.stats.pending += 1;
      }
      state.stats.total += 1;
    },
    
    // Update a single order
    updateOrder: (state, action) => {
      const { orderId, updates } = action.payload;
      const index = state.orders.findIndex(order => order._id === orderId);
      
      if (index !== -1) {
        const oldStatus = state.orders[index].status || state.orders[index].orderStatus;
        const newStatus = updates.status || updates.orderStatus;
        
        state.orders[index] = { ...state.orders[index], ...updates };
        
        // Update status counts if status changed
        if (oldStatus !== newStatus) {
          // Decrement old status count
          if (oldStatus === 'pending') state.pendingOrders--;
          if (oldStatus === 'processing') state.processingOrders--;
          if (oldStatus === 'shipped') state.shippedOrders--;
          if (oldStatus === 'delivered') {
            state.deliveredOrders--;
            state.totalSpent -= (state.orders[index].totalAmount || state.orders[index].total || 0);
          }
          if (oldStatus === 'cancelled') state.cancelledOrders--;
          
          // Increment new status count
          if (newStatus === 'pending') state.pendingOrders++;
          if (newStatus === 'processing') state.processingOrders++;
          if (newStatus === 'shipped') state.shippedOrders++;
          if (newStatus === 'delivered') {
            state.deliveredOrders++;
            state.totalSpent += (state.orders[index].totalAmount || state.orders[index].total || 0);
          }
          if (newStatus === 'cancelled') state.cancelledOrders++;
          
          // Update stats object
          state.stats = {
            total: state.totalOrders,
            pending: state.pendingOrders,
            processing: state.processingOrders,
            shipped: state.shippedOrders,
            delivered: state.deliveredOrders,
            cancelled: state.cancelledOrders,
            totalSpent: state.totalSpent
          };
        }
      }
    },
    
    // Set current order (for viewing details)
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
    
    // Clear current order
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    
    // Remove an order
    removeOrder: (state, action) => {
      const orderId = action.payload;
      const orderToRemove = state.orders.find(order => order._id === orderId);
      
      if (orderToRemove) {
        const status = orderToRemove.status || orderToRemove.orderStatus;
        
        // Update counts
        state.totalOrders--;
        if (status === 'pending') state.pendingOrders--;
        if (status === 'processing') state.processingOrders--;
        if (status === 'shipped') state.shippedOrders--;
        if (status === 'delivered') {
          state.deliveredOrders--;
          state.totalSpent -= (orderToRemove.totalAmount || orderToRemove.total || 0);
        }
        if (status === 'cancelled') state.cancelledOrders--;
        
        // Remove order
        state.orders = state.orders.filter(order => order._id !== orderId);
        
        // Update stats
        state.stats = {
          total: state.totalOrders,
          pending: state.pendingOrders,
          processing: state.processingOrders,
          shipped: state.shippedOrders,
          delivered: state.deliveredOrders,
          cancelled: state.cancelledOrders,
          totalSpent: state.totalSpent
        };
      }
    },
    
    // Set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    
    // Set error state
    setError: (state, action) => {
      state.error = action.payload;
    },
    
    // Clear all orders
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
        totalSpent: 0
      };
    },
    
    // Reset error
    resetError: (state) => {
      state.error = null;
    }
  },
});

export const { 
  setOrders, 
  addOrder, 
  updateOrder,
  setCurrentOrder,
  clearCurrentOrder,
  removeOrder,
  setLoading, 
  setError,
  clearOrders,
  resetError
} = orderSlice.actions;

export default orderSlice.reducer;