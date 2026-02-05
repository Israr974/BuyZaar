import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { XCircle, AlertTriangle, RotateCcw, Home, CreditCard, HelpCircle } from "lucide-react";

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

    
    if (window.gtag) {
      window.gtag('event', 'payment_failed', {
        error_code: code,
        error_message: error,
        retry_count: storedRetries
      });
    }

   
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
    
    
    window.open(`mailto:support@example.com?subject=${subject}&body=${body}`, '_blank');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <div className="max-w-lg w-full mx-auto p-8 bg-white shadow-2xl rounded-2xl text-center transform transition-all duration-300">
        
      
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>
            <div className="absolute -top-2 -right-2">
              <AlertTriangle className="w-8 h-8 text-amber-500 animate-bounce" />
            </div>
          </div>
        </div>

       
        <h1 className="text-4xl font-bold text-gray-800 mb-3">
          Payment Failed
        </h1>
        
        <div className="mb-6">
          <div className="inline-block bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full mb-3">
            Error: {errorCode}
          </div>
          <p className="text-lg text-gray-600 mb-4">{errorMessage}</p>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-left">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Details:</span> {getErrorDetails()}
            </p>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500">
                Retry attempts: {retryCount} of 3
              </p>
            )}
          </div>
        </div>

        
        <div className="space-y-4">
          <button
            onClick={handleRetry}
            disabled={isRetrying || retryCount >= 3}
            className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-xl hover:from-red-700 hover:to-rose-700 transition-all duration-300 flex items-center justify-center gap-3 font-medium text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetrying ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Retrying...
              </>
            ) : (
              <>
                <RotateCcw className="w-5 h-5" />
                {retryCount >= 3 ? "Max Retries Reached" : "Try Payment Again"}
              </>
            )}
          </button>

          <button
            onClick={handleTryDifferentMethod}
            className="w-full border-2 border-blue-600 text-blue-700 px-6 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-3 font-medium"
          >
            <CreditCard className="w-5 h-5" />
            Try Different Payment Method
          </button>

          <div className="flex gap-4">
            <button
              onClick={handleContactSupport}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <HelpCircle className="w-5 h-5" />
              Contact Support
            </button>
            
            <button
              onClick={() => navigate("/")}
              className="flex-1 border border-gray-300 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Home
            </button>
          </div>
        </div>

        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Troubleshooting Tips
          </h3>
          <ul className="text-sm text-gray-600 space-y-2 text-left">
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
              Verify your card details are correct and up-to-date
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
              Ensure you have sufficient funds in your account
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
              Check if your card is enabled for online transactions
            </li>
            <li className="flex items-start gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-2"></span>
              Try using a different browser or device
            </li>
          </ul>
        </div>

       
        <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-blue-700">
            🔒 <span className="font-semibold">Security Note:</span> Your payment information was not saved. All transactions are encrypted and secure.
          </p>
        </div>

       
        {retryCount < 3 && location.state?.autoRetry && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Auto-retry in 5 seconds... <button onClick={handleRetry} className="text-blue-600 hover:text-blue-800 underline ml-2">Retry now</button></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentFail;