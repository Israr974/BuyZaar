
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import { 
  setAllCategory,
  setLoadingCategory,
  setSubCategory,
  setProducts,
  setFlashSaleProducts, 
  setFlashSaleLoading
} from "../redux/productSlice";
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

  const fetchAllCategory = useCallback(async () => {
    try {
      updateLoadingState('categories', true);
      dispatch(setLoadingCategory(true));
      const res = await Axios({ ...summaryApi().getAllCategory });
      const categories = res?.data?.data || [];
      dispatch(setAllCategory(categories));
    } catch (error) {
      AxiosError(error);
    } finally {
      updateLoadingState('categories', false);
      dispatch(setLoadingCategory(false));
    }
  }, [dispatch]);

  const fetchAllSubCategory = useCallback(async () => {
    try {
      updateLoadingState('subCategories', true);
      const res = await Axios({ ...summaryApi().getSubcategory });
      const subCategories = res?.data?.data || [];
      dispatch(setSubCategory(subCategories));
    } catch (error) {
     
      AxiosError(error);
    } finally {
      updateLoadingState('subCategories', false);
    }
  }, [dispatch]);

  
const fetchCart = useCallback(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    dispatch(clearCart());
    updateLoadingState('cart', false);
    return;
  }

  try {
    updateLoadingState('cart', true);
    const res = await Axios({ ...summaryApi().getCartProducts });
    if (res.data?.success) {
      dispatch(setCartItems(res.data.data));
    } else {
      dispatch(clearCart());
    }
  } catch (err) {
    dispatch(clearCart());
  } finally {
    updateLoadingState('cart', false);
  }
}, [dispatch]);


  const fetchWishlist = useCallback(async () => {
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
      AxiosError(err);
      dispatch(setWishlist([]));
    } finally {
      updateLoadingState('wishlist', false);
    }
  }, [dispatch]);

  const fetchUser = useCallback(async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    dispatch(setUser(null));
    updateLoadingState('user', false);
    return;
  }

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
    dispatch(setUser(null));
  } finally {
    updateLoadingState('user', false);
  }
}, [dispatch]);
 
  const fetchProductsAndFlashSale = useCallback(async () => {
    try {
      dispatch(setFlashSaleLoading(true));
      
      const res = await Axios({ ...summaryApi().getProduct,
        params: { limit: 100 }
       });
      
      if (res.data?.success) {
        const allProducts = res.data.data || [];
        dispatch(setProducts(allProducts));

        const flashProducts = allProducts.filter(product => {
          const discount = product.discount || 0;
          const stock = product.stock || 0;
          return discount >= 30 && stock > 0;
        });
        flashProducts.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      
        dispatch(setFlashSaleProducts(flashProducts.slice(0, 10)));
      } else {
        AxiosError(res.data);
      }
    } catch (error) {
      AxiosError(error);
    } finally {
      dispatch(setFlashSaleLoading(false));
    }
  }, [dispatch]);


  useEffect(() => {
    const initializeApp = async () => {
      await Promise.allSettled([
        fetchAllCategory(),
        fetchAllSubCategory(),
        fetchUser(),
        fetchCart(),
        fetchWishlist(),
        fetchProductsAndFlashSale(),
      ]);
      
      setIsInitialized(true);
    };

    initializeApp();
  }, [fetchAllCategory, fetchAllSubCategory, fetchUser, fetchCart, fetchWishlist, fetchProductsAndFlashSale]);

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token && isInitialized) {
  //     fetchCart();
  //     fetchWishlist();
  //   } else if (!token && isInitialized) {
  //     dispatch(clearCart());
  //     dispatch(setWishlist([]));
  //   }
  // }, [isInitialized, fetchCart, fetchWishlist, dispatch]);

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (token && isInitialized) {
    fetchCart();
    fetchWishlist();
    fetchUser();
  } else if (!token && isInitialized) {
    dispatch(clearCart());
    dispatch(setWishlist([]));
    dispatch(setUser(null)); 
  }
}, [isInitialized, fetchCart, fetchWishlist, fetchUser, dispatch]);
  if (!isInitialized) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your experience...</p>
          <div className="mt-4 flex gap-2 justify-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default GlobalProvider;