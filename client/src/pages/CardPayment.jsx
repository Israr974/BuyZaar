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
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";

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
   
    const cleaned = value.replace(/\D/g, '');
    
    const limited = cleaned.slice(0, 16);
   
    const formatted = limited.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted;
  };

  
  const formatExpiry = (value) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      const month = cleaned.slice(0, 2);
      const year = cleaned.slice(2, 4);
      if (year) {
        return `${month}/${year}`;
      }
      return month;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatCardNumber(rawValue);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const rawValue = e.target.value;
    const formatted = formatExpiry(rawValue);
    setExpiry(formatted);
  };

  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return { name: "Visa", color: "from-blue-600 to-blue-800" };
    if (/^5[1-5]/.test(num)) return { name: "Mastercard", color: "from-red-600 to-orange-500" };
    if (/^3[47]/.test(num)) return { name: "American Express", color: "from-blue-400 to-blue-600" };
    if (/^6(?:011|5)/.test(num)) return { name: "Discover", color: "from-orange-600 to-orange-400" };
    return { name: "Card", color: "from-gray-600 to-gray-800" };
  };

  const calculateItemPrice = (item) => {
    const originalPrice = item.productId?.price || item.price || 0;
    const discount = item.productId?.discount || item.discount || 0;
    return calculateDiscountedPrice(originalPrice, discount);
  };

  const validateForm = () => {
    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (!cleanCardNumber || cleanCardNumber.length < 16) {
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
          quantity: item.quantity,
          priceAtTime: calculateItemPrice(item)
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
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 mb-4 shadow-lg">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-3">
            Secure Payment
          </h1>
          <p className="text-gray-500">
            Complete your purchase with secure card payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-2 space-y-6">
        
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  Select Card Type
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCard("credit")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeCard === "credit" 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    Credit Card
                  </button>
                  <button
                    onClick={() => setActiveCard("debit")}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      activeCard === "debit" 
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md' 
                        : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                    }`}
                  >
                    Debit Card
                  </button>
                </div>
              </div>

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

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard size={16} className="text-blue-600" />
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                      maxLength={19}
                      inputMode="numeric"
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                    {cardNumber && (
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                        <span className="text-xs font-semibold text-blue-600">{cardInfo.name}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Enter 16-digit card number</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar size={16} className="text-blue-600" />
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                        maxLength={5}
                        inputMode="numeric"
                      />
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Lock size={16} className="text-blue-600" />
                      CVV
                    </label>
                    <div className="relative">
                      <input
                        type={showCvv ? "text" : "password"}
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="w-full px-4 py-2 pl-12 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-mono"
                        maxLength={3}
                        inputMode="numeric"
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <button
                        type="button"
                        onClick={() => setShowCvv(!showCvv)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        {showCvv ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    Card Holder Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-2 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Save card for future payments</span>
                </label>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-green-100">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Secure Payment</h3>
                  <p className="text-sm text-gray-500">
                    Your payment information is encrypted and secure. We never store your card details.
                    This is a demo payment system for testing purposes only.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-600" />
                      256-bit SSL
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-600" />
                      PCI Compliant
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle size={12} className="text-green-600" />
                      Fraud Protection
                    </span>
                    <span className="flex items-center gap-1">
                      <Fingerprint size={12} className="text-green-600" />
                      3D Secure
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-6">
           
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-800">{formatPrice(subTotal || totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-800">Included</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-4 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Lock size={18} />
                    Pay {formatPrice(totalPrice)}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500 mt-4">
                By clicking Pay Now, you agree to our Terms & Conditions
              </p>
            </div>

            {selectedAddress && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  Delivery Address
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-800 font-medium">{selectedAddress.name}</p>
                  <p className="text-sm text-gray-500">{selectedAddress.address_line}</p>
                  <p className="text-sm text-gray-500">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-500">{selectedAddress.country}</p>
                  <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-200">
                    <Phone size={14} className="text-gray-500" />
                    <span className="text-sm text-gray-500">{selectedAddress.mobile}</span>
                  </div>
                </div>
              </div>
            )}

            {cartitems?.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-600" />
                  Items ({cartitems.length})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cartitems.map((item, index) => {
                    const originalPrice = item.productId?.price || item.price || 0;
                    const discount = item.productId?.discount || item.discount || 0;
                    const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
                    const hasDiscount = discount > 0;
                    
                    return (
                      <div key={index} className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          {item.productId?.image?.[0] ? (
                            <img 
                              src={item.productId.image[0]} 
                              alt={item.productId?.name} 
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <Package className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">
                            {item.productId?.name || item.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                            {hasDiscount && (
                              <span className="text-xs text-red-500">
                                {discount}% OFF
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-gray-800 text-sm">
                            {formatPrice(discountedPrice * item.quantity)}
                          </span>
                          {hasDiscount && (
                            <p className="text-xs text-gray-400 line-through">
                              {formatPrice(originalPrice * item.quantity)}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3">Accepted Cards</h3>
              <div className="flex flex-wrap gap-2">
                <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
                  <span className="text-sm font-medium">Visa</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
                  <span className="text-sm font-medium">Mastercard</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
                  <span className="text-sm font-medium">Amex</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
                  <span className="text-sm font-medium">Discover</span>
                </div>
                <div className="px-3 py-2 rounded-lg bg-gray-100 border border-gray-200">
                  <Smartphone size={16} className="text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-orange-500" />
            <span className="text-sm text-gray-500">100% Secure Payment</span>
            <Sparkles className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-xs text-gray-500 max-w-2xl mx-auto">
            This is a demonstration payment system. No real money will be charged.
            Card details are not stored and are used for testing purposes only.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardPayment;