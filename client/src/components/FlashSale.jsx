import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Flame, Star, ShoppingBag, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import useMobile from "../hooks/useMobile";

const FlashSale = ({ products, loading, title = "Flash Sale", subtitle = "Limited time offers" }) => {
  const navigate = useNavigate();
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [isMobile] = useMobile(768);

  const handleBuyNow = (productId) => navigate(`/product/${productId}`);
  const toggleShowAll = () => setShowAllProducts(!showAllProducts);

  const filteredProducts = products.filter(p => (p.discount || 0) >= 40);
  
  const displayedProducts = showAllProducts 
    ? filteredProducts 
    : filteredProducts.slice(0, isMobile ? 4 : 5);

  if (loading) {
    return (
      <div className="py-4 md:py-6">
        <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 p-4 md:p-6 lg:p-8 shadow-xl">
          <div className="animate-pulse space-y-3 md:space-y-4">
            <div className="h-5 md:h-6 bg-white/20 rounded w-24 md:w-32"></div>
            <div className="h-6 md:h-8 bg-white/20 rounded w-36 md:w-48"></div>
            <div className="h-3 md:h-4 bg-white/20 rounded w-48 md:w-64"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!products?.length) return null;

  return (
    <div className="py-4 md:py-6">
      <div className="rounded-2xl overflow-hidden bg-gradient-to-r from-red-500 via-orange-500 to-pink-500 p-3 sm:p-4 md:p-6 lg:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4 mb-4 md:mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xl px-2 md:px-3 py-1 md:py-1.5 rounded-full text-white font-semibold text-[10px] md:text-sm mb-2 md:mb-3">
              <Flame size={isMobile ? 12 : 14} />
              {title}
            </div>
            <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-0.5 md:mb-1">
              {isMobile ? "Hot Deals" : "Discount Deals"}
            </h2>
            <p className="text-white/70 md:text-white/80 text-[10px] md:text-xs lg:text-sm">
              {isMobile ? "Up to 40% off" : subtitle}
            </p>
          </div>
          
          {!showAllProducts && filteredProducts.length > (isMobile ? 4 : 5) && (
            <div className="text-white/80 text-xs md:text-sm">
              Showing {isMobile ? 4 : 5} of {filteredProducts.length} deals
            </div>
          )}
        </div>

        <div className={`grid gap-2 sm:gap-3 md:gap-4 ${
          isMobile 
            ? "grid-cols-2" 
            : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
        }`}>
          {displayedProducts.map((product) => {
            const discountPercent = product.discount || 0;
            const discountedPrice = calculateDiscountedPrice(product.price, discountPercent);
            
            return (
              <div key={product._id} className="bg-white rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className={`w-full object-cover cursor-pointer transition duration-500 group-hover:scale-110 ${
                      isMobile ? "h-28 sm:h-32" : "h-32 sm:h-36 md:h-40"
                    }`}
                    onClick={() => handleBuyNow(product._id)}
                  />
                  {discountPercent >= 40 && (
                    <span className={`absolute top-1 left-1 md:top-2 md:left-2 bg-red-500 text-white font-bold rounded-full shadow-md ${
                      isMobile 
                        ? "text-[8px] px-1 py-0.5" 
                        : "text-[10px] md:text-xs px-1.5 py-0.5"
                    }`}>
                      -{discountPercent}%
                    </span>
                  )}
                </div>
                <div className={`${isMobile ? "p-1.5" : "p-2 md:p-3"}`}>
                  <h3 
                    className={`font-semibold text-gray-800 hover:text-red-500 cursor-pointer transition-colors ${
                      isMobile 
                        ? "text-[10px] sm:text-xs line-clamp-2 min-h-[28px]" 
                        : "text-xs md:text-sm line-clamp-2 min-h-[32px]"
                    }`}
                    onClick={() => handleBuyNow(product._id)}
                  >
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mt-1">
                    <Star size={isMobile ? 10 : 12} className="fill-yellow-400 text-yellow-400" />
                    <span className={`${isMobile ? "text-[9px]" : "text-xs"} font-medium text-gray-600`}>
                      {product.rating || 4.5}
                    </span>
                    <span className={`${isMobile ? "text-[8px]" : "text-[10px]"} text-gray-400`}>
                      ({product.reviewCount || 100})
                    </span>
                  </div>
                  
                  <div className={`${isMobile ? "mt-1" : "mt-1.5 md:mt-2"}`}>
                    <span className={`font-bold text-red-500 ${
                      isMobile ? "text-xs" : "text-sm md:text-base"
                    }`}>
                      {formatPrice(discountedPrice)}
                    </span>
                    {discountPercent > 0 && (
                      <span className={`text-gray-400 line-through ml-1 ${
                        isMobile ? "text-[8px]" : "text-[10px] md:text-xs"
                      }`}>
                        {formatPrice(product.price)}
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => handleBuyNow(product._id)}
                    className={`w-full mt-1.5 md:mt-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg font-semibold hover:opacity-90 transition flex items-center justify-center gap-0.5 md:gap-1 shadow-md ${
                      isMobile 
                        ? "py-1 text-[9px] md:text-[10px]" 
                        : "py-1.5 md:py-2 text-[10px] md:text-xs"
                    }`}
                  >
                    <ShoppingBag size={isMobile ? 10 : 12} />
                    <span>{isMobile ? "Buy" : "Buy Now"}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length > (isMobile ? 4 : 5) && (
          <div className="text-center mt-4 md:mt-6">
            <button 
              onClick={toggleShowAll}
              className={`inline-flex items-center gap-2 text-white font-medium transition-all ${
                isMobile 
                  ? "text-sm px-4 py-2 bg-white/20 backdrop-blur-xl rounded-xl w-full justify-center" 
                  : "text-sm md:text-base hover:gap-3"
              }`}
            >
              {showAllProducts ? (
                <>
                  <ChevronUp size={isMobile ? 16 : 18} />
                  Show Less
                </>
              ) : (
                <>
                  Load More ({filteredProducts.length - (isMobile ? 4 : 5)} more)
                  <ChevronDown size={isMobile ? 16 : 18} />
                </>
              )}
            </button>
          </div>
        )}

        {showAllProducts && (
          <div className="text-center mt-3 text-white/60 text-[10px] md:text-xs">
            Showing all {filteredProducts.length} discount deals
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashSale;