import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice.js";
import { 
  QrCode, Smartphone, Shield, CheckCircle, 
  ArrowRight, AlertCircle, CreditCard, 
  Wallet, Copy, Check, X, Lock
} from "lucide-react";

const UPIPayment = () => {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMounted = useRef(true);
  const abortControllerRef = useRef(null);

  const location = useLocation();
  const { 
    selectedAddress, 
    cartitems = [], 
    totalPrice = 0, 
    subTotal = 0 
  } = location.state || {};

  // Cleanup on unmount
  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Generate QR code URL when upiId or totalPrice changes
  useEffect(() => {
    const generateQRCodeUrl = () => {
      const validUpiId = upiId && upiId.includes("@") ? upiId : "buyzaar@okhdfcbank";
      const upiString = `upi://pay?pa=${encodeURIComponent(validUpiId)}&pn=BuyZaar&am=${totalPrice || 0}&tn=Order%20Payment&cu=INR`;
      return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
    };
    setQrCodeUrl(generateQRCodeUrl());
  }, [upiId, totalPrice]);

  const validatePayment = useCallback(() => {
    if (!upiId || !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g., username@okicici)");
      return false;
    }

    if (!selectedAddress?._id) {
      toast.error("Please select a delivery address!");
      return false;
    }

    if (!cartitems || cartitems.length === 0) {
      toast.error("Your cart is empty!");
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must login first!");
      navigate("/login");
      return false;
    }

    return true;
  }, [upiId, selectedAddress, cartitems, navigate]);

  const handlePayment = async () => {
    if (!validatePayment()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      
      const payload = {
        items: cartitems.map(item => ({
          product: item.productId?._id || item._id,
          quantity: item.quantity
        })),
        shippingAddressId: selectedAddress._id,
        paymentMethod: "UPI",
        discount: 0,
        notes: `UPI Payment - ${upiId}`,
        upiId: upiId,
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
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        signal: abortControllerRef.current.signal,
      });

      if (!isMounted.current) return;

      if (response.data?.success) {
        toast.success("Payment initiated! Order placed successfully!", {
          duration: 4000,
        });

        localStorage.removeItem("cart");
        dispatch(clearCart());

        navigate("/payment/success", {
          state: {
            order: response.data.order,
            paymentMethod: "UPI Payment",
            amount: totalPrice,
            orderNumber: response.data.order?.orderNumber,
            upiId: upiId,
            message: "UPI payment initiated. Please complete payment in your UPI app."
          }
        });
      } else {
        toast.error(response.data?.message || "Payment failed!");
        navigate("/payment/fail");
      }

    } catch (error) {
      if (!isMounted.current) return;
      
      console.error("UPI payment error:", error);

      if (error.name === 'AbortError' || error.code === 'ERR_CANCELED') {
        return;
      }

      if (error.response) {
        const errorMessage = error.response.data?.message || "Payment failed";

        if (error.response.status === 400) {
          if (error.response.data?.outOfStockProducts) {
            toast.error("Some products are out of stock!");
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

      navigate("/payment/fail");
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  const copyUPIId = () => {
    if (upiId) {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => {
        if (isMounted.current) {
          setCopied(false);
        }
      }, 2000);
      toast.success("UPI ID copied!");
    }
  };

  const openUPIApp = () => {
    if (upiId && upiId.includes("@")) {
      const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=BuyZaar&am=${totalPrice || 0}&tn=Order%20Payment&cu=INR`;
      window.open(upiLink, "_blank");
    } else {
      toast.error("Please enter a valid UPI ID first");
    }
  };

  const handleUpiIdChange = (e) => {
    const value = e.target.value.trim();
    setUpiId(value);
  };

  const upiApps = [
    { name: "Google Pay", color: "bg-blue-50 text-blue-600" },
    { name: "PhonePe", color: "bg-purple-50 text-purple-600" },
    { name: "Paytm", color: "bg-blue-50 text-blue-600" },
    { name: "BHIM", color: "bg-orange-50 text-orange-600" },
  ];

  const isValidUpiId = upiId && upiId.includes("@");
  const totalItems = cartitems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 fade-in">
      <div className="container-narrow max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
            <Wallet className="w-8 h-8 text-white" aria-hidden="true" />
          </div>
          <h1 className="text-2xl md:text-3xl font-display font-bold gradient-text mb-2">
            UPI Payment
          </h1>
          <p className="text-text-muted">
            Pay instantly using any UPI app
          </p>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {/* How to Pay */}
          <div className="p-5 border-b border-border bg-bg-alt">
            <div className="flex items-center gap-2 mb-3">
              <Smartphone size={18} className="text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-text">How to pay:</h3>
            </div>
            <ol className="list-decimal pl-5 text-text-muted text-sm space-y-1">
              <li>Enter your UPI ID below</li>
              <li>Scan the QR code or click "Open UPI App"</li>
              <li>Confirm payment in your UPI app</li>
              <li>Click "I Have Paid" to complete your order</li>
            </ol>
          </div>

          {/* QR Code Section */}
          <div className="p-6 text-center border-b border-border">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-border">
              <img
                src={qrCodeUrl}
                alt="UPI QR Code"
                className="w-48 h-48 md:w-56 md:h-56"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/250?text=QR+Code";
                }}
              />
            </div>
            <p className="mt-3 text-text-muted text-sm flex items-center justify-center gap-1">
              <QrCode size={14} aria-hidden="true" />
              Scan with any UPI app
            </p>
          </div>

          {/* UPI ID Input */}
          <div className="p-6 border-b border-border">
            <label className="label flex items-center gap-2 mb-2">
              <Smartphone size={16} className="text-primary" aria-hidden="true" />
              Your UPI ID <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., username@okicici, username@ybl"
                value={upiId}
                onChange={handleUpiIdChange}
                className={`input w-full pr-24 ${!isValidUpiId && upiId ? 'border-error' : ''}`}
                aria-invalid={!!upiId && !isValidUpiId}
              />
              <button
                onClick={copyUPIId}
                disabled={!upiId}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 transition-all ${
                  upiId 
                    ? 'bg-primary text-white hover:bg-primary-dark' 
                    : 'bg-border text-text-muted cursor-not-allowed'
                }`}
                aria-label="Copy UPI ID"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            {upiId && !isValidUpiId && (
              <p className="mt-1 text-xs text-error flex items-center gap-1">
                <AlertCircle size={12} aria-hidden="true" />
                Please enter a valid UPI ID (must contain @ symbol)
              </p>
            )}
            <p className="text-xs text-text-muted mt-2">
              Common UPI handles: @okicici, @ybl, @oksbi, @axl, @paytm
            </p>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b border-border bg-bg-alt/50">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-primary" aria-hidden="true" />
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Items ({totalItems})</span>
                <span className="text-text">₹{(subTotal || totalPrice).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Shipping</span>
                <span className="text-success">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Tax</span>
                <span className="text-text">Included</span>
              </div>
              <div className="border-t border-border pt-3 mt-2">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-text">Total Amount</span>
                  <span className="text-2xl font-bold gradient-text">
                    ₹{totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-text-muted text-center mt-2">
                  Amount to be paid via UPI
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 space-y-3">
            <button
              onClick={handlePayment}
              disabled={loading || !isValidUpiId}
              className="w-full btn-primary py-3 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  I Have Paid & Confirm Order
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button
              onClick={openUPIApp}
              disabled={!isValidUpiId}
              className="w-full btn-secondary py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Smartphone size={18} />
              Open UPI App
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full btn-outline py-3 rounded-xl flex items-center justify-center gap-2"
            >
              <X size={18} />
              Back to Payment Options
            </button>
          </div>

          {/* Supported Apps */}
          <div className="p-5 border-t border-border bg-bg-alt">
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3 text-center">
              Supported UPI Apps
            </h4>
            <div className="flex justify-center gap-3 flex-wrap">
              {upiApps.map((app, index) => (
                <div key={index} className={`px-4 py-2 rounded-lg ${app.color} text-sm font-medium`}>
                  {app.name}
                </div>
              ))}
            </div>
          </div>

          {/* Security Note */}
          <div className="p-5 border-t border-border">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-success mt-0.5" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-text">Secure Payment</p>
                <p className="text-xs text-text-muted">
                  Your payment is processed securely. We never store your UPI ID or banking details.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Text */}
        <p className="text-center text-xs text-text-muted mt-6">
          Having trouble? Contact our support team at{" "}
          <a href="mailto:support@buyzaar.com" className="text-primary hover:underline">
            support@buyzaar.com
          </a>
        </p>
      </div>
    </div>
  );
};

export default UPIPayment;