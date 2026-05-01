// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import { 
//   CreditCard, Lock, Calendar, User, Shield, 
//   CheckCircle, AlertCircle, ArrowRight, Sparkles,
//   Receipt, Package, MapPin, IndianRupee, Phone,
//   Eye, EyeOff, Fingerprint, Smartphone
// } from "lucide-react";

// const CardPayment = () => {
//   const [cardNumber, setCardNumber] = useState("");
//   const [expiry, setExpiry] = useState("");
//   const [cvv, setCvv] = useState("");
//   const [name, setName] = useState("");
//   const [showCvv, setShowCvv] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [activeCard, setActiveCard] = useState("credit");
//   const [saveCard, setSaveCard] = useState(false);
  
//   const navigate = useNavigate();
//   const { selectedAddress, cartitems, totalPrice, subTotal } = useLocation().state || {};

//   const formatCardNumber = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     const matches = v.match(/\d{4,16}/g);
//     const match = matches && matches[0] || '';
//     const parts = [];
//     for (let i = 0, len = match.length; i < len; i += 4) {
//       parts.push(match.substring(i, i + 4));
//     }
//     if (parts.length) {
//       return parts.join(' ');
//     } else {
//       return value;
//     }
//   };

//   const formatExpiry = (value) => {
//     const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
//     if (v.length >= 2) {
//       return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
//     }
//     return v;
//   };

//   const handleCardNumberChange = (e) => {
//     const formatted = formatCardNumber(e.target.value);
//     setCardNumber(formatted);
//   };

//   const handleExpiryChange = (e) => {
//     const formatted = formatExpiry(e.target.value);
//     setExpiry(formatted);
//   };

//   const handlePayment = async () => {
//     if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
//       toast.error("Please enter a valid 16-digit card number");
//       return;
//     }
//     if (!expiry || expiry.length < 5) {
//       toast.error("Please enter a valid expiry date (MM/YY)");
//       return;
//     }
//     if (!cvv || cvv.length < 3) {
//       toast.error("Please enter a valid CVV");
//       return;
//     }
//     if (!name.trim()) {
//       toast.error("Please enter card holder name");
//       return;
//     }

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
//         paymentMethod: "CARD",
//         discount: 0,
//         notes: `${activeCard} Card Payment`,
//         saveCardDetails: saveCard
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
//         toast.success("Payment successful! Order placed.", {
//           icon: <CheckCircle size={18} />,
//           duration: 4000,
//         });
        
//         localStorage.removeItem("cart");
//         await Axios(summaryApi().clearCart);
        
//         navigate("/payment/success", {
//           state: {
//             order: response.data.order,
//             paymentMethod: `${activeCard.charAt(0).toUpperCase() + activeCard.slice(1)} Card`,
//             amount: totalPrice,
//             orderNumber: response.data.order?.orderNumber,
//             message: "Card payment successful! Order confirmed."
//           }
//         });
//       } else {
//         toast.error(response.data.message || "Payment failed!");
//         navigate("/payment/fail");
//       }

//     } catch (error) {
//       console.error("Card payment error:", error);
      
//       if (error.response) {
//         const errorMessage = error.response.data?.message || "Payment failed";
        
//         if (error.response.status === 400) {
//           toast.error(errorMessage);
//         } else if (error.response.status === 401) {
//           toast.error("Session expired. Please login again.");
//           localStorage.removeItem("token");
//           navigate("/login");
//         } else {
//           toast.error(errorMessage);
//         }
//       } else {
//         toast.error("Network error. Please try again.");
//       }
      
//       navigate("/payment/fail");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const getCardType = (number) => {
//     const num = number.replace(/\s/g, '');
//     if (/^4/.test(num)) return { name: "Visa", color: "from-blue-600 to-blue-800" };
//     if (/^5[1-5]/.test(num)) return { name: "Mastercard", color: "from-red-600 to-orange-500" };
//     if (/^3[47]/.test(num)) return { name: "American Express", color: "from-blue-400 to-blue-600" };
//     if (/^6(?:011|5)/.test(num)) return { name: "Discover", color: "from-orange-600 to-orange-400" };
//     return { name: "Card", color: "from-gray-600 to-gray-800" };
//   };

//   const cardInfo = getCardType(cardNumber);

//   return (
//     <div className="min-h-screen bg-bg p-4 md:p-8 fade-in">
//       <div className="container-narrow">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
//             <CreditCard className="w-8 h-8 text-white" />
//           </div>
//           <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
//             Secure Payment
//           </h1>
//           <p className="text-text-muted">
//             Complete your purchase with secure card payment
//           </p>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column - Payment Form */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Card Type Selection */}
//             <div className="bg-card rounded-xl border border-border p-6">
//               <div className="flex items-center justify-between mb-6">
//                 <h2 className="text-xl font-semibold text-text flex items-center gap-2">
//                   <CreditCard className="w-5 h-5 text-primary" />
//                   Select Card Type
//                 </h2>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={() => setActiveCard("credit")}
//                     className={`px-4 py-2 rounded-lg transition-all ${
//                       activeCard === "credit" 
//                         ? 'bg-primary text-white shadow-md' 
//                         : 'bg-bg-alt text-text-muted hover:bg-primary/10'
//                     }`}
//                   >
//                     Credit Card
//                   </button>
//                   <button
//                     onClick={() => setActiveCard("debit")}
//                     className={`px-4 py-2 rounded-lg transition-all ${
//                       activeCard === "debit" 
//                         ? 'bg-primary text-white shadow-md' 
//                         : 'bg-bg-alt text-text-muted hover:bg-primary/10'
//                     }`}
//                   >
//                     Debit Card
//                   </button>
//                 </div>
//               </div>

//               {/* Card Preview */}
//               <div className="mb-6">
//                 <div className={`bg-gradient-to-r ${cardInfo.color} rounded-xl p-4 text-white shadow-lg`}>
//                   <div className="flex justify-between items-start mb-8">
//                     <CreditCard size={32} className="opacity-80" />
//                     <span className="text-sm font-mono">{activeCard === "credit" ? "CREDIT" : "DEBIT"}</span>
//                   </div>
//                   <div className="mb-4">
//                     <p className="text-lg font-mono tracking-wider">
//                       {cardNumber || "**** **** **** ****"}
//                     </p>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <div>
//                       <p className="text-xs opacity-75">Card Holder</p>
//                       <p className="font-medium">{name || "YOUR NAME"}</p>
//                     </div>
//                     <div>
//                       <p className="text-xs opacity-75">Expires</p>
//                       <p className="font-mono">{expiry || "MM/YY"}</p>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Card Details Form */}
//               <div className="space-y-5">
//                 <div>
//                   <label className="label flex items-center gap-2">
//                     <CreditCard size={16} className="text-primary" />
//                     Card Number
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="1234 5678 9012 3456"
//                       value={cardNumber}
//                       onChange={handleCardNumberChange}
//                       className="input pl-12 font-mono"
//                       maxLength={19}
//                     />
//                     <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
//                       <CreditCard className="w-5 h-5 text-text-muted" />
//                     </div>
//                     {cardNumber && (
//                       <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
//                         <span className="text-xs font-semibold text-primary">
//                           {cardInfo.name}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
//                   <div>
//                     <label className="label flex items-center gap-2">
//                       <Calendar size={16} className="text-primary" />
//                       Expiry Date
//                     </label>
//                     <div className="relative">
//                       <input
//                         type="text"
//                         placeholder="MM/YY"
//                         value={expiry}
//                         onChange={handleExpiryChange}
//                         className="input pl-12 font-mono"
//                         maxLength={5}
//                       />
//                       <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
//                     </div>
//                   </div>
//                   <div>
//                     <label className="label flex items-center gap-2">
//                       <Lock size={16} className="text-primary" />
//                       CVV
//                     </label>
//                     <div className="relative">
//                       <input
//                         type={showCvv ? "text" : "password"}
//                         placeholder="123"
//                         value={cvv}
//                         onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
//                         className="input pl-12 pr-12 font-mono"
//                         maxLength={3}
//                       />
//                       <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
//                       <button
//                         type="button"
//                         onClick={() => setShowCvv(!showCvv)}
//                         className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
//                       >
//                         {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
//                       </button>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <label className="label flex items-center gap-2">
//                     <User size={16} className="text-primary" />
//                     Card Holder Name
//                   </label>
//                   <div className="relative">
//                     <input
//                       type="text"
//                       placeholder="John Doe"
//                       value={name}
//                       onChange={(e) => setName(e.target.value.toUpperCase())}
//                       className="input pl-12"
//                     />
//                     <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
//                   </div>
//                 </div>

//                 {/* Save Card Option */}
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={saveCard}
//                     onChange={(e) => setSaveCard(e.target.checked)}
//                     className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
//                   />
//                   <span className="text-sm text-text-muted">Save card for future payments</span>
//                 </label>
//               </div>
//             </div>

//             {/* Security Info */}
//             <div className="bg-card rounded-xl border border-border p-5">
//               <div className="flex items-start gap-4">
//                 <div className="p-2 rounded-lg bg-success/10">
//                   <Shield className="w-6 h-6 text-success" />
//                 </div>
//                 <div>
//                   <h3 className="font-semibold text-text mb-2">Secure Payment</h3>
//                   <p className="text-sm text-text-muted">
//                     Your payment information is encrypted and secure. We never store your card details.
//                     This is a demo payment system for testing purposes only.
//                   </p>
//                   <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-muted">
//                     <span className="flex items-center gap-1">
//                       <CheckCircle size={12} className="text-success" />
//                       256-bit SSL
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <CheckCircle size={12} className="text-success" />
//                       PCI Compliant
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <CheckCircle size={12} className="text-success" />
//                       Fraud Protection
//                     </span>
//                     <span className="flex items-center gap-1">
//                       <Fingerprint size={12} className="text-success" />
//                       3D Secure
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="space-y-6">
//             {/* Order Summary */}
//             <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
//               <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
//                 <Receipt className="w-5 h-5 text-primary" />
//                 Order Summary
//               </h2>
              
//               <div className="space-y-3 mb-6">
//                 <div className="flex justify-between items-center">
//                   <span className="text-text-muted">Subtotal</span>
//                   <span className="font-medium text-text">
//                     ₹{(subTotal || totalPrice).toLocaleString()}
//                   </span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-text-muted">Shipping</span>
//                   <span className="text-success font-medium">FREE</span>
//                 </div>
//                 <div className="flex justify-between items-center">
//                   <span className="text-text-muted">Tax</span>
//                   <span className="text-text">₹0</span>
//                 </div>
//                 <div className="border-t border-border pt-3 mt-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg font-semibold text-text">Total</span>
//                     <span className="text-2xl font-bold gradient-text">
//                       ₹{totalPrice?.toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Pay Button */}
//               <button
//                 onClick={handlePayment}
//                 disabled={loading}
//                 className="w-full btn btn-primary py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 group"
//               >
//                 {loading ? (
//                   <>
//                     <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     <Lock size={18} />
//                     Pay ₹{totalPrice?.toLocaleString()}
//                     <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </button>

//               <p className="text-center text-xs text-text-muted mt-4">
//                 By clicking Pay Now, you agree to our Terms & Conditions
//               </p>
//             </div>

//             {/* Delivery Address */}
//             {selectedAddress && (
//               <div className="bg-card rounded-xl border border-border p-5">
//                 <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
//                   <MapPin className="w-5 h-5 text-primary" />
//                   Delivery Address
//                 </h3>
//                 <div className="space-y-2">
//                   <p className="text-text font-medium">{selectedAddress.name}</p>
//                   <p className="text-sm text-text-muted">{selectedAddress.address_line}</p>
//                   <p className="text-sm text-text-muted">
//                     {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
//                   </p>
//                   <p className="text-sm text-text-muted">{selectedAddress.country}</p>
//                   <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
//                     <Phone size={14} className="text-text-muted" />
//                     <span className="text-sm text-text-muted">{selectedAddress.mobile}</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* Items Summary */}
//             {cartitems && cartitems.length > 0 && (
//               <div className="bg-card rounded-xl border border-border p-5">
//                 <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
//                   <Package className="w-5 h-5 text-primary" />
//                   Items ({cartitems.length})
//                 </h3>
//                 <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
//                   {cartitems.map((item, index) => (
//                     <div key={index} className="flex items-center gap-3">
//                       <div className="w-12 h-12 bg-bg-alt rounded-lg flex items-center justify-center flex-shrink-0">
//                         {item.productId?.image?.[0] ? (
//                           <img 
//                             src={item.productId.image[0]} 
//                             alt={item.productId?.name} 
//                             className="w-full h-full object-cover rounded-lg"
//                           />
//                         ) : (
//                           <Package className="w-6 h-6 text-text-muted" />
//                         )}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <p className="text-sm font-medium text-text truncate">
//                           {item.productId?.name || item.name}
//                         </p>
//                         <p className="text-xs text-text-muted">
//                           Qty: {item.quantity} × ₹{item.productId?.price || item.price}
//                         </p>
//                       </div>
//                       <span className="font-semibold text-text">
//                         ₹{(item.productId?.price || item.price) * item.quantity}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Accepted Cards */}
//             <div className="bg-card rounded-xl border border-border p-5">
//               <h3 className="font-semibold text-text mb-3">Accepted Cards</h3>
//               <div className="flex gap-2">
//                 <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
//                   <span className="text-sm font-medium">Visa</span>
//                 </div>
//                 <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
//                   <span className="text-sm font-medium">Mastercard</span>
//                 </div>
//                 <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
//                   <span className="text-sm font-medium">Amex</span>
//                 </div>
//                 <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
//                   <span className="text-sm font-medium">Discover</span>
//                 </div>
//                 <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
//                   <Smartphone size={16} className="text-text-muted" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Footer Note */}
//         <div className="mt-10 text-center">
//           <div className="flex items-center justify-center gap-2 mb-3">
//             <Sparkles className="w-4 h-4 text-accent" />
//             <span className="text-sm text-text-muted">100% Secure Payment</span>
//             <Sparkles className="w-4 h-4 text-accent" />
//           </div>
//           <p className="text-xs text-text-muted max-w-2xl mx-auto">
//             This is a demonstration payment system. No real money will be charged.
//             Card details are not stored and are used for testing purposes only.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CardPayment;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { 
  CreditCard, Lock, Calendar, User, Shield, 
  CheckCircle, AlertCircle, ArrowRight, Sparkles,
  Receipt, Package, MapPin, Phone,
  Eye, EyeOff, Fingerprint, Smartphone
} from "lucide-react";

const CardPayment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [showCvv, setShowCvv] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState("credit");
  const [saveCard, setSaveCard] = useState(false);
  
  const navigate = useNavigate();
  const { selectedAddress, cartitems, totalPrice, subTotal } = useLocation().state || {};

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const match = v.match(/\d{4,16}/g);
    const parts = (match && match[0] || '').split('');
    const result = [];
    for (let i = 0; i < parts.length; i += 4) {
      result.push(parts.slice(i, i + 4).join(''));
    }
    return result.join(' ');
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

  const handleExpiryChange = (e) => {
    setExpiry(formatExpiry(e.target.value));
  };

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return { name: "Visa", color: "from-blue-600 to-blue-800" };
    if (/^5[1-5]/.test(num)) return { name: "Mastercard", color: "from-red-600 to-orange-500" };
    if (/^3[47]/.test(num)) return { name: "American Express", color: "from-blue-400 to-blue-600" };
    if (/^6(?:011|5)/.test(num)) return { name: "Discover", color: "from-orange-600 to-orange-400" };
    return { name: "Card", color: "from-gray-600 to-gray-800" };
  };

  const validateForm = () => {
    if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
      toast.error("Please enter a valid 16-digit card number");
      return false;
    }
    if (!expiry || expiry.length < 5) {
      toast.error("Please enter a valid expiry date (MM/YY)");
      return false;
    }
    if (!cvv || cvv.length < 3) {
      toast.error("Please enter a valid CVV");
      return false;
    }
    if (!name.trim()) {
      toast.error("Please enter card holder name");
      return false;
    }
    if (!selectedAddress?._id) {
      toast.error("Please select a delivery address!");
      return false;
    }
    if (!cartitems?.length) {
      toast.error("Your cart is empty!");
      return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;

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
        paymentMethod: "CARD",
        discount: 0,
        notes: `${activeCard} Card Payment`,
        saveCardDetails: saveCard,
        priceBreakdown: {
          subTotal: subTotal || totalPrice,
          shippingFee: 0,
          tax: 0,
          discount: 0,
          total: totalPrice
        }
      };

      const response = await Axios({
        ...summaryApi().placeOrder,
        data: payload,
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.success) {
        toast.success("Payment successful! Order placed.");
        localStorage.removeItem("cart");
        await Axios(summaryApi().clearCart);
        
        navigate("/payment/success", {
          state: {
            order: response.data.order,
            paymentMethod: `${activeCard.charAt(0).toUpperCase() + activeCard.slice(1)} Card`,
            amount: totalPrice,
            orderNumber: response.data.order?.orderNumber,
            message: "Card payment successful! Order confirmed."
          }
        });
      } else {
        toast.error(response.data.message || "Payment failed!");
        navigate("/payment/fail");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Payment failed. Please try again.");
      }
      navigate("/payment/fail");
    } finally {
      setLoading(false);
    }
  };

  const cardInfo = getCardType(cardNumber);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">
            Secure Payment
          </h1>
          <p className="text-text-muted">
            Complete your purchase with secure card payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Type Selection */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-primary" />
                  Select Card Type
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCard("credit")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeCard === "credit" 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-bg-alt text-text-muted hover:bg-primary/10'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    onClick={() => setActiveCard("debit")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeCard === "debit" 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-bg-alt text-text-muted hover:bg-primary/10'
                    }`}
                  >
                    Debit Card
                  </button>
                </div>
              </div>

              {/* Card Preview */}
              <div className="mb-6">
                <div className={`bg-gradient-to-r ${cardInfo.color} rounded-xl p-4 text-white shadow-lg`}>
                  <div className="flex justify-between items-start mb-8">
                    <CreditCard size={32} className="opacity-80" />
                    <span className="text-sm font-mono">{activeCard === "credit" ? "CREDIT" : "DEBIT"}</span>
                  </div>
                  <div className="mb-4">
                    <p className="text-lg font-mono tracking-wider">
                      {cardNumber || "**** **** **** ****"}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs opacity-75">Card Holder</p>
                      <p className="font-medium">{name || "YOUR NAME"}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-75">Expires</p>
                      <p className="font-mono">{expiry || "MM/YY"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Details Form */}
              <div className="space-y-5">
                <div>
                  <label className="label flex items-center gap-2">
                    <CreditCard size={16} className="text-primary" />
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="input pl-12 font-mono"
                      maxLength={19}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <CreditCard className="w-5 h-5 text-text-muted" />
                    </div>
                    {cardNumber && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs font-semibold text-primary">{cardInfo.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="label flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className="input pl-12 font-mono"
                        maxLength={5}
                      />
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                    </div>
                  </div>
                  <div>
                    <label className="label flex items-center gap-2">
                      <Lock size={16} className="text-primary" />
                      CVV
                    </label>
                    <div className="relative">
                      <input
                        type={showCvv ? "text" : "password"}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="input pl-12 pr-12 font-mono"
                        maxLength={3}
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
                      >
                        {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    Card Holder Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      className="input pl-12"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  />
                  <span className="text-sm text-text-muted">Save card for future payments</span>
                </label>
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-card rounded-xl border border-border p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-success/10">
                  <Shield className="w-6 h-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-2">Secure Payment</h3>
                  <p className="text-sm text-text-muted">
                    Your payment information is encrypted and secure. We never store your card details.
                    This is a demo payment system for testing purposes only.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-success" />
                      256-bit SSL
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-success" />
                      PCI Compliant
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-success" />
                      Fraud Protection
                    </span>
                    <span className="flex items-center gap-1">
                      <Fingerprint size={12} className="text-success" />
                      3D Secure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-card rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-primary" />
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium text-text">₹{(subTotal || totalPrice).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Shipping</span>
                  <span className="text-success font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Tax</span>
                  <span className="text-text">₹0</span>
                </div>
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-text">Total</span>
                    <span className="text-2xl font-bold gradient-text">
                      ₹{totalPrice?.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full btn btn-primary py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Pay ₹{totalPrice?.toLocaleString()}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-text-muted mt-4">
                By clicking Pay Now, you agree to our Terms & Conditions
              </p>
            </div>

            {/* Delivery Address */}
            {selectedAddress && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Delivery Address
                </h3>
                <div className="space-y-2">
                  <p className="text-text font-medium">{selectedAddress.name}</p>
                  <p className="text-sm text-text-muted">{selectedAddress.address_line}</p>
                  <p className="text-sm text-text-muted">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  <p className="text-sm text-text-muted">{selectedAddress.country}</p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border">
                    <Phone size={14} className="text-text-muted" />
                    <span className="text-sm text-text-muted">{selectedAddress.mobile}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Items Summary */}
            {cartitems?.length > 0 && (
              <div className="bg-card rounded-xl border border-border p-5">
                <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-primary" />
                  Items ({cartitems.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                  {cartitems.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-bg-alt rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.productId?.image?.[0] ? (
                          <img 
                            src={item.productId.image[0]} 
                            alt={item.productId?.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-text-muted" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text truncate">
                          {item.productId?.name || item.name}
                        </p>
                        <p className="text-xs text-text-muted">
                          Qty: {item.quantity} × ₹{item.productId?.price || item.price}
                        </p>
                      </div>
                      <span className="font-semibold text-text">
                        ₹{(item.productId?.price || item.price) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Accepted Cards */}
            <div className="bg-card rounded-xl border border-border p-5">
              <h3 className="font-semibold text-text mb-3">Accepted Cards</h3>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
                  <span className="text-sm font-medium">Visa</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
                  <span className="text-sm font-medium">Mastercard</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
                  <span className="text-sm font-medium">Amex</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
                  <span className="text-sm font-medium">Discover</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-bg-alt border border-border">
                  <Smartphone size={16} className="text-text-muted" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-sm text-text-muted">100% Secure Payment</span>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
          <p className="text-xs text-text-muted max-w-2xl mx-auto">
            This is a demonstration payment system. No real money will be charged.
            Card details are not stored and are used for testing purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;