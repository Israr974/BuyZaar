// import React, { useEffect, useState } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import { 
//   CheckCircle, ShoppingBag, Home, Receipt, Download, 
//   Share2, Clock, Truck, Shield, Mail, ArrowRight,
//   Package, Star, TrendingUp
// } from "lucide-react";

// const PaymentSuccess = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [orderId, setOrderId] = useState("");
//   const [orderAmount, setOrderAmount] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [secondsLeft, setSecondsLeft] = useState(10);

//   useEffect(() => {
//     const queryParams = new URLSearchParams(location.search);
//     const id = queryParams.get("orderId") || 
//                location.state?.orderId || 
//                `ORD-${Date.now().toString().slice(-8)}`;
//     const amount = queryParams.get("amount") || 
//                    location.state?.amount || 
//                    0;
    
//     setOrderId(id);
//     setOrderAmount(amount);

//     if (window.gtag) {
//       window.gtag('event', 'purchase', {
//         transaction_id: id,
//         currency: 'INR',
//         value: parseFloat(amount),
//         items: location.state?.items || []
//       });
//     }

//     localStorage.removeItem("cartItems");
//     localStorage.removeItem("cart");

//     const interval = setInterval(() => {
//       setSecondsLeft(prev => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           navigate("/dashboard/myorder");
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [location, navigate]);

//   const handleDownloadReceipt = () => {
//     setLoading(true);
    
//     setTimeout(() => {
//       const receiptContent = `
// ╔═══════════════════════════════════════════════════════════╗
// ║                      BUYZAAR RECEIPT                      ║
// ╠═══════════════════════════════════════════════════════════╣
// ║  Order ID: ${orderId}
// ║  Date: ${new Date().toLocaleDateString()}
// ║  Time: ${new Date().toLocaleTimeString()}
// ║  Status: ✅ PAID
// ║  Amount: ₹${parseFloat(orderAmount).toLocaleString()}
// ╠═══════════════════════════════════════════════════════════╣
// ║  Thank you for shopping with BuyZaar!
// ║  Your order will be delivered within 5-7 business days.
// ╠═══════════════════════════════════════════════════════════╣
// ║  Need help? Contact: support@buyzaar.com
// ║  Phone: +91 63973 78896
// ╚═══════════════════════════════════════════════════════════╝
//       `;
      
//       const blob = new Blob([receiptContent], { type: "text/plain" });
//       const url = URL.createObjectURL(blob);
//       const a = document.createElement("a");
//       a.href = url;
//       a.download = `receipt-${orderId}.txt`;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
//       setLoading(false);
//     }, 1000);
//   };

//   const handleShareOrder = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: "Order Confirmed - BuyZaar",
//         text: `I just placed an order on BuyZaar! Order ID: ${orderId}`,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(orderId);
//       alert("Order ID copied to clipboard!");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-bg flex items-center justify-center p-4 fade-in">
//       <div className="max-w-lg w-full mx-auto">
//         {/* Main Card */}
//         <div className="bg-card rounded-2xl shadow-xl border border-border overflow-hidden">
//           {/* Header Gradient */}
//           <div className="h-2 bg-gradient-to-r from-success via-green-500 to-success"></div>
          
//           <div className="p-8 text-center">
//             {/* Success Icon */}
//             <div className="relative inline-block mb-6">
//               <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center">
//                 <CheckCircle className="w-14 h-14 text-success" />
//               </div>
//               <div className="absolute inset-0 rounded-full border-4 border-success/30 animate-ping opacity-30"></div>
//             </div>

//             {/* Title */}
//             <h1 className="text-3xl font-display font-bold text-text mb-2">
//               Payment Successful!
//             </h1>
//             <p className="text-text-muted mb-6">
//               Thank you for your purchase
//             </p>

//             {/* Order Details Card */}
//             <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 mb-6 border border-primary/20">
//               <div className="flex items-center justify-center gap-2 mb-3">
//                 <Receipt className="w-5 h-5 text-primary" />
//                 <span className="text-sm font-semibold text-primary uppercase tracking-wide">
//                   ORDER CONFIRMED
//                 </span>
//               </div>
//               <p className="text-2xl font-bold gradient-text mb-2">
//                 {orderId}
//               </p>
//               <p className="text-text-muted text-sm">
//                 A confirmation email has been sent to your registered email address.
//               </p>
//               <div className="mt-3 flex items-center justify-center gap-4">
//                 <span className="text-sm text-text-muted">
//                   Amount: <span className="font-bold gradient-text">₹{parseFloat(orderAmount).toLocaleString()}</span>
//                 </span>
//                 <span className="w-1 h-1 bg-border rounded-full"></span>
//                 <span className="text-sm text-text-muted">
//                   Est. Delivery: <span className="font-medium">5-7 days</span>
//                 </span>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="space-y-3">
//               <button
//                 onClick={() => navigate("/dashboard/myorder")}
//                 className="w-full btn btn-primary py-3 rounded-xl flex items-center justify-center gap-2"
//               >
//                 <Package size={18} />
//                 View Your Orders
//               </button>

//               <button
//                 onClick={handleDownloadReceipt}
//                 disabled={loading}
//                 className="w-full btn btn-secondary py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
//               >
//                 <Download size={18} />
//                 {loading ? "Generating Receipt..." : "Download Receipt"}
//               </button>

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleShareOrder}
//                   className="flex-1 btn btn-outline py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
//                 >
//                   <Share2 size={16} />
//                   Share Order
//                 </button>
                
//                 <button
//                   onClick={() => navigate("/")}
//                   className="flex-1 btn btn-outline py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm"
//                 >
//                   <Home size={16} />
//                   Continue Shopping
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* What's Next Section */}
//         <div className="mt-6 bg-card rounded-xl border border-border p-6">
//           <h3 className="font-semibold text-text mb-4 flex items-center gap-2">
//             <TrendingUp size={18} className="text-primary" />
//             What's Next?
//           </h3>
//           <ul className="space-y-3">
//             <li className="flex items-start gap-3 text-sm text-text-muted">
//               <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
//                 <Truck size={12} className="text-primary" />
//               </span>
//               Track your order in the "My Orders" section
//             </li>
//             <li className="flex items-start gap-3 text-sm text-text-muted">
//               <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
//                 <Mail size={12} className="text-primary" />
//               </span>
//               Check your email for order updates and delivery tracking
//             </li>
//             <li className="flex items-start gap-3 text-sm text-text-muted">
//               <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
//                 <Star size={12} className="text-primary" />
//               </span>
//               Rate products after receiving your order and earn loyalty points
//             </li>
//           </ul>
//         </div>

//         {/* Trust Badges */}
//         <div className="mt-6 grid grid-cols-3 gap-3">
//           <div className="text-center p-3 bg-card rounded-xl border border-border">
//             <Shield size={20} className="mx-auto text-primary mb-1" />
//             <p className="text-xs text-text-muted">Secure Payment</p>
//           </div>
//           <div className="text-center p-3 bg-card rounded-xl border border-border">
//             <Truck size={20} className="mx-auto text-primary mb-1" />
//             <p className="text-xs text-text-muted">Free Shipping</p>
//           </div>
//           <div className="text-center p-3 bg-card rounded-xl border border-border">
//             <Clock size={20} className="mx-auto text-primary mb-1" />
//             <p className="text-xs text-text-muted">24/7 Support</p>
//           </div>
//         </div>

//         {/* Auto-redirect */}
//         <div className="mt-6 text-center">
//           <p className="text-sm text-text-muted flex items-center justify-center gap-2">
//             <Clock size={14} />
//             Redirecting to orders page in 
//             <span className="font-bold text-primary">{secondsLeft}</span> 
//             seconds
//           </p>
//           <button
//             onClick={() => navigate("/dashboard/myorder")}
//             className="text-primary hover:underline text-sm mt-1 inline-flex items-center gap-1"
//           >
//             Go now
//             <ArrowRight size={14} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentSuccess;
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  CheckCircle, ShoppingBag, Home, Receipt, Download, 
  Share2, Clock, Truck, Shield, Mail, ArrowRight,
  Package, Star, TrendingUp
} from "lucide-react";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderId, setOrderId] = useState("");
  const [orderAmount, setOrderAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get("orderId") || 
               location.state?.orderId || 
               `ORD-${Date.now().toString().slice(-8)}`;
    const amount = queryParams.get("amount") || 
                   location.state?.amount || 
                   0;
    
    setOrderId(id);
    setOrderAmount(amount);

    localStorage.removeItem("cartItems");
    localStorage.removeItem("cart");

    const interval = setInterval(() => {
      setSecondsLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          navigate("/dashboard/myorder");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [location, navigate]);

  const handleDownloadReceipt = () => {
    setLoading(true);
    
    setTimeout(() => {
      const receiptContent = `
╔═══════════════════════════════════════════════════════════╗
║                      BUYZAAR RECEIPT                      ║
╠══════════════════════════════════════════════════════════╣
║  Order ID: ${orderId}
║  Date: ${new Date().toLocaleDateString()}
║  Time: ${new Date().toLocaleTimeString()}
║  Status: ✅ PAID
║  Amount: ₹${parseFloat(orderAmount).toLocaleString()}
╠═══════════════════════════════════════════════════════════╣
║  Thank you for shopping with BuyZaar!
║  Your order will be delivered within 5-7 business days.
╠═══════════════════════════════════════════════════════════╣
║  Need help? Contact: support@buyzaar.com
║  Phone: +91 63973 78896
╚═══════════════════════════════════════════════════════════╝
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
        title: "Order Confirmed - BuyZaar",
        text: `I just placed an order on BuyZaar! Order ID: ${orderId}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(orderId);
      alert("Order ID copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full mx-auto">
        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Header Gradient */}
          <div className="h-2 bg-gradient-to-r from-green-600 via-green-500 to-green-600"></div>
          
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-14 h-14 text-green-600" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-green-600/30 animate-ping opacity-30"></div>
            </div>

            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-500 mb-6">
              Thank you for your purchase
            </p>

            {/* Order Details Card */}
            <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl p-6 mb-6 border border-blue-200">
              <div className="flex items-center justify-center gap-2 mb-3">
                <Receipt className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                  ORDER CONFIRMED
                </span>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent mb-2">
                {orderId}
              </p>
              <p className="text-gray-500 text-sm">
                A confirmation email has been sent to your registered email address.
              </p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <span className="text-sm text-gray-500">
                  Amount: <span className="font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">₹{parseFloat(orderAmount).toLocaleString()}</span>
                </span>
                <span className="w-1 h-1 bg-gray-200 rounded-full"></span>
                <span className="text-sm text-gray-500">
                  Est. Delivery: <span className="font-medium">5-7 days</span>
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => navigate("/dashboard/myorder")}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition"
              >
                <Package size={18} />
                View Your Orders
              </button>

              <button
                onClick={handleDownloadReceipt}
                disabled={loading}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition disabled:opacity-50"
              >
                <Download size={18} />
                {loading ? "Generating Receipt..." : "Download Receipt"}
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleShareOrder}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:border-blue-600 hover:text-blue-600 transition"
                >
                  <Share2 size={16} />
                  Share Order
                </button>
                
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:border-blue-600 hover:text-blue-600 transition"
                >
                  <Home size={16} />
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next Section */}
        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-blue-600" />
            What's Next?
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Truck size={12} className="text-blue-600" />
              </span>
              Track your order in the "My Orders" section
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Mail size={12} className="text-blue-600" />
              </span>
              Check your email for order updates and delivery tracking
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Star size={12} className="text-blue-600" />
              </span>
              Rate products after receiving your order and earn loyalty points
            </li>
          </ul>
        </div>

        {/* Trust Badges */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
            <Shield size={20} className="mx-auto text-blue-600 mb-1" />
            <p className="text-xs text-gray-500">Secure Payment</p>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
            <Truck size={20} className="mx-auto text-blue-600 mb-1" />
            <p className="text-xs text-gray-500">Free Shipping</p>
          </div>
          <div className="text-center p-3 bg-white rounded-xl border border-gray-200">
            <Clock size={20} className="mx-auto text-blue-600 mb-1" />
            <p className="text-xs text-gray-500">24/7 Support</p>
          </div>
        </div>

        {/* Auto-redirect */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <Clock size={14} />
            Redirecting to orders page in 
            <span className="font-bold text-blue-600">{secondsLeft}</span> 
            seconds
          </p>
          <button
            onClick={() => navigate("/dashboard/myorder")}
            className="text-blue-600 hover:underline text-sm mt-1 inline-flex items-center gap-1"
          >
            Go now
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;