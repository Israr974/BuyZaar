import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home, Receipt, Download } from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("orderId") || 
               location.state?.orderId || 
               `ORD-${Date.now().toString().slice(-8)}`;
    setOrderId(id);

   
    if (window.gtag) {
      window.gtag('event', 'purchase', {
        transaction_id: id,
        currency: 'USD',
        value: location.state?.amount || 0
      });
    }

    
    localStorage.removeItem("cartItems");


    const timer = setTimeout(() => {
      navigate("/orders");
    }, 10000);

    return () => clearTimeout(timer);
  }, [location, navigate]);

  const handleDownloadReceipt = () => {
    setLoading(true);
    
    setTimeout(() => {
      const receiptContent = `
        RECEIPT
        Order ID: ${orderId}
        Date: ${new Date().toLocaleDateString()}
        Status: Paid
        Thank you for your purchase!
      `;
      
      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `receipt-${orderId}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setLoading(false);
    }, 1000);
  };

  const handleShareOrder = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Order Details",
        text: `I just placed an order! Order ID: ${orderId}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(orderId);
      alert("Order ID copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full mx-auto p-8 bg-white shadow-2xl rounded-2xl text-center transform transition-all duration-300 hover:shadow-3xl">
        
      
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>
            <div className="absolute inset-0 rounded-full border-4 border-green-300 animate-ping opacity-20"></div>
          </div>
        </div>

       
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your purchase
        </p>
        
        
        {orderId && (
          <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Receipt className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-500">ORDER CONFIRMED</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 mb-1">{orderId}</p>
            <p className="text-gray-600">
              A confirmation email has been sent to your registered email address.
            </p>
            <p className="text-sm text-gray-500 mt-3">
              Estimated delivery: Within 5-7 business days
            </p>
          </div>
        )}

      
        <div className="space-y-4">
          <button
            onClick={() => navigate("/dashboard/myorder")}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 flex items-center justify-center gap-3 font-medium text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <ShoppingBag className="w-5 h-5" />
            View Your Orders
          </button>

          <button
            onClick={handleDownloadReceipt}
            disabled={loading}
            className="w-full border-2 border-green-600 text-green-700 px-6 py-4 rounded-xl hover:bg-green-50 transition-all duration-300 flex items-center justify-center gap-3 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            {loading ? "Generating Receipt..." : "Download Receipt"}
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleShareOrder}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span className="text-lg">📋</span>
              Share Order
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </button>
          </div>
        </div>

        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            What's Next?
          </h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Track your order in the "My Orders" section
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Contact support if you have any questions
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Rate products after receiving your order
            </li>
          </ul>
        </div>

   
        <div className="mt-6 text-sm text-gray-500">
          <p>Redirecting to orders page in 10 seconds...</p>
          <button
            onClick={() => navigate("/orders")}
            className="text-green-600 hover:text-green-800 underline mt-1"
          >
            Go now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;