import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { setAllCategory, setLoadingCategory, setSubCategory } from "../redux/productSlice";
import { setCartItems, clearCart } from "../redux/cartSlice";

import fetchUserDetails from "../utils/fetchUserDetails";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();

 
  const fetchAllCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const res = await Axios({ ...summaryApi().getAllCategory });
      const categories = res?.data?.data || [];
      dispatch(setAllCategory(categories));
    } catch (error) {
      AxiosError(error);
    } finally {
      dispatch(setLoadingCategory(false));
    }
  };


  const fetchAllSubCategory = async () => {
    try {
      const res = await Axios({ ...summaryApi().getSubcategory });
      const subCategories = res?.data?.data || [];
      dispatch(setSubCategory(subCategories));
    } catch (error) {
      AxiosError(error);
    }
  };




  const fetchCart = async () => {
    try {
      const res = await Axios({ ...summaryApi().getCartProducts });
      if (res.data?.success) {
        dispatch(setCartItems(res.data.data));
      } else {
        dispatch(clearCart());
      }
    } catch (err) {
      console.error("Error fetching cart", err);
      dispatch(clearCart());
    }
  };


const fetchUser = async () => {
  try {
    const userData = await fetchUserDetails();

    if (userData) {
      dispatch(
        setUser({
          id: userData.id || userData._id || "",
          name: userData.name || "",
          email: userData.email || "",
          mobile: userData.mobile || "",
          role: userData.role || "user",
          status: userData.status || "active",
          address_details: userData.address_details || [],
          orderHistory: userData.orderHistory || [],
          shopping_cart: userData.shopping_cart || [],
        })
      );
    } else {
      // just clear Redux state, no refresh
      dispatch(setUser(null));
    }
  } catch (err) {
    console.error("Error fetching user", err);
    dispatch(setUser(null));
  }
};

  useEffect(() => {
    fetchCart();
    fetchAllCategory();
    fetchAllSubCategory();
    fetchUser();
  }, []);

  return <>{children}</>;
};

export default GlobalProvider;
