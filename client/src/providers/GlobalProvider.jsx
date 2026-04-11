import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { setAllCategory, setLoadingCategory, setSubCategory } from "../redux/productSlice";
import { setCartItems, clearCart } from "../redux/cartSlice";
import { setWishlist } from "../redux/wishlistSlice";

import fetchUserDetails from "../utils/fetchUserDetails";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import toast from "react-hot-toast";

const GlobalProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    categories: true,
    subCategories: true,
    cart: true,
    user: true,
    wishlist: true
  });

  const updateLoadingState = (key, value) => {
    setLoadingStates(prev => ({ ...prev, [key]: value }));
  };

  const fetchAllCategory = async () => {
    try {
      updateLoadingState('categories', true);
      dispatch(setLoadingCategory(true));
      const res = await Axios({ ...summaryApi().getAllCategory });
      const categories = res?.data?.data || [];
      dispatch(setAllCategory(categories));
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      AxiosError(error);
      toast.error("Failed to load categories");
    } finally {
      updateLoadingState('categories', false);
      dispatch(setLoadingCategory(false));
    }
  };

  const fetchAllSubCategory = async () => {
    try {
      updateLoadingState('subCategories', true);
      const res = await Axios({ ...summaryApi().getSubcategory });
      const subCategories = res?.data?.data || [];
      dispatch(setSubCategory(subCategories));
    } catch (error) {
      console.error("Failed to fetch subcategories:", error);
      AxiosError(error);
    } finally {
      updateLoadingState('subCategories', false);
    }
  };

  const fetchCart = async () => {
    try {
      updateLoadingState('cart', true);
      const res = await Axios({ ...summaryApi().getCartProducts });
      if (res.data?.success) {
        dispatch(setCartItems(res.data.data));
      } else {
        dispatch(clearCart());
      }
    } catch (err) {
      console.error("Error fetching cart", err);
      dispatch(clearCart());
    } finally {
      updateLoadingState('cart', false);
    }
  };

  const fetchWishlist = async () => {
    try {
      updateLoadingState('wishlist', true);
      const token = localStorage.getItem("token");
      if (!token) {
        dispatch(setWishlist([]));
        return;
      }
      
      const res = await Axios({
        ...summaryApi().getWishlist,
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data?.success) {
        dispatch(setWishlist(res.data.data || []));
      } else {
        dispatch(setWishlist([]));
      }
    } catch (err) {
      console.error("Error fetching wishlist", err);
      dispatch(setWishlist([]));
    } finally {
      updateLoadingState('wishlist', false);
    }
  };

  const fetchUser = async () => {
    try {
      updateLoadingState('user', true);
      const userData = await fetchUserDetails();

      if (userData && Object.keys(userData).length > 0) {
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
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt
          })
        );
      } else {
        dispatch(setUser(null));
      }
    } catch (err) {
      console.error("Error fetching user", err);
      dispatch(setUser(null));
    } finally {
      updateLoadingState('user', false);
    }
  };

  // Initialize all data
  useEffect(() => {
    const initializeApp = async () => {
      // Run all fetch operations in parallel for better performance
      await Promise.allSettled([
        fetchAllCategory(),
        fetchAllSubCategory(),
        fetchUser(),
        fetchCart(),
        fetchWishlist()
      ]);
      setIsInitialized(true);
    };

    initializeApp();
  }, []);

  // Refresh cart and wishlist when user changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && isInitialized) {
      fetchCart();
      fetchWishlist();
    } else if (!token && isInitialized) {
      dispatch(clearCart());
      dispatch(setWishlist([]));
    }
  }, [isInitialized]);

  // Show loading state if needed (optional)
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center z-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 mb-4"></div>
          <p className="text-text-muted">Loading your experience...</p>
          <div className="mt-4 flex gap-2 justify-center">
            <div className={`w-2 h-2 rounded-full bg-primary animate-bounce`} style={{ animationDelay: '0ms' }}></div>
            <div className={`w-2 h-2 rounded-full bg-primary animate-bounce`} style={{ animationDelay: '150ms' }}></div>
            <div className={`w-2 h-2 rounded-full bg-primary animate-bounce`} style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalProvider;