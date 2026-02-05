import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "light",   
  modal: null,     
  loading: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    openModal: (state, action) => {
      state.modal = action.payload; 
    },
    closeModal: (state) => {
      state.modal = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setTheme, openModal, closeModal, setLoading } = uiSlice.actions;
export default uiSlice.reducer;
