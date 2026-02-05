import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { validateUrlConverter } from "../utils/validateUrl";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { setCartItems } from "../redux/cartSlice";
import { IoIosLock, IoIosStar } from "react-icons/io";
import { TiShoppingCart } from "react-icons/ti";



const CardProduct = ({ product }) => {
  const url = `/product/${validateUrlConverter(product.name)}-${product._id}`;
  const dispatch = useDispatch();
  const navigate = useNavigate();



  const cartitems = useSelector((state) => state.cart.cartitems);


  const cartItem = Array.isArray(cartitems)
    ? cartitems.find((item) => item.productId?._id === product._id)
    : null;

  const quantityInCart = cartItem?.quantity || 0;


  const user = useSelector((state) => state.user);


  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const hasUserId = !!(parsedUser.id || parsedUser._id || parsedUser.email);

        return hasUserId;
      } catch (error) {
        console.error("Error parsing localStorage user:", error);
        return false;
      }
    }

    const hasReduxUser = !!(user?.id || user?.email);

    return hasReduxUser;
  };

  const handleAddToCart = async (e) => {
    e.preventDefault();

    const isAuth = isAuthenticated();


    if (!isAuth) {
      toast.error("Please login to add items to cart!", {
        icon: <IoIosLock />,
        duration: 3000,
        style: {
          background: 'linear-gradient(to right, var(--color-primary), var(--color-primary-dark))',
          color: '#fff',
          borderRadius: '10px',
        },
      });
      navigate('/login', {
        state: {
          from: window.location.pathname,
          productId: product._id,
          productName: product.name,
          message: "Login required to add items to cart"
        }
      });
      return;
    }

    try {
      const res = await Axios({
        ...summaryApi().addToCart,
        data: {
          productId: product._id,
          quantity: 1,
          priceAtAddTime: product.price
        },
      });

      if (res.data.success) {
        toast.success("Added to cart!", {
          icon: <TiShoppingCart />,
          duration: 2000,
          style: {
            background: 'linear-gradient(to right, #10B981, #059669)',
            color: '#fff',
            borderRadius: '10px',
          },
        });


        const cartRes = await Axios({
          ...summaryApi().getCartProducts
        });

        if (cartRes.data.success) {
          dispatch(setCartItems(cartRes.data.data));
        }
      } else {
        toast.error(res.data.message || "Failed to add to cart");
      }
    } catch (error) {


      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.", {
          icon: "⚠️",
          duration: 4000,
          style: {
            background: 'linear-gradient(to right, #F59E0B, #D97706)',
            color: '#fff',
            borderRadius: '10px',
          },
        });


        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('refreshToken');


        navigate('/login', {
          state: {
            from: window.location.pathname,
            message: "Session expired. Please login again."
          }
        });
      } else if (error.response?.status === 403) {
        toast.error("Access denied. Please check your permissions.");
      } else {
        toast.error("Network error! Please check your connection.");
      }
    }
  };


  const authStatus = isAuthenticated();


  return (
    <div className="block border border-border rounded-xl p-4 bg-card shadow-sm hover:shadow-lg transition-all duration-300 h-full group hover:-translate-y-1">

      <Link
        to={url}
        className="block"
      >
        <div className="relative overflow-hidden rounded-lg mb-3">
          <img
            src={product.image?.[0] || "/placeholder.png"}
            alt={product.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300 rounded-lg"
          />
          {product.discount && (
            <div className="absolute top-2 left-2 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              -{product.discount}%
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg backdrop-blur-sm">
              <span className="text-white font-bold text-sm bg-red-500/90 px-3 py-1.5 rounded-full">
                Out of Stock
              </span>
            </div>
          )}
        </div>
        <h3 className="text-base font-semibold text-gray-800 truncate group-hover:text-primary transition-colors duration-200">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <p className="text-lg font-bold text-gray-900">₹{product.price}</p>
          {product.originalPrice && product.originalPrice > product.price && (
            <p className="text-sm text-gray-500 line-through">
              ₹{product.originalPrice}
            </p>
          )}
        </div>
        {product.rating && (
          <div className="flex items-center gap-1 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${i < Math.floor(product.rating) ? 'text-amber-500' : 'text-gray-300'}`}
                >
                  <IoIosStar />
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-600 ml-1 font-medium">
              {product.rating.toFixed(1)}
            </span>
            <span className="text-xs text-gray-400">
              ({product.reviewCount || 0})
            </span>
          </div>
        )}
      </Link>


      <div className="mt-4">
        {product.stock === 0 ? (
          <button
            disabled
            className="w-full h-10 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed text-sm font-medium border border-gray-200"
          >
            Out of Stock
          </button>
        ) : (
          <button
            onClick={handleAddToCart}
            className={`w-full h-10 rounded-lg text-white transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg ${authStatus
                ? quantityInCart > 0
                  ? "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                  : "bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary"
                : "bg-gradient-to-r from-gray-400 to-gray-500 hover:from-gray-500 hover:to-gray-600"
              }`}
            title={authStatus ? "" : "Please login to add to cart"}
          >

            {authStatus
              ? quantityInCart > 0
                ? <span className="inline-flex items-center gap-1">In Cart: {quantityInCart}</span>
                : <span className="inline-flex items-center gap-1"><TiShoppingCart size={20} /> Add to Cart</span>
              : <span className="inline-flex items-center gap-1"><IoIosLock size={20} /> Login to Add</span>}
          </button>
        )}


      </div>
    </div>
  );
};

export default CardProduct;