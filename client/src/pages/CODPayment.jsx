
// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Axios from "../utils/Axios"; 
// import summaryApi from "../common/summartApi"; 
// import toast from "react-hot-toast";
// import { 
//   Package, Truck, Wallet, CheckCircle, 
//   MapPin, User, Phone, IndianRupee,
//   Shield, Clock, Receipt, Sparkles,
//   AlertCircle, ChevronRight, CreditCard,
//   Home, Building, ArrowRight, Lock
// } from "lucide-react";

// const CODPayment = () => {
//   const [loading, setLoading] = useState(false);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { selectedAddress, cartitems, totalPrice, subTotal } = location.state || {};

//   const handleConfirm = async () => {
//     if (!selectedAddress || !selectedAddress._id) {
//       toast.error("Please select a delivery address!");
//       return;
//     }

//     if (!cartitems || cartitems.length === 0) {
//       toast.error("Your cart is empty!");
//       return;
//     }

//     setLoading(true);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         toast.error("You must login first!");
//         setLoading(false);
//         return;
//       }

//       const payload = {
//         items: cartitems.map(item => ({
//           product: item.productId?._id || item._id,
//           quantity: item.quantity
//         })),
//         shippingAddressId: selectedAddress._id, 
//         paymentMethod: "COD", 
//         discount: 0,
//         notes: "COD Order"
//       };

//       payload.priceBreakdown = {
//         subTotal: subTotal || totalPrice,
//         shippingFee: 0,
//         tax: 0,
//         discount: 0,
//         total: totalPrice
//       };

//       const response = await Axios({
//         ...summaryApi().placeOrder,
//         data: payload,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json"
//         }
//       });

//       if (response.data.success) {
//         toast.success("COD Order placed successfully!", {
//           icon: <CheckCircle size={18} />,
//           duration: 4000,
//         });
        
//         navigate("/payment/success", {
//           state: {
//             order: response.data.order,
//             paymentMethod: "Cash on Delivery",
//             amount: totalPrice,
//             orderNumber: response.data.order?.orderNumber,
//             message: "Your order has been placed successfully. Pay on delivery."
//           }
//         });

//         await Axios(summaryApi().clearCart);
//       } else {
//         toast.error(response.data.message || "Failed to place order");
//       }

//     } catch (error) {
//       console.error("COD Payment Error:", error);
      
//       if (error.response) {
//         const errorMessage = error.response.data?.message || "Failed to place order";
        
//         if (error.response.status === 400) {
//           if (error.response.data?.outOfStockProducts) {
//             toast.error("Some products are out of stock!");
//           } else if (error.response.data?.maxCODAmount) {
//             toast.error(`COD limit is ₹${error.response.data.maxCODAmount}. Please use online payment.`);
//           } else {
//             toast.error(errorMessage);
//           }
//         } else if (error.response.status === 401) {
//           toast.error("Session expired. Please login again.");
//           localStorage.removeItem("token");
//           navigate("/login");
//         } else {
//           toast.error(errorMessage);
//         }
//       } else if (error.request) {
//         toast.error("Network error. Please check your connection.");
//       } else {
//         toast.error("Something went wrong. Please try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getDeliveryEstimate = () => {
//     const today = new Date();
//     const deliveryDate = new Date(today);
//     deliveryDate.setDate(today.getDate() + 3);
//     return deliveryDate.toLocaleDateString('en-IN', { 
//       weekday: 'long', 
//       day: 'numeric', 
//       month: 'long' 
//     });
//   };

//   const getAddressIcon = (type) => {
//     if (type?.toLowerCase() === 'home') return <Home size={14} />;
//     if (type?.toLowerCase() === 'office') return <Building size={14} />;
//     return <MapPin size={14} />;
//   };

//   return (
//     <div className="min-h-screen bg-bg p-4 md:p-8 fade-in">
//       <div className="container-narrow">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-6 shadow-lg animate-float">
//             <Wallet className="w-10 h-10 text-white" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
//             Cash on Delivery
//           </h1>
//           <p className="text-text-muted max-w-2xl mx-auto">
//             Place your order now and pay in cash when it arrives at your doorstep
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Info */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* How it Works */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="p-3 rounded-xl bg-primary/10">
//                   <Wallet className="w-6 h-6 text-primary" />
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-display font-bold text-text">
//                     How Cash on Delivery Works
//                   </h2>
//                   <p className="text-sm text-text-muted">
//                     Simple, secure, and convenient payment at delivery
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div className="text-center p-4 rounded-xl bg-bg-alt border border-border">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
//                     <span className="text-lg font-bold text-primary">1</span>
//                   </div>
//                   <h3 className="font-semibold text-text mb-1">Place Order</h3>
//                   <p className="text-xs text-text-muted">No upfront payment</p>
//                 </div>

//                 <div className="text-center p-4 rounded-xl bg-bg-alt border border-border">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
//                     <span className="text-lg font-bold text-primary">2</span>
//                   </div>
//                   <h3 className="font-semibold text-text mb-1">We Ship</h3>
//                   <p className="text-xs text-text-muted">Dispatch within 24 hours</p>
//                 </div>

//                 <div className="text-center p-4 rounded-xl bg-bg-alt border border-border">
//                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
//                     <span className="text-lg font-bold text-primary">3</span>
//                   </div>
//                   <h3 className="font-semibold text-text mb-1">Pay & Receive</h3>
//                   <p className="text-xs text-text-muted">Cash on delivery</p>
//                 </div>
//               </div>
//             </div>

//             {/* Important Info */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <div className="flex items-start gap-4">
//                 <div className="p-2 rounded-lg bg-accent/10">
//                   <AlertCircle className="w-5 h-5 text-accent" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-text mb-3">Important Information</h3>
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     <div className="flex items-start gap-2">
//                       <CheckCircle size={14} className="text-success mt-0.5" />
//                       <span className="text-sm text-text-muted">Have exact change ready</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle size={14} className="text-success mt-0.5" />
//                       <span className="text-sm text-text-muted">Verify items before payment</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle size={14} className="text-success mt-0.5" />
//                       <span className="text-sm text-text-muted">Keep Order ID ready</span>
//                     </div>
//                     <div className="flex items-start gap-2">
//                       <CheckCircle size={14} className="text-success mt-0.5" />
//                       <span className="text-sm text-text-muted">Amount: ₹{totalPrice}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Delivery Timeline */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <div className="flex items-center justify-between flex-wrap gap-4">
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 rounded-lg bg-primary/10">
//                     <Truck className="w-5 h-5 text-primary" />
//                   </div>
//                   <div>
//                     <h3 className="font-semibold text-text">Delivery Timeline</h3>
//                     <p className="text-xs text-text-muted">Estimated arrival</p>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-lg font-bold gradient-text">
//                     {getDeliveryEstimate()}
//                   </div>
//                   <div className="text-xs text-text-muted flex items-center gap-1">
//                     <Clock size={12} />
//                     Usually 3-5 business days
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="space-y-6">
//             {/* Order Summary Card */}
//             <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
//               <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
//                 <Receipt className="w-5 h-5 text-primary" />
//                 <h2 className="text-lg font-semibold text-text">Order Summary</h2>
//               </div>
              
//               {/* Items */}
//               <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar mb-4">
//                 {cartitems?.slice(0, 3).map((item, idx) => (
//                   <div key={idx} className="flex gap-2">
//                     <div className="w-10 h-10 bg-bg-alt rounded-lg flex items-center justify-center flex-shrink-0">
//                       {item.productId?.image?.[0] ? (
//                         <img src={item.productId.image[0]} alt="" className="w-full h-full object-cover rounded-lg" />
//                       ) : (
//                         <Package size={16} className="text-text-muted" />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-xs font-medium text-text truncate">{item.productId?.name}</p>
//                       <p className="text-xs text-text-muted">Qty: {item.quantity}</p>
//                     </div>
//                     <span className="text-xs font-semibold text-text">
//                       ₹{item.productId?.price * item.quantity}
//                     </span>
//                   </div>
//                 ))}
//                 {cartitems?.length > 3 && (
//                   <p className="text-xs text-text-muted text-center">
//                     + {cartitems.length - 3} more items
//                   </p>
//                 )}
//               </div>

//               {/* Price Breakdown */}
//               <div className="space-y-2 pt-3 border-t border-border">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Subtotal</span>
//                   <span className="text-text">₹{totalPrice}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Shipping</span>
//                   <span className="text-success">FREE</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Tax</span>
//                   <span className="text-text">Included</span>
//                 </div>
//                 <div className="pt-2 border-t border-border mt-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-base font-semibold text-text">Total</span>
//                     <span className="text-xl font-bold gradient-text">₹{totalPrice}</span>
//                   </div>
//                   <p className="text-xs text-text-muted text-center mt-2">
//                     Payable upon delivery
//                   </p>
//                 </div>
//               </div>

//               {/* Confirm Button */}
//               <button
//                 onClick={handleConfirm}
//                 disabled={loading}
//                 className="w-full btn btn-primary py-3 rounded-xl mt-5 flex items-center justify-center gap-2 group disabled:opacity-50"
//               >
//                 {loading ? (
//                   <>
//                     <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <CheckCircle size={16} />
//                     Confirm COD Order
//                     <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </button>
//             </div>

//             {/* Delivery Address */}
//             {selectedAddress && (
//               <div className="bg-card rounded-xl border border-border p-5">
//                 <div className="flex items-center gap-2 mb-3">
//                   <MapPin className="w-4 h-4 text-primary" />
//                   <h3 className="font-semibold text-text">Delivery Address</h3>
//                 </div>
//                 <div className="p-3 rounded-lg bg-bg-alt">
//                   <div className="flex items-center gap-2 mb-2">
//                     <User size={14} className="text-text-muted" />
//                     <span className="font-medium text-text">{selectedAddress.name}</span>
//                     <span className="text-xs text-text-muted">•</span>
//                     <Phone size={12} className="text-text-muted" />
//                     <span className="text-sm text-text-muted">{selectedAddress.mobile}</span>
//                   </div>
//                   <p className="text-sm text-text">{selectedAddress.address_line}</p>
//                   <p className="text-xs text-text-muted mt-1">
//                     {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
//                   </p>
//                   <div className="flex items-center gap-1 mt-2 text-xs text-primary">
//                     {getAddressIcon(selectedAddress.address_type)}
//                     <span>{selectedAddress.address_type || 'Home'}</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* COD Benefits */}
//             <div className="bg-card rounded-xl border border-border p-5">
//               <div className="flex items-center gap-2 mb-3">
//                 <Shield className="w-4 h-4 text-primary" />
//                 <h3 className="font-semibold text-text">COD Benefits</h3>
//               </div>
//               <div className="space-y-2">
//                 <div className="flex items-center gap-2 text-sm text-text-muted">
//                   <CheckCircle size={12} className="text-success" />
//                   <span>No risk online payment</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-text-muted">
//                   <CheckCircle size={12} className="text-success" />
//                   <span>Pay only after inspection</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-text-muted">
//                   <CheckCircle size={12} className="text-success" />
//                   <span>Easy cash payment</span>
//                 </div>
//                 <div className="flex items-center gap-2 text-sm text-text-muted">
//                   <CheckCircle size={12} className="text-success" />
//                   <span>No card details required</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Note */}
//         <div className="mt-10 text-center">
//           <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm">
//             <Lock size={14} />
//             <span>100% Secure Cash on Delivery</span>
//           </div>
//           <p className="text-xs text-text-muted mt-4 max-w-2xl mx-auto">
//             Your order will be processed immediately. Our delivery executive will contact you 
//             before arrival. Please ensure someone is available at the delivery address to 
//             receive the order and make the payment of ₹{totalPrice}.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CODPayment;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios"; 
import summaryApi from "../common/summartApi"; 
import toast from "react-hot-toast";
import { 
  Package, Truck, Wallet, CheckCircle, 
  MapPin, User, Phone, IndianRupee,
  Shield, Clock, Receipt, Sparkles,
  AlertCircle, ChevronRight, CreditCard,
  Home, Building, ArrowRight, Lock
} from "lucide-react";

const CODPayment = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAddress, cartitems, totalPrice, subTotal } = location.state || {};

  const handleConfirm = async () => {
    if (!selectedAddress || !selectedAddress._id) {
      toast.error("Please select a delivery address!");
      return;
    }

    if (!cartitems || cartitems.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("You must login first!");
        setLoading(false);
        return;
      }

      const payload = {
        items: cartitems.map(item => ({
          product: item.productId?._id || item._id,
          quantity: item.quantity
        })),
        shippingAddressId: selectedAddress._id, 
        paymentMethod: "COD", 
        discount: 0,
        notes: "COD Order"
      };

      payload.priceBreakdown = {
        subTotal: subTotal || totalPrice,
        shippingFee: 0,
        tax: 0,
        discount: 0,
        total: totalPrice
      };

      const response = await Axios({
        ...summaryApi().placeOrder,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      if (response.data.success) {
        toast.success("COD Order placed successfully!", {
          icon: <CheckCircle size={18} />,
          duration: 4000,
        });
        
        navigate("/payment/success", {
          state: {
            order: response.data.order,
            paymentMethod: "Cash on Delivery",
            amount: totalPrice,
            orderNumber: response.data.order?.orderNumber,
            message: "Your order has been placed successfully. Pay on delivery."
          }
        });

        await Axios(summaryApi().clearCart);
      } else {
        toast.error(response.data.message || "Failed to place order");
      }

    } catch (error) {
      if (error.response) {
        const errorMessage = error.response.data?.message || "Failed to place order";
        
        if (error.response.status === 400) {
          if (error.response.data?.outOfStockProducts) {
            toast.error("Some products are out of stock!");
          } else if (error.response.data?.maxCODAmount) {
            toast.error(`COD limit is ₹${error.response.data.maxCODAmount}. Please use online payment.`);
          } else {
            toast.error(errorMessage);
          }
        } else if (error.response.status === 401) {
          toast.error("Session expired. Please login again.");
          localStorage.removeItem("token");
          navigate("/login");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDeliveryEstimate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  const getAddressIcon = (type) => {
    if (type?.toLowerCase() === 'home') return <Home size={14} />;
    if (type?.toLowerCase() === 'office') return <Building size={14} />;
    return <MapPin size={14} />;
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 mb-6 shadow-lg">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Cash on Delivery
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Place your order now and pay in cash when it arrives at your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* How it Works */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-xl bg-blue-100">
                  <Wallet className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    How Cash on Delivery Works
                  </h2>
                  <p className="text-sm text-gray-500">
                    Simple, secure, and convenient payment at delivery
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-blue-600">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">Place Order</h3>
                  <p className="text-xs text-gray-500">No upfront payment</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-blue-600">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">We Ship</h3>
                  <p className="text-xs text-gray-500">Dispatch within 24 hours</p>
                </div>

                <div className="text-center p-4 rounded-xl bg-gray-50 border border-gray-200">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-blue-600">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">Pay & Receive</h3>
                  <p className="text-xs text-gray-500">Cash on delivery</p>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-orange-100">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-3">Important Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-500">Have exact change ready</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-500">Verify items before payment</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-500">Keep Order ID ready</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-green-600 mt-0.5" />
                      <span className="text-sm text-gray-500">Amount: ₹{totalPrice}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Timeline */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    <Truck className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Delivery Timeline</h3>
                    <p className="text-xs text-gray-500">Estimated arrival</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    {getDeliveryEstimate()}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} />
                    Usually 3-5 business days
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary Card */}
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200">
                <Receipt className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Order Summary</h2>
              </div>
              
              {/* Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto mb-4">
                {cartitems?.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.productId?.image?.[0] ? (
                        <img src={item.productId.image[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Package size={16} className="text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-800 truncate">{item.productId?.name}</p>
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-semibold text-gray-800">
                      ₹{item.productId?.price * item.quantity}
                    </span>
                  </div>
                ))}
                {cartitems?.length > 3 && (
                  <p className="text-xs text-gray-500 text-center">
                    + {cartitems.length - 3} more items
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">₹{totalPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-800">Included</span>
                </div>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-semibold text-gray-800">Total</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">₹{totalPrice}</span>
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Payable upon delivery
                  </p>
                </div>
              </div>

              {/* Confirm Button */}
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl mt-5 flex items-center justify-center gap-2 group disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} />
                    Confirm COD Order
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Delivery Address */}
            {selectedAddress && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-800">Delivery Address</h3>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <User size={14} className="text-gray-500" />
                    <span className="font-medium text-gray-800">{selectedAddress.name}</span>
                    <span className="text-xs text-gray-500">•</span>
                    <Phone size={12} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{selectedAddress.mobile}</span>
                  </div>
                  <p className="text-sm text-gray-800">{selectedAddress.address_line}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  <div className="flex items-center gap-1 mt-2 text-xs text-blue-600">
                    {getAddressIcon(selectedAddress.address_type)}
                    <span>{selectedAddress.address_type || 'Home'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* COD Benefits */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <h3 className="font-semibold text-gray-800">COD Benefits</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle size={12} className="text-green-600" />
                  <span>No risk online payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle size={12} className="text-green-600" />
                  <span>Pay only after inspection</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle size={12} className="text-green-600" />
                  <span>Easy cash payment</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <CheckCircle size={12} className="text-green-600" />
                  <span>No card details required</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-600 text-sm">
            <Lock size={14} />
            <span>100% Secure Cash on Delivery</span>
          </div>
          <p className="text-xs text-gray-500 mt-4 max-w-2xl mx-auto">
            Your order will be processed immediately. Our delivery executive will contact you 
            before arrival. Please ensure someone is available at the delivery address to 
            receive the order and make the payment of ₹{totalPrice}.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CODPayment;