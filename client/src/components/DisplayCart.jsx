// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { IoClose, IoTrash, IoAdd, IoRemove } from "react-icons/io5";
// import { useNavigate } from "react-router-dom";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import { clearCart, setCartItems } from "../redux/cartSlice.js";
// import { TiShoppingCart } from "react-icons/ti";
// import { IoIosLock, IoIosStar } from "react-icons/io";
// import { TbZoomReplace, TbTruckDelivery } from "react-icons/tb";
// import { Shield, CreditCard, Truck, AlertCircle } from "lucide-react";
// import ConfirmBox from "./ConfirmBox";

// const DisplayCart = ({ close }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const user = useSelector((state) => state.user);
//   const cartitems = useSelector((state) => state.cart.cartitems);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isLoading, setIsLoading] = useState({});
//   const [showClearConfirm, setShowClearConfirm] = useState(false);

//   useEffect(() => {
//     if (!user?.id) {
//       close();
//     }
//   }, [user, close]);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.body.style.overflow = "unset";
//     };
//   }, []);

//   useEffect(() => {
//     if (user?.id) {
//       fetchCart();
//     }
//   }, [user?.id]);

//   const fetchCart = async () => {
//     try {
//       const response = await Axios(summaryApi().getCartProducts);
//       if (response.data.success) {
//         dispatch(setCartItems(response.data.data));
//       }
//     } catch (error) {
//       console.error("Failed to fetch cart:", error);
//     }
//   };

//   const handleCheckout = () => {
//     setIsProcessing(true);
//     close();
//     setTimeout(() => {
//       navigate("/checkout");
//       setIsProcessing(false);
//     }, 300);
//   };

//   const handleRemoveItem = async (productId) => {
//     try {
//       setIsLoading(prev => ({ ...prev, [productId]: true }));
      
//       const response = await Axios({
//         ...summaryApi().removeFromCart,
//         data: { productId }
//       });

//       if (response.data.success) {
//         toast.success("Item removed from cart");
//         const updatedCart = cartitems.filter(
//           (item) => item.productId?._id !== productId
//         );
//         dispatch(setCartItems(updatedCart));
//       } else {
//         toast.error(response.data.message || "Failed to remove item");
//       }
//     } catch (error) {
//       console.error("Remove item error:", error);
//       toast.error("Failed to remove item. Please try again.");
//     } finally {
//       setIsLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   const handleUpdateQuantity = async (productId, newQuantity) => {
//     if (newQuantity < 1) {
//       handleRemoveItem(productId);
//       return;
//     }

//     try {
//       setIsLoading(prev => ({ ...prev, [productId]: true }));
      
//       const response = await Axios({
//         ...summaryApi().updateCartQuantity,
//         data: { productId, quantity: newQuantity }
//       });

//       if (response.data.success) {
//         const updatedCart = cartitems.map((item) => {
//           if (item.productId?._id === productId) {
//             return { ...item, quantity: newQuantity };
//           }
//           return item;
//         });
//         dispatch(setCartItems(updatedCart));
//       } else {
//         toast.error(response.data.message || "Failed to update quantity");
//       }
//     } catch (error) {
//       console.error("Update quantity error:", error);
//       toast.error("Failed to update quantity. Please try again.");
//     } finally {
//       setIsLoading(prev => ({ ...prev, [productId]: false }));
//     }
//   };

//   const handleClearCart = async () => {
//     try {
//       setIsProcessing(true);
//       const response = await Axios(summaryApi().clearCart);
      
//       if (response.data.success) {
//         toast.success("Cart cleared successfully");
//         dispatch(clearCart());
//         setShowClearConfirm(false);
//       } else {
//         toast.error(response.data.message || "Failed to clear cart");
//       }
//     } catch (error) {
//       console.error("Clear cart error:", error);
//       toast.error("Failed to clear cart. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const totalProducts = cartitems?.reduce(
//     (sum, item) => sum + (item.quantity || 0),
//     0
//   );
  
//   const totalPrice = cartitems?.reduce(
//     (sum, item) => sum + (item.productId?.price || 0) * (item.quantity || 0),
//     0
//   );

//   const discount = cartitems?.reduce(
//     (sum, item) => {
//       const originalPrice = item.productId?.originalPrice || item.productId?.price;
//       const currentPrice = item.productId?.price || 0;
//       return sum + (originalPrice - currentPrice) * (item.quantity || 0);
//     },
//     0
//   );

//   const shippingCost = totalPrice > 999 ? 0 : 50;
//   const finalTotal = totalPrice + shippingCost;

//   const formatINR = (value) =>
//     (value || 0).toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 0,
//       maximumFractionDigits: 2,
//     });

//   return (
//     <>
//       <div className="fixed inset-0 z-50 flex justify-end fade-in" onClick={close}>
//         {/* Backdrop */}
//         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
        
//         {/* Cart Sidebar */}
//         <div
//           className="relative bg-card w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in-right"
//           onClick={(e) => e.stopPropagation()}
//         >
//           {/* Header */}
//           <div className="bg-gradient-primary p-5 text-white">
//             <div className="flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-display font-bold">Your Cart</h2>
//                 <p className="text-sm text-white/80 mt-1">
//                   {totalProducts} item{totalProducts !== 1 ? "s" : ""} • {formatINR(totalPrice)}
//                 </p>
//               </div>
//               <button
//                 onClick={close}
//                 className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
//                 aria-label="Close cart"
//               >
//                 <IoClose size={24} />
//               </button>
//             </div>
//           </div>

//           {/* Cart Items */}
//           <div className="flex-1 overflow-y-auto custom-scrollbar">
//             {cartitems?.length > 0 ? (
//               <div className="p-4 space-y-3">
//                 {cartitems.map((item, idx) => {
//                   const productId = item.productId?._id;
//                   const isItemLoading = isLoading[productId];
//                   const discountPercent = item.productId?.discount;
                  
//                   return (
//                     <div
//                       key={`${productId}-${idx}`}
//                       className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition-all duration-300 relative"
//                     >
//                       {isItemLoading && (
//                         <div className="absolute inset-0 bg-card/80 flex items-center justify-center rounded-xl z-10 backdrop-blur-sm">
//                           <div className="spinner w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
//                         </div>
//                       )}
                      
//                       <div className="flex gap-4">
//                         {/* Product Image */}
//                         <div className="relative flex-shrink-0">
//                           <img
//                             src={item.productId?.image?.[0] || "/placeholder.png"}
//                             alt={item.productId?.name}
//                             className="w-20 h-20 object-cover rounded-lg border border-border"
//                             onError={(e) => {
//                               e.target.src = "/placeholder.png";
//                             }}
//                           />
//                           {discountPercent > 0 && (
//                             <span className="absolute -top-2 -left-2 bg-accent text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
//                               -{discountPercent}%
//                             </span>
//                           )}
//                         </div>

//                         {/* Product Details */}
//                         <div className="flex-1 min-w-0">
//                           <div className="flex justify-between items-start gap-2">
//                             <div>
//                               <h3 className="font-semibold text-text text-sm line-clamp-2">
//                                 {item.productId?.name}
//                               </h3>
//                               {item.productId?.category && (
//                                 <p className="text-xs text-text-muted mt-1">
//                                   {typeof item.productId.category === 'object' 
//                                     ? item.productId.category.name 
//                                     : item.productId.category}
//                                 </p>
//                               )}
//                             </div>
//                             <button
//                               onClick={() => handleRemoveItem(productId)}
//                               disabled={isItemLoading}
//                               className="p-1 text-text-muted hover:text-error transition-colors disabled:opacity-50"
//                               aria-label="Remove item"
//                             >
//                               <IoTrash size={18} />
//                             </button>
//                           </div>

//                           {/* Price */}
//                           <div className="mt-2">
//                             <div className="flex items-center gap-2 flex-wrap">
//                               {item.productId?.originalPrice && item.productId?.originalPrice > item.productId?.price && (
//                                 <span className="text-xs text-text-muted line-through">
//                                   {formatINR(item.productId.originalPrice)}
//                                 </span>
//                               )}
//                               <span className="font-bold text-base gradient-text">
//                                 {formatINR(item.productId?.price)}
//                               </span>
//                             </div>
//                           </div>

//                           {/* Quantity Controls */}
//                           <div className="flex items-center justify-between mt-3">
//                             <div className="flex items-center gap-2">
//                               <button
//                                 onClick={() => handleUpdateQuantity(productId, (item.quantity || 0) - 1)}
//                                 disabled={(item.quantity || 0) <= 1 || isItemLoading}
//                                 className="w-7 h-7 rounded-md border border-border hover:bg-bg-alt hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
//                                 aria-label="Decrease quantity"
//                               >
//                                 <IoRemove size={14} />
//                               </button>
//                               <span className="w-8 text-center font-medium text-text">
//                                 {item.quantity || 0}
//                               </span>
//                               <button
//                                 onClick={() => handleUpdateQuantity(productId, (item.quantity || 0) + 1)}
//                                 disabled={(item.quantity || 0) >= 10 || isItemLoading}
//                                 className="w-7 h-7 rounded-md border border-border hover:bg-bg-alt hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
//                                 aria-label="Increase quantity"
//                               >
//                                 <IoAdd size={14} />
//                               </button>
//                             </div>
//                             <span className="font-semibold text-text">
//                               {formatINR((item.productId?.price || 0) * (item.quantity || 0))}
//                             </span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="h-full flex flex-col items-center justify-center p-8 text-center">
//                 <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-4">
//                   <TiShoppingCart size={48} className="text-primary/40" />
//                 </div>
//                 <h3 className="text-xl font-display font-semibold text-text mb-2">
//                   Your cart is empty
//                 </h3>
//                 <p className="text-text-muted text-sm mb-6">
//                   Looks like you haven't added anything yet
//                 </p>
//                 <button onClick={close} className="btn btn-primary px-6">
//                   Continue Shopping
//                 </button>
//               </div>
//             )}
//           </div>

//           {/* Footer - Order Summary */}
//           {cartitems?.length > 0 && (
//             <div className="border-t border-border bg-card p-5">
//               {/* Order Summary */}
//               <div className="space-y-2 mb-5">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Subtotal</span>
//                   <span className="text-text">{formatINR(totalPrice + discount)}</span>
//                 </div>
//                 {discount > 0 && (
//                   <div className="flex justify-between text-sm">
//                     <span className="text-text-muted">Discount</span>
//                     <span className="text-success">-{formatINR(discount)}</span>
//                   </div>
//                 )}
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Shipping</span>
//                   <span className={shippingCost === 0 ? "text-success" : "text-text"}>
//                     {shippingCost === 0 ? "FREE" : formatINR(shippingCost)}
//                   </span>
//                 </div>
//                 {shippingCost > 0 && totalPrice < 1000 && (
//                   <div className="flex items-center gap-1 text-xs text-warning bg-warning/10 p-2 rounded-lg">
//                     <AlertCircle size={12} />
//                     <span>Add ₹{formatINR(1000 - totalPrice)} more for FREE shipping</span>
//                   </div>
//                 )}
//                 <div className="border-t border-border my-2" />
//                 <div className="flex justify-between text-lg font-bold">
//                   <span className="text-text">Total</span>
//                   <span className="gradient-text">{formatINR(finalTotal)}</span>
//                 </div>
//                 <p className="text-xs text-text-muted text-center mt-1">
//                   Inclusive of all taxes
//                 </p>
//               </div>

//               {/* Action Buttons */}
//               <div className="space-y-2">
//                 <button
//                   onClick={handleCheckout}
//                   disabled={cartitems?.length === 0 || isProcessing}
//                   className="w-full btn btn-primary py-3 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   {isProcessing ? (
//                     <div className="flex items-center justify-center gap-2">
//                       <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Processing...
//                     </div>
//                   ) : (
//                     `Proceed to Checkout • ${formatINR(finalTotal)}`
//                   )}
//                 </button>

//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setShowClearConfirm(true)}
//                     disabled={cartitems?.length === 0 || isProcessing}
//                     className="flex-1 btn btn-outline py-2.5 rounded-lg text-sm hover:border-error hover:text-error transition-colors disabled:opacity-50"
//                   >
//                     Clear Cart
//                   </button>
//                   <button
//                     onClick={close}
//                     className="flex-1 btn btn-outline py-2.5 rounded-lg text-sm hover:border-primary hover:text-primary transition-colors"
//                   >
//                     Continue Shopping
//                   </button>
//                 </div>
//               </div>

//               {/* Trust Badges */}
//               <div className="mt-5 pt-4 border-t border-border">
//                 <div className="flex justify-center gap-5 text-center">
//                   <div className="flex flex-col items-center gap-1">
//                     <Shield size={18} className="text-text-muted" />
//                     <span className="text-xs text-text-muted">Secure</span>
//                   </div>
//                   <div className="flex flex-col items-center gap-1">
//                     <TbZoomReplace size={18} className="text-text-muted" />
//                     <span className="text-xs text-text-muted">Easy Returns</span>
//                   </div>
//                   <div className="flex flex-col items-center gap-1">
//                     <Truck size={18} className="text-text-muted" />
//                     <span className="text-xs text-text-muted">Fast Delivery</span>
//                   </div>
//                   <div className="flex flex-col items-center gap-1">
//                     <CreditCard size={18} className="text-text-muted" />
//                     <span className="text-xs text-text-muted">Secure Payment</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Clear Cart Confirmation Modal */}
//       {showClearConfirm && (
//         <ConfirmBox
//           title="Clear Cart"
//           message={`Are you sure you want to remove all ${cartitems.length} items from your cart? This action cannot be undone.`}
//           confirmText="Clear Cart"
//           cancelText="Cancel"
//           confirmColor="red"
//           close={() => setShowClearConfirm(false)}
//           cancel={() => setShowClearConfirm(false)}
//           confirm={handleClearCart}
//         />
//       )}
//     </>
//   );
// };

// export default DisplayCart;


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
import { TbZoomReplace, TbTruckDelivery } from "react-icons/tb";
import { Shield, CreditCard, Truck, AlertCircle } from "lucide-react";
import ConfirmBox from "./ConfirmBox";

const DisplayCart = ({ close }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const cartitems = useSelector((state) => state.cart.cartitems);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

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
      // Silent fail - no console log
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
      toast.error("Failed to update quantity. Please try again.");
    } finally {
      setIsLoading(prev => ({ ...prev, [productId]: false }));
    }
  };

  const handleClearCart = async () => {
    try {
      setIsProcessing(true);
      const response = await Axios(summaryApi().clearCart);
      
      if (response.data.success) {
        toast.success("Cart cleared successfully");
        dispatch(clearCart());
        setShowClearConfirm(false);
      } else {
        toast.error(response.data.message || "Failed to clear cart");
      }
    } catch (error) {
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

  const shippingCost = totalPrice > 999 ? 0 : 50;
  const finalTotal = totalPrice + shippingCost;

  const formatINR = (value) =>
    (value || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });

  return (
    <>
      <div className="fixed inset-0 z-50 flex justify-end" onClick={close}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
        
        <div
          className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Your Cart</h2>
                <p className="text-sm text-white/80 mt-1">
                  {totalProducts} item{totalProducts !== 1 ? "s" : ""} • {formatINR(totalPrice)}
                </p>
              </div>
              <button
                onClick={close}
                className="p-2 rounded-full hover:bg-white/20 transition-colors duration-200"
                aria-label="Close cart"
              >
                <IoClose size={24} />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {cartitems?.length > 0 ? (
              <div className="p-4 space-y-3">
                {cartitems.map((item, idx) => {
                  const productId = item.productId?._id;
                  const isItemLoading = isLoading[productId];
                  const discountPercent = item.productId?.discount;
                  
                  return (
                    <div
                      key={`${productId}-${idx}`}
                      className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all duration-300 relative"
                    >
                      {isItemLoading && (
                        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl z-10 backdrop-blur-sm">
                          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                      
                      <div className="flex gap-4">
                        <div className="relative flex-shrink-0">
                          <img
                            src={item.productId?.image?.[0] || "/placeholder.png"}
                            alt={item.productId?.name}
                            className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = "/placeholder.png";
                            }}
                          />
                          {discountPercent > 0 && (
                            <span className="absolute -top-2 -left-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                              -{discountPercent}%
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
                                {item.productId?.name}
                              </h3>
                              {item.productId?.category && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {typeof item.productId.category === 'object' 
                                    ? item.productId.category.name 
                                    : item.productId.category}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveItem(productId)}
                              disabled={isItemLoading}
                              className="p-1 text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
                              aria-label="Remove item"
                            >
                              <IoTrash size={18} />
                            </button>
                          </div>

                          <div className="mt-2">
                            <div className="flex items-center gap-2 flex-wrap">
                              {item.productId?.originalPrice && item.productId?.originalPrice > item.productId?.price && (
                                <span className="text-xs text-gray-400 line-through">
                                  {formatINR(item.productId.originalPrice)}
                                </span>
                              )}
                              <span className="font-bold text-base bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                                {formatINR(item.productId?.price)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleUpdateQuantity(productId, (item.quantity || 0) - 1)}
                                disabled={(item.quantity || 0) <= 1 || isItemLoading}
                                className="w-7 h-7 rounded-md border border-gray-200 hover:bg-gray-100 hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                aria-label="Decrease quantity"
                              >
                                <IoRemove size={14} />
                              </button>
                              <span className="w-8 text-center font-medium text-gray-800">
                                {item.quantity || 0}
                              </span>
                              <button
                                onClick={() => handleUpdateQuantity(productId, (item.quantity || 0) + 1)}
                                disabled={(item.quantity || 0) >= 10 || isItemLoading}
                                className="w-7 h-7 rounded-md border border-gray-200 hover:bg-gray-100 hover:border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                aria-label="Increase quantity"
                              >
                                <IoAdd size={14} />
                              </button>
                            </div>
                            <span className="font-semibold text-gray-800">
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
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center mb-4">
                  <TiShoppingCart size={48} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-500 text-sm mb-6">
                  Looks like you haven't added anything yet
                </p>
                <button onClick={close} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer - Order Summary */}
          {cartitems?.length > 0 && (
            <div className="border-t border-gray-200 bg-white p-5">
              <div className="space-y-2 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">{formatINR(totalPrice + discount)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Discount</span>
                    <span className="text-green-600">-{formatINR(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600" : "text-gray-800"}>
                    {shippingCost === 0 ? "FREE" : formatINR(shippingCost)}
                  </span>
                </div>
                {shippingCost > 0 && totalPrice < 1000 && (
                  <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 p-2 rounded-lg">
                    <AlertCircle size={12} />
                    <span>Add ₹{formatINR(1000 - totalPrice)} more for FREE shipping</span>
                  </div>
                )}
                <div className="border-t border-gray-200 my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-gray-800">Total</span>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{formatINR(finalTotal)}</span>
                </div>
                <p className="text-xs text-gray-400 text-center mt-1">
                  Inclusive of all taxes
                </p>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={cartitems?.length === 0 || isProcessing}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    `Proceed to Checkout • ${formatINR(finalTotal)}`
                  )}
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowClearConfirm(true)}
                    disabled={cartitems?.length === 0 || isProcessing}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:border-red-600 hover:text-red-600 transition-colors disabled:opacity-50"
                  >
                    Clear Cart
                  </button>
                  <button
                    onClick={close}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm hover:border-blue-600 hover:text-blue-600 transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-gray-200">
                <div className="flex justify-center gap-5 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <Shield size={18} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Secure</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <TbZoomReplace size={18} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Easy Returns</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <Truck size={18} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Fast Delivery</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <CreditCard size={18} className="text-gray-500" />
                    <span className="text-xs text-gray-500">Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {showClearConfirm && (
        <ConfirmBox
          title="Clear Cart"
          message={`Are you sure you want to remove all ${cartitems.length} items from your cart? This action cannot be undone.`}
          confirmText="Clear Cart"
          cancelText="Cancel"
          confirmColor="red"
          close={() => setShowClearConfirm(false)}
          cancel={() => setShowClearConfirm(false)}
          confirm={handleClearCart}
        />
      )}
    </>
  );
};

export default DisplayCart;