
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartitems: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.cartitems = [...action.payload]; 
    },
    clearCart: (state) => {
      state.cartitems = [];
    },
  },
});

export const { setCartItems, clearCart } = cartSlice.actions;

export default cartSlice.reducer;

