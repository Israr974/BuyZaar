

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  name: "",
  email: "",
  mobile: "",
  role: "",
  status: "",
  address_details: [],
  orderHistory: [],
  shopping_cart: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      const user = action.payload;
      if (user) {
        Object.assign(state, user);
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch {}
      } else {
        Object.assign(state, initialState);
        try {
          localStorage.removeItem("user");
        } catch {}
      }
    },
    logout(state) {
      Object.assign(state, initialState);
      try {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      } catch {}
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
