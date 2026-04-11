import React, { useState } from "react";
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
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { 
    selectedAddress, 
    cartitems = [], 
    totalPrice = 0, 
    subTotal = 0 
  } = useLocation().state || {};

  const handlePayment = async () => {
    if (!upiId || !upiId.includes("@")) {
      toast.error("Please enter a valid UPI ID (e.g., username@okicici)");
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
        paymentMethod: "UPI",
        discount: 0,
        notes: "UPI Payment",
        upiId: upiId
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
        toast.success("Payment initiated! Order placed successfully!", {
          icon: <CheckCircle size={18} />,
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
        toast.error(response.data.message || "Payment failed!");
        navigate("/payment/fail");
      }

    } catch (error) {
      console.error("UPI payment error:", error);

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
        toast.error("Something went wrong");
      }

      navigate("/payment/fail");
    } finally {
      setLoading(false);
    }
  };

  const copyUPIId = () => {
    if (upiId) {
      navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("UPI ID copied!");
    }
  };

  const generateQRCodeUrl = () => {
    const upiString = `upi://pay?pa=${upiId || "your-upi-id@upi"}&pn=BuyZaar&am=${totalPrice}&tn=Order Payment&cu=INR`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiString)}`;
  };

  const openUPIApp = () => {
    if (upiId && upiId.includes("@")) {
      const upiLink = `upi://pay?pa=${upiId}&pn=BuyZaar&am=${totalPrice}&tn=Order Payment&cu=INR`;
      window.open(upiLink, "_blank");
    } else {
      toast.error("Please enter a valid UPI ID first");
    }
  };

  const upiApps = [
    { name: "Google Pay", icon: "📱", color: "bg-blue-50 text-blue-600" },
    { name: "PhonePe", icon: "📱", color: "bg-purple-50 text-purple-600" },
    { name: "Paytm", icon: "📱", color: "bg-blue-50 text-blue-600" },
    { name: "BHIM", icon: "📱", color: "bg-orange-50 text-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 fade-in">
      <div className="container-narrow max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
            <Wallet className="w-8 h-8 text-white" />
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
              <Smartphone size={18} className="text-primary" />
              <h3 className="font-semibold text-text">How to pay:</h3>
            </div>
            <ol className="list-decimal pl-5 text-text-muted text-sm space-y-1">
              <li>Enter your UPI ID below</li>
              <li>Scan the QR code or click "Open UPI App"</li>
              <li>Confirm payment in your UPI app</li>
              <li>Complete payment to place your order</li>
            </ol>
          </div>

          {/* QR Code Section */}
          <div className="p-6 text-center border-b border-border">
            <div className="inline-block p-4 bg-white rounded-2xl shadow-md border border-border">
              <img
                src={generateQRCodeUrl()}
                alt="UPI QR Code"
                className="w-48 h-48 md:w-56 md:h-56"
              />
            </div>
            <p className="mt-3 text-text-muted text-sm flex items-center justify-center gap-1">
              <QrCode size={14} />
              Scan with any UPI app
            </p>
          </div>

          {/* UPI ID Input */}
          <div className="p-6 border-b border-border">
            <label className="label flex items-center gap-2 mb-2">
              <Smartphone size={16} className="text-primary" />
              Your UPI ID <span className="text-error">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g., username@okicici, username@ybl"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value.trim())}
                className="input w-full pr-24"
              />
              <button
                onClick={copyUPIId}
                disabled={!upiId}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 disabled:opacity-50"
                style={{
                  backgroundColor: upiId ? "var(--color-primary)" : "var(--color-border)",
                  color: upiId ? "white" : "var(--color-text-muted)"
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-text-muted mt-2">
              Common UPI handles: @okicici, @ybl, @oksbi, @axl, @paytm
            </p>
          </div>

          {/* Order Summary */}
          <div className="p-6 border-b border-border bg-bg-alt/50">
            <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
              <CreditCard size={16} className="text-primary" />
              Order Summary
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Items ({cartitems.length})</span>
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
                  <span className="text-lg font-semibold text-text">Total</span>
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
              disabled={loading || !upiId.includes("@")}
              className="w-full btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="spinner w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle size={18} />
                  I Have Paid
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <button
              onClick={openUPIApp}
              disabled={!upiId.includes("@")}
              className="w-full btn btn-secondary py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Smartphone size={18} />
              Open UPI App
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full btn btn-outline py-3 rounded-xl flex items-center justify-center gap-2"
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
            <div className="flex justify-center gap-3">
              {upiApps.map((app, index) => (
                <div key={index} className={`px-4 py-2 rounded-lg ${app.color} text-sm font-medium`}>
                  {app.icon} {app.name}
                </div>
              ))}
            </div>
          </div>

          {/* Security Note */}
          <div className="p-5 border-t border-border">
            <div className="flex items-start gap-3">
              <Shield size={18} className="text-success mt-0.5" />
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
          Having trouble? Contact our support team at support@buyzaar.com
        </p>
      </div>
    </div>
  );
};

export default UPIPayment;