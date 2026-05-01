// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import DeliveryAddress from "./DeliveryAddress";
// import toast from "react-hot-toast";
// import { 
//   MapPin, Plus, Edit2, Trash2, CreditCard, 
//   Wallet, Truck, Shield, CheckCircle, Package,
//   IndianRupee, ArrowRight, Home, Building, Phone
// } from "lucide-react";

// const CheckOutPage = () => {
//   const [addresses, setAddresses] = useState([]);
//   const [selectedAddress, setSelectedAddress] = useState(null);
//   const [openAddress, setOpenAddress] = useState(false);
//   const [addressToEdit, setAddressToEdit] = useState(null);
//   const [paymentMethod, setPaymentMethod] = useState("cod");
//   const [isProcessing, setIsProcessing] = useState(false);

//   const cartitems = useSelector((state) => state.cart.cartitems);
//   const navigate = useNavigate();

//   const fetchAddresses = async () => {
//     try {
//       const res = await Axios({
//         ...summaryApi().getAddresses,
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         setAddresses(res.data.data || []);
//         if (res.data.data?.length > 0 && !selectedAddress) {
//           setSelectedAddress(res.data.data[0]);
//         }
//       }
//     } catch {
//       toast.error("Failed to load addresses");
//     }
//   };

//   useEffect(() => {
//     fetchAddresses();
//   }, []);

//   const handleDeleteAddress = async (id) => {
//     if (!window.confirm("Delete this address?")) return;

//     try {
//       const res = await Axios({
//         ...summaryApi().deleteAddress(id),
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         toast.success("Address deleted");
//         fetchAddresses();
//       }
//     } catch {
//       toast.error("Failed to delete address");
//     }
//   };

//   const totalPrice = cartitems.reduce(
//     (sum, item) =>
//       sum + (item.productId?.price || 0) * (item.quantity || 0),
//     0
//   );

//   const formatINR = (value) =>
//     value.toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//     });

//   const handlePlaceOrder = () => {
//     if (!selectedAddress) {
//       toast.error("Please select a delivery address");
//       return;
//     }

//     if (cartitems.length === 0) {
//       toast.error("Your cart is empty");
//       return;
//     }

//     setIsProcessing(true);
    
//     navigate(`/payment/${paymentMethod}`, {
//       state: { 
//         selectedAddress, 
//         cartitems, 
//         totalPrice,
//         subTotal: totalPrice
//       },
//     });
//   };

//   const getAddressIcon = (type) => {
//     if (type?.toLowerCase() === 'home') return <Home size={14} />;
//     if (type?.toLowerCase() === 'office') return <Building size={14} />;
//     return <MapPin size={14} />;
//   };

//   return (
//     <div className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 fade-in">
//       <div className="container-narrow">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//             <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
//               Checkout
//             </h1>
//           </div>
//           <p className="text-text-muted ml-4">
//             Complete your purchase by selecting address and payment method
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Left Column - Address & Payment */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Delivery Address Section */}
//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="p-5 border-b border-border bg-bg-alt">
//                 <div className="flex justify-between items-center">
//                   <div className="flex items-center gap-2">
//                     <MapPin className="w-5 h-5 text-primary" />
//                     <h2 className="text-lg font-semibold text-text">Delivery Address</h2>
//                   </div>
//                   <button
//                     className="btn btn-secondary text-sm py-2 px-4 rounded-lg flex items-center gap-2"
//                     onClick={() => {
//                       setAddressToEdit(null);
//                       setOpenAddress(true);
//                     }}
//                   >
//                     <Plus size={14} />
//                     Add New Address
//                   </button>
//                 </div>
//               </div>

//               <div className="p-5">
//                 {addresses.length === 0 ? (
//                   <div className="text-center py-8">
//                     <div className="w-16 h-16 mx-auto rounded-full bg-bg-alt flex items-center justify-center mb-3">
//                       <MapPin className="w-8 h-8 text-text-muted" />
//                     </div>
//                     <p className="text-text-muted mb-3">No addresses saved</p>
//                     <button
//                       onClick={() => setOpenAddress(true)}
//                       className="btn btn-primary text-sm"
//                     >
//                       Add New Address
//                     </button>
//                   </div>
//                 ) : (
//                   <div className="space-y-3">
//                     {addresses.map((addr) => {
//                       const isSelected = selectedAddress?._id === addr._id;
//                       const addressType = addr.address_type || 'home';

//                       return (
//                         <div
//                           key={addr._id}
//                           className={`flex justify-between items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
//                             isSelected
//                               ? "border-primary bg-primary/5"
//                               : "border-border hover:border-primary/50"
//                           }`}
//                           onClick={() => setSelectedAddress(addr)}
//                         >
//                           <div className="flex gap-3 flex-1">
//                             <input
//                               type="radio"
//                               checked={isSelected}
//                               onChange={() => setSelectedAddress(addr)}
//                               className="mt-1 w-4 h-4 text-primary focus:ring-primary"
//                             />
//                             <div className="flex-1">
//                               <div className="flex items-center gap-2 mb-1">
//                                 <span className="font-semibold text-text">
//                                   {addr.name}
//                                 </span>
//                                 <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
//                                   {getAddressIcon(addressType)}
//                                   {addressType.charAt(0).toUpperCase() + addressType.slice(1)}
//                                 </span>
//                               </div>
//                               <p className="text-sm text-text-muted">
//                                 {addr.address_line}
//                               </p>
//                               <p className="text-sm text-text-muted">
//                                 {addr.city}, {addr.state} - {addr.pincode}
//                               </p>
//                               <p className="text-sm text-text-muted mt-1">
//                                 📞 {addr.mobile}
//                               </p>
//                             </div>
//                           </div>
//                           <div className="flex gap-2 ml-4">
//                             <button
//                               className="p-1.5 text-text-muted hover:text-primary transition-colors"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 setAddressToEdit(addr);
//                                 setOpenAddress(true);
//                               }}
//                             >
//                               <Edit2 size={14} />
//                             </button>
//                             <button
//                               className="p-1.5 text-text-muted hover:text-error transition-colors"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleDeleteAddress(addr._id);
//                               }}
//                             >
//                               <Trash2 size={14} />
//                             </button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Payment Method Section */}
//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="p-5 border-b border-border bg-bg-alt">
//                 <div className="flex items-center gap-2">
//                   <CreditCard className="w-5 h-5 text-primary" />
//                   <h2 className="text-lg font-semibold text-text">Payment Method</h2>
//                 </div>
//               </div>

//               <div className="p-5">
//                 <div className="grid sm:grid-cols-3 gap-4">
//                   {[
//                     { id: "cod", label: "Cash on Delivery", icon: Truck, desc: "Pay when delivered" },
//                     { id: "card", label: "Card Payment", icon: CreditCard, desc: "Credit/Debit Card" },
//                     { id: "upi", label: "UPI / Net Banking", icon: Wallet, desc: "Google Pay, PhonePe etc." },
//                   ].map((method) => (
//                     <label
//                       key={method.id}
//                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
//                         paymentMethod === method.id
//                           ? "border-primary bg-primary/5"
//                           : "border-border hover:border-primary/50"
//                       }`}
//                     >
//                       <input
//                         type="radio"
//                         name="payment"
//                         value={method.id}
//                         checked={paymentMethod === method.id}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                         className="hidden"
//                       />
//                       <div className="text-center">
//                         <div className="flex justify-center mb-2">
//                           <method.icon className={`w-8 h-8 ${
//                             paymentMethod === method.id ? "text-primary" : "text-text-muted"
//                           }`} />
//                         </div>
//                         <p className="font-semibold text-text text-sm">{method.label}</p>
//                         <p className="text-xs text-text-muted mt-1">{method.desc}</p>
//                       </div>
//                     </label>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             {/* Security Note */}
//             <div className="bg-success/5 rounded-xl p-4 border border-success/20">
//               <div className="flex items-start gap-3">
//                 <Shield className="w-5 h-5 text-success mt-0.5" />
//                 <div>
//                   <p className="text-sm font-medium text-success">Secure Checkout</p>
//                   <p className="text-xs text-text-muted">
//                     Your payment information is encrypted and secure. We never store your card details.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Right Column - Order Summary */}
//           <div className="space-y-6">
//             <div className="bg-card rounded-xl border border-border p-5 sticky top-24">
//               <h2 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
//                 <Package className="w-5 h-5 text-primary" />
//                 Order Summary
//               </h2>

//               {/* Items List */}
//               <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar mb-4">
//                 {cartitems.map((item, i) => (
//                   <div key={i} className="flex gap-3">
//                     <div className="w-12 h-12 bg-bg-alt rounded-lg flex items-center justify-center flex-shrink-0">
//                       {item.productId?.image?.[0] ? (
//                         <img 
//                           src={item.productId.image[0]} 
//                           alt={item.productId?.name} 
//                           className="w-full h-full object-cover rounded-lg"
//                         />
//                       ) : (
//                         <Package className="w-6 h-6 text-text-muted" />
//                       )}
//                     </div>
//                     <div className="flex-1 min-w-0">
//                       <p className="text-sm font-medium text-text truncate">
//                         {item.productId?.name}
//                       </p>
//                       <p className="text-xs text-text-muted">
//                         Qty: {item.quantity} × {formatINR(item.productId?.price)}
//                       </p>
//                     </div>
//                     <span className="font-semibold text-text text-sm">
//                       {formatINR(item.productId?.price * item.quantity)}
//                     </span>
//                   </div>
//                 ))}
//               </div>

//               {/* Price Breakdown */}
//               <div className="border-t border-border pt-4 space-y-2">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Subtotal</span>
//                   <span className="text-text">{formatINR(totalPrice)}</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Shipping</span>
//                   <span className="text-success">FREE</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-text-muted">Tax</span>
//                   <span className="text-text">Included</span>
//                 </div>
//                 <div className="border-t border-border pt-3 mt-2">
//                   <div className="flex justify-between items-center">
//                     <span className="text-lg font-semibold text-text">Total</span>
//                     <span className="text-2xl font-bold gradient-text">
//                       {formatINR(totalPrice)}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Place Order Button */}
//               <button
//                 onClick={handlePlaceOrder}
//                 disabled={isProcessing || addresses.length === 0}
//                 className="w-full btn btn-primary py-3 rounded-xl mt-5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
//               >
//                 {isProcessing ? (
//                   <>
//                     <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     Place Order
//                     <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
//                   </>
//                 )}
//               </button>

//               {/* Delivery Info */}
//               <div className="mt-4 pt-3 border-t border-border">
//                 <div className="flex items-center justify-center gap-4 text-xs text-text-muted">
//                   <span className="flex items-center gap-1">
//                     <Truck size={12} />
//                     Free Delivery
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <CheckCircle size={12} />
//                     Easy Returns
//                   </span>
//                   <span className="flex items-center gap-1">
//                     <Shield size={12} />
//                     Secure Payment
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Add/Edit Address Modal */}
//       {openAddress && (
//         <DeliveryAddress
//           onClose={() => {
//             setOpenAddress(false);
//             setAddressToEdit(null);
//           }}
//           refreshAddresses={fetchAddresses}
//           addressToEdit={addressToEdit}
//         />
//       )}
//     </div>
//   );
// };

// export default CheckOutPage;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import DeliveryAddress from "./DeliveryAddress";
import toast from "react-hot-toast";
import { 
  MapPin, Plus, Edit2, Trash2, CreditCard, 
  Wallet, Truck, Shield, CheckCircle, Package,
  IndianRupee, ArrowRight, Home, Building, Phone
} from "lucide-react";

const CheckOutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  const cartitems = useSelector((state) => state.cart.cartitems);
  const navigate = useNavigate();

  const fetchAddresses = async () => {
    try {
      const res = await Axios({
        ...summaryApi().getAddresses,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setAddresses(res.data.data || []);
        if (res.data.data?.length > 0 && !selectedAddress) {
          setSelectedAddress(res.data.data[0]);
        }
      }
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const res = await Axios({
        ...summaryApi().deleteAddress(id),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Address deleted");
        fetchAddresses();
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  const totalPrice = cartitems.reduce(
    (sum, item) =>
      sum + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );

  const formatINR = (value) =>
    value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cartitems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);
    
    navigate(`/payment/${paymentMethod}`, {
      state: { 
        selectedAddress, 
        cartitems, 
        totalPrice,
        subTotal: totalPrice
      },
    });
  };

  const getAddressIcon = (type) => {
    if (type?.toLowerCase() === 'home') return <Home size={14} />;
    if (type?.toLowerCase() === 'office') return <Building size={14} />;
    return <MapPin size={14} />;
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Checkout
            </h1>
          </div>
          <p className="text-gray-500 ml-4">
            Complete your purchase by selecting address and payment method
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Address & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Delivery Address</h2>
                  </div>
                  <button
                    className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 text-sm py-2 px-4 rounded-lg flex items-center gap-2 transition"
                    onClick={() => {
                      setAddressToEdit(null);
                      setOpenAddress(true);
                    }}
                  >
                    <Plus size={14} />
                    Add New Address
                  </button>
                </div>
              </div>

              <div className="p-5">
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <MapPin className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500 mb-3">No addresses saved</p>
                    <button
                      onClick={() => setOpenAddress(true)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddress?._id === addr._id;
                      const addressType = addr.address_type || 'home';

                      return (
                        <div
                          key={addr._id}
                          className={`flex justify-between items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                          }`}
                          onClick={() => setSelectedAddress(addr)}
                        >
                          <div className="flex gap-3 flex-1">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => setSelectedAddress(addr)}
                              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-800">
                                  {addr.name}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                  {getAddressIcon(addressType)}
                                  {addressType.charAt(0).toUpperCase() + addressType.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {addr.address_line}
                              </p>
                              <p className="text-sm text-gray-500">
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                📞 {addr.mobile}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddressToEdit(addr);
                                setOpenAddress(true);
                              }}
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr._id);
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>
                </div>
              </div>

              <div className="p-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: Truck, desc: "Pay when delivered" },
                    { id: "card", label: "Card Payment", icon: CreditCard, desc: "Credit/Debit Card" },
                    { id: "upi", label: "UPI / Net Banking", icon: Wallet, desc: "Google Pay, PhonePe etc." },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        paymentMethod === method.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="hidden"
                      />
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <method.icon className={`w-8 h-8 ${
                            paymentMethod === method.id ? "text-blue-600" : "text-gray-500"
                          }`} />
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">{method.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Security Note */}
            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-700">Secure Checkout</p>
                  <p className="text-xs text-gray-500">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cartitems.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.productId?.image?.[0] ? (
                        <img 
                          src={item.productId.image[0]} 
                          alt={item.productId?.name} 
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Package className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {item.productId?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Qty: {item.quantity} × {formatINR(item.productId?.price)}
                      </p>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">
                      {formatINR(item.productId?.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">{formatINR(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-800">Included</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {formatINR(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || addresses.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl mt-5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Delivery Info */}
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Truck size={12} />
                    Free Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Easy Returns
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={12} />
                    Secure Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {openAddress && (
        <DeliveryAddress
          onClose={() => {
            setOpenAddress(false);
            setAddressToEdit(null);
          }}
          refreshAddresses={fetchAddresses}
          addressToEdit={addressToEdit}
        />
      )}
    </div>
  );
};

export default CheckOutPage;