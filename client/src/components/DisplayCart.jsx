import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoClose, IoTrash, IoAdd, IoRemove } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { clearCart, setCartItems } from "../redux/cartSlice.js";
import { TiShoppingCart } from "react-icons/ti";
import { IoIosLock, IoIosStar } from "react-icons/io";
import { TbZoomReplace,TbTruckDelivery } from "react-icons/tb";


const DisplayCart = ({ close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart.cartitems);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState({});

  
  useEffect(() => {
    if (!user?.id) {
      close();
    }
  }, [user, close]);

  
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  
  useEffect(() => {
    if (user?.id) {
      fetchCart();
    }
  }, [user?.id]);

  const fetchCart = async () => {
    try {
      const response = await Axios(summaryApi().getCartProducts);
      if (response.data.success) {
        dispatch(setCartItems(response.data.data));
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const handleCheckout = () => {
    setIsProcessing(true);
    close();
    setTimeout(() => {
      navigate("/checkout");
      setIsProcessing(false);
    }, 300);
  };

  
  const handleRemoveItem = async (productId) => {
    try {
      setIsLoading(prev => ({ ...prev, [productId]: true }));
      
      const response = await Axios({
        ...summaryApi().removeFromCart,
        data: { productId }
      });

      if (response.data.success) {
        toast.success("Item removed from cart");
        
        
        const updatedCart = cartitems.filter(
          (item) => item.productId?._id !== productId
        );
        dispatch(setCartItems(updatedCart));
      } else {
        toast.error(response.data.message || "Failed to remove item");
      }
    } catch (error) {
      console.error("Remove item error:", error);
      toast.error("Failed to remove item. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  
  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) {
      
      handleRemoveItem(productId);
      return;
    }

    try {
      setIsLoading(prev => ({ ...prev, [productId]: true }));
      
      const response = await Axios({
        ...summaryApi().updateCartQuantity,
        data: { productId, quantity: newQuantity }
      });

      if (response.data.success) {
        
        const updatedCart = cartitems.map((item) => {
          if (item.productId?._id === productId) {
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        dispatch(setCartItems(updatedCart));
      } else {
        toast.error(response.data.message || "Failed to update quantity");
      }
    } catch (error) {
      console.error("Update quantity error:", error);
      toast.error("Failed to update quantity. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  
  const handleClearCart = async () => {
    if (!window.confirm("Are you sure you want to clear your cart?")) {
      return;
    }

    try {
      setIsProcessing(true);
      
      const response = await Axios(summaryApi().clearCart);
      
      if (response.data.success) {
        toast.success("Cart cleared successfully");
        dispatch(clearCart());
      } else {
        toast.error(response.data.message || "Failed to clear cart");
      }
    } catch (error) {
      console.error("Clear cart error:", error);
      toast.error("Failed to clear cart. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };


  const totalProducts = cartitems?.reduce(
    (sum, item) => sum + (item.quantity || 0),
    0
  );
  
  const totalPrice = cartitems?.reduce(
    (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );

  const discount = cartitems?.reduce(
    (sum, item) => {
      const originalPrice = item.productId?.originalPrice || item.productId?.price;
      const currentPrice = item.productId?.price || 0;
      return sum + (originalPrice - currentPrice) * (item.quantity || 0);
    },
    0
  );

  const formatINR = (value) =>
    (value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end fade-in"
      onClick={close}
    >
   
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300" />
      
      
      <div
        className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideIn 0.3s ease-out",
        }}
      >
     
        <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold font-display">
                Your Shopping Cart
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {totalProducts} item{totalProducts !== 1 ? "s" : ""} • {formatINR(totalPrice)}
              </p>
            </div>
            <button
              onClick={close}
              className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
              aria-label="Close cart"
            >
              <IoClose size={28} />
            </button>
          </div>
        </div>

        
        <div className="flex-1 overflow-y-auto">
          {cartitems?.length > 0 ? (
            <div className="p-4 space-y-4">
              {cartitems.map((item, idx) => {
                const productId = item.productId?._id;
                const isItemLoading = isLoading[productId];
                
                return (
                  <div
                    key={`${productId}-${idx}`}
                    className="card p-4 hover:shadow-md transition-all duration-300 relative"
                  >
                   
                    {isItemLoading && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-lg z-10">
                        <div className="spinner"></div>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-4">
                     
                     
                      <div className="relative">
                        <img
                          src={item.productId?.image?.[0] || "/placeholder.png"}
                          alt={item.productId?.name}
                          className="w-20 h-20 object-cover rounded-lg border border-border"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
                          }}
                        />
                        {item.productId?.discount && (
                          <span className="absolute -top-2 -left-2 badge badge-accent px-2 py-1 text-xs">
                            -{item.productId.discount}%
                          </span>
                        )}
                      </div>

                      
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold truncate">
                              {item.productId?.name}
                            </h3>
                            {item.productId?.category && (
                              <p className="text-xs text-text-muted mt-1">
                                {item.productId.category}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => handleRemoveItem(productId)}
                            disabled={isItemLoading}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                            aria-label="Remove item"
                          >
                            <IoTrash size={20} />
                          </button>
                        </div>

                        
                        
                        <div className="mt-2">
                          <div className="flex items-center gap-2">
                            {item.productId?.originalPrice && item.productId?.originalPrice > item.productId?.price && (
                              <span className="text-sm text-text-muted line-through">
                                {formatINR(item.productId.originalPrice)}
                              </span>
                            )}
                            <span className="font-bold text-lg text-primary">
                              {formatINR(item.productId?.price)}
                            </span>
                          </div>
                        </div>

                        
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  productId,
                                  (item.quantity || 0) - 1
                                )
                              }
                              disabled={(item.quantity || 0) <= 1 || isItemLoading}
                              className="p-1.5 rounded-md border border-border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <IoRemove size={16} />
                            </button>
                            <span className="w-10 text-center font-medium">
                              {item.quantity || 0}
                            </span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  productId,
                                  (item.quantity || 0) + 1
                                )
                              }
                              disabled={(item.quantity || 0) >= 10 || isItemLoading}
                              className="p-1.5 rounded-md border border-border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              aria-label="Increase quantity"
                            >
                              <IoAdd size={16} />
                            </button>
                          </div>
                          <span className="font-bold">
                            {formatINR((item.productId?.price || 0) * (item.quantity || 0))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
                <div className="text-4xl"><TiShoppingCart/></div>
              </div>
              <h3 className="text-xl font-bold text-text mb-2">
                Your cart is empty
              </h3>
              <p className="text-text-muted mb-6">
                Add some items to get started!
              </p>
              <button
                onClick={close}
                className="btn btn-primary px-8"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>

        
        {cartitems?.length > 0 && (
          <div className="border-t border-border bg-gradient-to-t from-white to-gray-50/50 p-6">
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Subtotal</span>
                <span>{formatINR(totalPrice + discount)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Discount</span>
                  <span className="text-green-600">-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Shipping</span>
                <span className={totalPrice > 999 ? "text-green-600" : ""}>
                  {totalPrice > 999 ? "FREE" : "₹50"}
                </span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <div>
                  <span>{formatINR(totalPrice + (totalPrice > 999 ? 0 : 50))}</span>
                  <p className="text-xs text-text-muted font-normal mt-1">
                    Inclusive of all taxes
                  </p>
                </div>
              </div>
            </div>

            
            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={cartitems?.length === 0 || isProcessing}
                className={`btn w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 ${
                  cartitems?.length === 0 || isProcessing
                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-xl hover:-translate-y-0.5"
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="spinner" />
                    Processing...
                  </div>
                ) : (
                  `Proceed to Checkout (${formatINR(totalPrice + (totalPrice > 999 ? 0 : 50))})`
                )}
              </button>

              <div className="flex gap-2">
                <button
                  onClick={handleClearCart}
                  disabled={cartitems?.length === 0 || isProcessing}
                  className="flex-1 btn btn-outline py-3 rounded-lg hover:border-red-300 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Cart
                </button>
                <button
                  onClick={close}
                  className="flex-1 btn btn-outline py-3 rounded-lg hover:border-primary hover:text-primary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-center gap-6 text-xs text-text-muted">
                <div className="text-center">
                  <div className="text-lg mb-1"><IoIosLock/></div>
                  <span>Secure Checkout</span>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1"><TbZoomReplace /></div>
                  <span>Easy Returns</span>
                </div>
                <div className="text-center">
                  <div className="text-lg mb-1"><TbTruckDelivery /></div>
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid var(--color-primary);
          border-radius: 50%;
          border-top-color: transparent;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default DisplayCart;