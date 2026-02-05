import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearCart } from "../redux/cartSlice.js"; 

const UPIPayment = () => {
  const [upiId, setUpiId] = useState("");
  const [loading, setLoading] = useState(false);
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

      console.log("UPI Payment Payload:", payload);

      const response = await Axios({
        ...summaryApi().placeOrder,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      console.log("UPI Payment Response:", response.data);

      if (response.data.success) {
        toast.success("UPI payment initiated! Order placed.");
        
      
        toast(
          <div style={{ textAlign: "left" }}>
            <p><strong>Complete payment in your UPI app</strong></p>
            <p>UPI ID: <strong>{upiId}</strong></p>
            <p>Amount: <strong>₹{totalPrice}</strong></p>
            <p>Order #: <strong>{response.data.order?.orderNumber}</strong></p>
          </div>,
          { duration: 5000 }
        );
        
       
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
        } else if (error.response.status === 404) {
          toast.error("Address not found. Please select a valid address.");
        } else {
          toast.error(errorMessage);
        }
      } else if (error.request) {
        toast.error("Network error. Please check your connection.");
      } else {
        toast.error(error.message || "Something went wrong");
      }
      
      navigate("/payment/fail");
    } finally {
      setLoading(false);
    }
  };

 
  const generateQRCodeUrl = () => {
    const upiString = `upi://pay?pa=${upiId || "your-upi-id@upi"}&pn=YourStore&am=${totalPrice}&tn=Order Payment`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">UPI Payment</h2>

    
      <div className="mb-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">How to pay:</h3>
        <ol className="list-decimal pl-5 text-gray-700 space-y-1">
          <li>Enter your UPI ID below</li>
          <li>Scan the QR code with any UPI app</li>
          <li>Or click "Open UPI App" button</li>
          <li>Confirm payment in your UPI app</li>
          <li>Click "I Have Paid" after completing payment</li>
        </ol>
      </div>

      
      <div className="flex flex-col items-center mb-6">
        <div className="border-2 border-gray-300 p-4 rounded-lg bg-white">
          <img
            src={generateQRCodeUrl()}
            alt="UPI QR Code"
            className="w-48 h-48"
          />
        </div>
        <p className="mt-3 text-gray-600 text-sm">Scan with GPay, PhonePe, Paytm, etc.</p>
      </div>

      
      <div className="mb-6">
        <label className="block text-gray-700 mb-2 font-medium">
          Your UPI ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="e.g., username@okicici, username@ybl, username@oksbi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value.trim())}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-500 mt-1">
          Common UPI handles: @okicici, @ybl, @oksbi, @axl, @paytm
        </p>
      </div>

      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-3">Order Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">Items ({cartitems.length})</span>
            <span className="font-medium">₹{subTotal || totalPrice}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span className="font-medium">₹0</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">₹0</span>
          </div>
          <div className="border-t pt-2 flex justify-between text-lg font-bold">
            <span>Total Amount</span>
            <span className="text-purple-600">₹{totalPrice}</span>
          </div>
        </div>
      </div>

     
      <div className="space-y-3">
        <button
          onClick={handlePayment}
          disabled={loading || !upiId.includes("@")}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            loading || !upiId.includes("@")
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
          } text-white`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            "I Have Paid"
          )}
        </button>

        
        <button
          onClick={() => {
            if (upiId && upiId.includes("@")) {
              const upiLink = `upi://pay?pa=${upiId}&pn=YourStore&am=${totalPrice}&tn=Order Payment`;
              window.open(upiLink, "_blank");
            } else {
              toast.error("Please enter a valid UPI ID first");
            }
          }}
          disabled={!upiId.includes("@")}
          className={`w-full py-3 rounded-lg font-medium border transition-colors ${
            !upiId.includes("@")
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "border-green-500 text-green-600 hover:bg-green-50"
          }`}
        >
          Open UPI App
        </button>

     
        <button
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-lg font-medium border border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          Back to Payment Options
        </button>
      </div>

   
      <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800 text-center">
          <strong>Secure Payment:</strong> Your payment is processed securely. 
          We never store your UPI ID or banking details.
        </p>
      </div>
    </div>
  );
};

export default UPIPayment;