import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],     
  loading: false,
  error: null,
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
    },
    addOrder: (state, action) => {
      state.orders.unshift(action.payload); 
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const { setOrders, addOrder, setLoading, setError } = orderSlice.actions;
export default orderSlice.reducer;
