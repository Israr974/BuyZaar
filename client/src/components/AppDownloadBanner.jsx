import React from "react";
import useMobile from "../hooks/useMobile";

const AppDownloadBanner = () => {
  const isMobile = useMobile(768);

  return (
    <div className="py-4 md:py-6 lg:py-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 shadow-lg">
        
        <div className="absolute top-0 left-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-32 sm:w-48 h-32 sm:h-48 bg-white/5 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 px-4 sm:px-6 md:px-8 py-6 md:py-8 lg:py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-5 md:gap-8 lg:gap-10">
            
            <div className="text-white text-center md:text-left">
              <span className="inline-block bg-white/20 backdrop-blur-xl px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold mb-3 sm:mb-4">
                BuyZaar Mobile App
              </span>
              
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-2 sm:mb-3">
                Shop Anywhere<br className="hidden sm:block" /> Anytime
              </h2>
              
              <p className="text-xs sm:text-sm text-white/90 mb-5 sm:mb-6 max-w-md mx-auto md:mx-0">
                Download our app for faster shopping, exclusive offers, and personalized recommendations.
              </p>
              
            
              <div className="flex flex-wrap justify-center md:justify-start gap-2 sm:gap-3">
                <button className="bg-black text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium text-[11px] sm:text-sm hover:scale-105 transition shadow-lg flex items-center gap-1.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zM14.5 12.707l5.182 5.182-8.5 4.5 3.318-9.682zM16.5 5.5l-8.5 4.5 5.182-5.182 3.318 9.682z"/>
                  </svg>
                  <span className="hidden xs:inline">Google Play</span>
                  <span className="xs:hidden">Play</span>
                </button>
                
                <button className="bg-white text-gray-900 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl font-medium text-[11px] sm:text-sm hover:scale-105 transition shadow-lg flex items-center gap-1.5">
                  <svg className="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 15.36 5.2 11 7.5 10.61c1.33-.2 2.59.89 3.41.89.82 0 2.35-1.1 3.96-.94.67.03 2.56-.28 3.77 2.12-.16.09-2.21 1.29-2.19 3.85.03 3.11 2.74 4.17 2.76 4.18.01.01.08.03.2.09-.09.29-.36.97-.83 1.79-.41.71-.83 1.42-1.47 1.42-.64 0-.84-.37-1.65-.37-.81 0-1.09.38-1.76.38zm-2.28-12.9c.78-.94.67-2.28-.29-3.12-.77-.67-2.02-.68-2.96-.14-.79.45-1.2 1.52-1.02 2.54.18 1.01.97 1.94 1.95 2.16.79.18 1.62-.06 2.32-.44z"/>
                  </svg>
                  <span className="hidden xs:inline">App Store</span>
                  <span className="xs:hidden">Store</span>
                </button>
              </div>
            </div>
            
            
            <div className="flex justify-center mt-4 md:mt-0">
              <div className="relative">
              
                <div className="absolute -inset-2 bg-white/20 rounded-3xl blur-xl opacity-50"></div>
                <img
                  src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=400&auto=format&fit=crop"
                  alt="BuyZaar mobile app"
                  className="relative w-36 xs:w-44 sm:w-48 md:w-52 lg:w-56 rounded-2xl shadow-2xl border-4 border-white/20 hover:scale-105 transition duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
        
        
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white/30 via-white/50 to-white/30"></div>
      </div>
    </div>
  );
};

export default AppDownloadBanner;