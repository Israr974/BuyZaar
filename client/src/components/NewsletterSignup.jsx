import React, { useState } from "react";
import { Mail, Send, Sparkles, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import useMobile from "../hooks/useMobile";

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const isMobile = useMobile(768);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { 
      toast.error("Please enter your email"); 
      return; 
    }
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      toast.success("Subscribed successfully!");
      setEmail("");
    } catch (error) { 
      toast.error("Something went wrong",error); 
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="py-4 md:py-6 lg:py-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg">
        <div className="absolute -top-16 -left-16 w-32 sm:w-40 h-32 sm:h-40 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 -right-16 w-32 sm:w-40 h-32 sm:h-40 bg-pink-400/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 px-3 sm:px-5 md:px-6 py-5 md:py-7 lg:py-8">
          <div className="max-w-2xl mx-auto text-center text-white">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center">
              <Mail className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2">
              Get 20% Off Your First Order
            </h2>

            <p className="text-white/85 text-xs sm:text-sm max-w-md mx-auto mb-3 sm:mb-4 md:mb-5">
              Subscribe for exclusive deals, latest arrivals, and flash sale alerts
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <div className="relative flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                  className="w-full h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={isMobile ? 12 : 14} />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="h-9 sm:h-10 px-3 sm:px-4 rounded-xl bg-white text-purple-600 font-medium text-xs sm:text-sm hover:scale-105 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-1 whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Subscribing...</span>
                    <span className="sm:hidden">Wait...</span>
                  </span>
                ) : (
                  <>
                    <span className="hidden sm:inline">Subscribe</span>
                    <span className="sm:hidden">Sub</span>
                    <Send size={isMobile ? 10 : 12} />
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 text-[10px] sm:text-xs text-white/80">
              <div className="flex items-center gap-0.5 sm:gap-1">
                <ShieldCheck size={isMobile ? 10 : 12} /> 
                <span>No spam</span>
              </div>
              <div className="w-0.5 h-0.5 bg-white/50 rounded-full hidden xs:block"></div>
              <div>Unsubscribe anytime</div>
              <div className="w-0.5 h-0.5 bg-white/50 rounded-full hidden xs:block"></div>
              <div>Weekly offers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsletterSignup;