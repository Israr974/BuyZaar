
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    allCategory:[],
    loadingCategory:false,
    subCategory:[],
  products: [],
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setAllCategory: (state, action) => {
      state.allCategory = [...action.payload]; 
    },
    setLoadingCategory: (state, action) => {
      state.loadingCategory = action.payload; 
    },
    setSubCategory: (state, action) => {
      state.subCategory= [...action.payload]; 
    },
    
   
  },
});

export const { setAllCategory,setLoadingCategory,setSubCategory} =
  productSlice.actions;

export default productSlice.reducer;
