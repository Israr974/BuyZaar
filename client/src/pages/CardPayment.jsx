
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { 
  CreditCard, Lock, Calendar, User, Shield, 
  CheckCircle, AlertCircle, ArrowRight, Sparkles,
  Receipt, Package, MapPin, IndianRupee,Phone
} from "lucide-react";

const CardPayment = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);
  const [activeCard, setActiveCard] = useState("credit");
  
  const navigate = useNavigate();
  const { selectedAddress, cartitems, totalPrice, subTotal } = useLocation().state || {};

 
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

 
  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };

  const handlePayment = async () => {
  
  if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
    toast.error("Please enter a valid 16-digit card number");
    return;
  }
  if (!expiry || expiry.length < 5) {
    toast.error("Please enter a valid expiry date (MM/YY)");
    return;
  }
  if (!cvv || cvv.length < 3) {
    toast.error("Please enter a valid CVV");
    return;
  }
  if (!name.trim()) {
    toast.error("Please enter card holder name");
    return;
  }

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
      paymentMethod: "CARD", 
      discount: 0,
      notes: "Card Payment"
    };

   
    payload.priceBreakdown = {
      subTotal: subTotal || totalPrice,
      shippingFee: 0,
      tax: 0,
      discount: 0,
      total: totalPrice
    };

    console.log("Card Payment Payload:", payload);

    const response = await Axios({
      ...summaryApi().placeOrder,
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("Card Payment Response:", response.data);

    if (response.data.success) {
      toast.success("Payment successful! Order placed.");
      
      
      localStorage.removeItem("cart");
      await Axios(summaryApi().clearCart);
      
      navigate("/payment/success", {
        state: {
          order: response.data.order,
          paymentMethod: "Card Payment",
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
    console.error("Card payment error:", error);
    
    if (error.response) {
      const errorMessage = error.response.data?.message || "Payment failed";
      
      if (error.response.status === 400) {
        toast.error(errorMessage);
      } else if (error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        toast.error(errorMessage);
      }
    } else {
      toast.error("Network error. Please try again.");
    }
    
    navigate("/payment/fail");
  } finally {
    setLoading(false);
  }
};
  
  const getCardType = (number) => {
    const num = number.replace(/\s/g, '');
    if (/^4/.test(num)) return "Visa";
    if (/^5[1-5]/.test(num)) return "Mastercard";
    if (/^3[47]/.test(num)) return "American Express";
    if (/^6(?:011|5)/.test(num)) return "Discover";
    return "Card";
  };

  


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
      
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
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
          
          <div className="lg:col-span-2 space-y-8">
            
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-text flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Select Card Type
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveCard("credit")}
                    className={`px-4 py-2 rounded-lg transition ${activeCard === "credit" ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Credit Card
                  </button>
                  <button
                    onClick={() => setActiveCard("debit")}
                    className={`px-4 py-2 rounded-lg transition ${activeCard === "debit" ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                  >
                    Debit Card
                  </button>
                </div>
              </div>

              
              <div className="space-y-6">
                
                <div>
                  <label className="label flex items-center gap-2">
                    <CreditCard size={16} />
                    Card Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      className="input pl-12"
                      maxLength={19}
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                      {cardNumber ? (
                        <span className="font-medium text-primary">
                          {getCardType(cardNumber)}
                        </span>
                      ) : (
                        <CreditCard className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label flex items-center gap-2">
                      <Calendar size={16} />
                      Expiry Date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={expiry}
                        onChange={handleExpiryChange}
                        className="input pl-12"
                        maxLength={5}
                      />
                      <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <label className="label flex items-center gap-2">
                      <Lock size={16} />
                      CVV
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        placeholder="123"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                        className="input pl-12"
                        maxLength={3}
                      />
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                
                <div>
                  <label className="label flex items-center gap-2">
                    <User size={16} />
                    Card Holder Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input pl-12"
                    />
                    <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            
            <div className="card p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-green-50">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-text mb-2">Secure Payment</h3>
                  <p className="text-sm text-text-muted">
                    Your payment information is encrypted and secure. We never store your card details.
                    This is a demo payment system for testing purposes only.
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-xs text-text-muted">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      256-bit SSL
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      PCI Compliant
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      Fraud Protection
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="space-y-6">
            
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5" />
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium">
                    <IndianRupee className="inline w-4 h-4" />
                    {subTotal || totalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-text-muted">Tax</span>
                  <span className="font-medium">
                    <IndianRupee className="inline w-4 h-4" />
                    {Math.round((totalPrice - (subTotal || totalPrice)) * 100) / 100 || 0}
                  </span>
                </div>
                <div className="border-t border-border pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-bold text-primary">
                      <IndianRupee className="inline w-5 h-5" />
                      {totalPrice}
                    </span>
                  </div>
                </div>
              </div>

              
              <button
                onClick={handlePayment}
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg font-semibold group"
              >
                {loading ? (
                  <>
                    <div className="spinner mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Pay Now
                    <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-text-muted mt-4">
                By clicking Pay Now, you agree to our Terms & Conditions
              </p>
            </div>

            
            {selectedAddress && (
              <div className="card p-6">
                <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </h3>
                <div className="space-y-2">
                  <p className="text-text">{selectedAddress.address_line}</p>
                  <p className="text-sm text-text-muted">
                    {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                  </p>
                  <p className="text-sm text-text-muted">{selectedAddress.country}</p>
                  <div className="flex items-center gap-2 mt-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedAddress.name}</span>
                    <span className="mx-2">•</span>
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{selectedAddress.mobile}</span>
                  </div>
                </div>
              </div>
            )}

            
            {cartitems && cartitems.length > 0 && (
              <div className="card p-6">
                <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5" />
                  Items ({cartitems.length})
                </h3>
                <div className="space-y-3">
                  {cartitems.slice(0, 3).map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-text-muted">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <span className="font-semibold">
                        ₹{item.quantity * item.price}
                      </span>
                    </div>
                  ))}
                  {cartitems.length > 3 && (
                    <p className="text-center text-sm text-text-muted pt-2">
                      + {cartitems.length - 3} more items
                    </p>
                  )}
                </div>
              </div>
            )}

            
            <div className="card p-6">
              <h3 className="font-semibold text-text mb-4">Accepted Cards</h3>
              <div className="flex gap-3">
                <div className="p-3 rounded-lg border border-border bg-white">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded"></div>
                  <span className="text-xs mt-1 block">Visa</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-white">
                  <div className="w-12 h-8 bg-gradient-to-r from-red-600 to-orange-500 rounded"></div>
                  <span className="text-xs mt-1 block">Mastercard</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-white">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded"></div>
                  <span className="text-xs mt-1 block">Amex</span>
                </div>
                <div className="p-3 rounded-lg border border-border bg-white">
                  <div className="w-12 h-8 bg-gradient-to-r from-orange-600 to-orange-400 rounded"></div>
                  <span className="text-xs mt-1 block">Discover</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-accent" />
            <span className="text-sm text-text-muted">100% Secure Payment</span>
            <Sparkles className="w-5 h-5 text-accent" />
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