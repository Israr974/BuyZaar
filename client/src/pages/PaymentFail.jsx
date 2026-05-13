import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  XCircle, AlertTriangle, RotateCcw, Home, CreditCard, HelpCircle, 
  Shield, AlertCircle, ArrowRight, Mail, Phone, Clock, Lock
} from "lucide-react";

const PaymentFail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const error = queryParams.get("error") || location.state?.error || "Payment failed";
    const code = queryParams.get("code") || location.state?.code || "UNKNOWN_ERROR";
    
    setErrorMessage(error);
    setErrorCode(code);

    const storedRetries = sessionStorage.getItem("paymentRetryCount") || "0";
    setRetryCount(parseInt(storedRetries));

    if (retryCount < 3 && location.state?.autoRetry) {
      setTimeout(() => {
        handleRetry();
      }, 5000);
    }
  }, [location, retryCount]);

  const handleRetry = () => {
    setIsRetrying(true);
    
    const newRetryCount = retryCount + 1;
    sessionStorage.setItem("paymentRetryCount", newRetryCount.toString());
    
    setTimeout(() => {
      setIsRetrying(false);
      setRetryCount(newRetryCount);
      
      if (newRetryCount >= 3) {
        alert("Maximum retry attempts reached. Please try a different payment method.");
        return;
      }
      
      navigate("/checkout", {
        state: {
          retryAttempt: newRetryCount,
          previousError: errorCode
        }
      });
    }, 1500);
  };

  const handleContactSupport = () => {
    const subject = encodeURIComponent(`Payment Failed - Error: ${errorCode}`);
    const body = encodeURIComponent(`I encountered a payment error: ${errorMessage}\n\nOrder details: Please check order ID if available.`);
    window.open(`mailto:support@buyzaar.com?subject=${subject}&body=${body}`, '_blank');
  };

  const handleTryDifferentMethod = () => {
    navigate("/checkout", {
      state: {
        showPaymentMethods: true,
        skipFailedMethod: true
      }
    });
  };

  const getErrorDetails = () => {
    const commonErrors = {
      "INSUFFICIENT_FUNDS": "Your account has insufficient funds for this transaction.",
      "CARD_DECLINED": "Your card was declined by the bank. Please check with your bank.",
      "INVALID_CARD": "The card details entered are invalid. Please verify and try again.",
      "EXPIRED_CARD": "Your card has expired. Please use a different card.",
      "NETWORK_ERROR": "Network issue detected. Please check your connection.",
      "TIMEOUT": "Payment request timed out. Please try again.",
      "UNKNOWN_ERROR": "An unexpected error occurred. Please try again or contact support."
    };

    return commonErrors[errorCode] || "Please try again or contact support for assistance.";
  };

  const getErrorSuggestion = () => {
    const suggestions = {
      "INSUFFICIENT_FUNDS": "Try using a different card or payment method",
      "CARD_DECLINED": "Contact your bank to authorize online transactions",
      "INVALID_CARD": "Double-check your card number and expiry date",
      "EXPIRED_CARD": "Update your card details or use a different card",
      "NETWORK_ERROR": "Switch to a stable internet connection",
      "TIMEOUT": "Try again during off-peak hours"
    };
    return suggestions[errorCode] || "Contact our support team for assistance";
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-red-600 via-red-500 to-red-600"></div>         
          <div className="p-8 text-center">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-14 h-14 text-red-600" />
              </div>
              <div className="absolute -top-2 -right-2 animate-bounce">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h1>
            <p className="text-gray-500 mb-6">
              We couldn't process your payment
            </p>
            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-1.5 rounded-full text-sm font-medium mb-4">
              <AlertCircle size={14} />
              Error Code: {errorCode}
            </div>

            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 text-left mb-6">
              <p className="text-gray-800 font-medium mb-2">Error Message:</p>
              <p className="text-gray-500 text-sm mb-4">{errorMessage}</p>
              
              <div className="border-t border-gray-200 pt-4 mt-2">
                <p className="text-gray-800 font-medium mb-2">What happened?</p>
                <p className="text-gray-500 text-sm">{getErrorDetails()}</p>
              </div>

              {retryCount > 0 && (
                <div className="mt-4 pt-3 border-t border-gray-200">
                  <p className="text-sm text-yellow-600 flex items-center gap-2">
                    <AlertCircle size={14} />
                    Retry attempts: {retryCount} of 3
                  </p>
                </div>
              )}
            </div>

            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 mb-6">
              <p className="text-sm text-blue-700 font-medium mb-1"> Suggested Fix</p>
              <p className="text-sm text-gray-600">{getErrorSuggestion()}</p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleRetry}
                disabled={isRetrying || retryCount >= 3}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition"
              >
                {isRetrying ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Retrying...
                  </>
                ) : (
                  <>
                    <RotateCcw size={18} />
                    {retryCount >= 3 ? "Max Retries Reached" : "Try Payment Again"}
                  </>
                )}
              </button>

              <button
                onClick={handleTryDifferentMethod}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition"
              >
                <CreditCard size={18} />
                Try Different Payment Method
              </button>

              <div className="flex gap-3">
                <button
                  onClick={handleContactSupport}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:border-blue-600 hover:text-blue-600 transition"
                >
                  <HelpCircle size={16} />
                  Support
                </button>
                
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 border-2 border-gray-300 text-gray-700 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm hover:border-blue-600 hover:text-blue-600 transition"
                >
                  <Home size={16} />
                  Home
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Shield size={18} className="text-blue-600" />
            Troubleshooting Tips
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></span>
              Verify your card details are correct and up-to-date
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></span>
              Ensure you have sufficient funds in your account
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></span>
              Check if your card is enabled for online transactions
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></span>
              Try using a different browser or device
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-500">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full mt-1.5"></span>
              Clear your browser cache and cookies
            </li>
          </ul>
        </div>

        <div className="mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
          <div className="flex items-start gap-3">
            <Lock size={18} className="text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-700">Secure Transaction</p>
              <p className="text-xs text-gray-500">
                Your payment information was not saved. All transactions are encrypted and secure.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            Need immediate help? Call us at 
            <a href="tel:+916397378896" className="text-blue-600 hover:underline ml-1">
              +91 63973 78896
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Support available 24/7
            <Clock size={10} className="inline ml-1" />
          </p>
        </div>

        {retryCount < 3 && location.state?.autoRetry && (
          <div className="mt-4 text-center text-sm text-gray-500 animate-pulse">
            <p>Auto-retry in 5 seconds... 
              <button 
                onClick={handleRetry} 
                className="text-blue-600 hover:underline ml-2"
              >
                Retry now
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFail;