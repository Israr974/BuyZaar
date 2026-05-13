import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, Eye, ChevronLeft, ChevronRight, TrendingUp, Sparkles, X } from "lucide-react";
import useRecentlyViewed from "../hooks/useRecentlyViewed";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import useMobile from "../hooks/useMobile";
import { Star, StarHalf } from "lucide-react";

const RecentlyViewed = ({ maxItems = 6, showScrollButtons = true }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const scrollContainerRef = React.useRef(null);
  const isMobile = useMobile(768);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftScroll(scrollLeft > 20);
      setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 20);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container && showScrollButtons && recentlyViewed.length > 0) {
      setTimeout(checkScrollPosition, 100);
      container.addEventListener('scroll', checkScrollPosition);
      window.addEventListener('resize', checkScrollPosition);
      return () => {
        container.removeEventListener('scroll', checkScrollPosition);
        window.removeEventListener('resize', checkScrollPosition);
      };
    }
  }, [recentlyViewed, showScrollButtons]);

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = isMobile ? 200 : 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const handleViewAll = () => {
    setShowAllProducts(true);
    
    document.body.style.overflow = 'hidden';
  };

  const handleCloseModal = () => {
    setShowAllProducts(false);
    document.body.style.overflow = 'auto';
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  const displayedProducts = recentlyViewed.slice(0, maxItems);

  return (
    <>
      <div className="mt-6 sm:mt-8 md:mt-12 lg:mt-16 px-2 sm:px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className={`${isMobile ? 'w-0.5 h-5' : 'w-1 h-6 md:h-8'} rounded-full bg-gradient-to-b from-blue-600 to-orange-500`}></div>
            <div>
              <h2 className={`font-bold text-gray-800 flex items-center gap-1.5 sm:gap-2 ${isMobile ? 'text-base' : 'text-xl md:text-2xl'}`}>
                Recently Viewed
                <TrendingUp size={isMobile ? 14 : 18} className="text-blue-500" />
              </h2>
              <p className={`text-gray-500 ${isMobile ? 'text-[10px]' : 'text-xs md:text-sm'} mt-0.5`}>
                Products you've been looking at
              </p>
            </div>
            <Clock size={isMobile ? 14 : 18} className="text-gray-400 hidden sm:block" />
          </div>
          
          <button
            onClick={clearRecentlyViewed}
            className={`text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1 rounded-lg hover:bg-red-50 self-start sm:self-auto ${
              isMobile ? 'text-[11px] px-2 py-1' : 'text-sm px-3 py-1.5'
            }`}
          >
            <Trash2 size={isMobile ? 12 : 14} />
            Clear History
          </button>
        </div>

        <div className="relative">
          {!isMobile && showScrollButtons && showLeftScroll && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Scroll left"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <div
            ref={scrollContainerRef}
            className={`${showScrollButtons ? 'overflow-x-auto scroll-smooth' : ''}`}
            style={showScrollButtons ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
          >
            <div className={`${showScrollButtons ? 'flex gap-2 sm:gap-3 md:gap-4' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4'}`}>
              {displayedProducts.map((product) => {
                const originalPrice = product.price || 0;
                const discount = product.discount || 0;
                const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
                const hasDiscount = discount > 0;

                return (
                  <Link
                    key={product._id}
                    to={`/product/${product.name?.toLowerCase().replace(/\s+/g, "-")}-${product._id}`}
                    className={`group bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                      showScrollButtons 
                        ? isMobile 
                          ? 'w-[140px] sm:w-[180px] flex-shrink-0' 
                          : 'w-[180px] sm:w-[220px] flex-shrink-0'
                        : ''
                    }`}
                  >
                    <div className="relative aspect-square overflow-hidden bg-gray-100">
                      <img
                        src={product.image?.[0] || "/placeholder.png"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Eye size={isMobile ? 16 : 24} className="text-white" />
                        <span className={`text-white ${isMobile ? 'text-[10px]' : 'text-xs'} ml-1 sm:ml-2`}>View</span>
                      </div>
                      
                      {hasDiscount && (
                        <span className={`absolute top-1 left-1 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full shadow-md ${
                          isMobile ? 'text-[8px] px-1 py-0.5' : 'text-xs px-2 py-1'
                        }`}>
                          -{discount}%
                        </span>
                      )}
                    </div>
                    
                    <div className={`${isMobile ? 'p-1.5' : 'p-2 sm:p-3'}`}>
                      <h3 className={`font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors ${
                        isMobile ? 'text-[10px] sm:text-xs min-h-[28px]' : 'text-sm min-h-[40px]'
                      }`}>
                        {product.name}
                      </h3>
                      
                      <div className={`${isMobile ? 'mt-1' : 'mt-2'} flex items-center gap-1 flex-wrap`}>
                        <p className={`font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent ${
                          isMobile ? 'text-xs' : 'text-base'
                        }`}>
                          {formatPrice(discountedPrice)}
                        </p>
                        {hasDiscount && (
                          <p className={`text-gray-400 line-through ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                            {formatPrice(originalPrice)}
                          </p>
                        )}
                      </div>
                      
                      {hasDiscount && (
                        <div className={`${isMobile ? 'mt-0.5' : 'mt-1'} flex items-center gap-0.5`}>
                          <Sparkles size={isMobile ? 8 : 10} className="text-orange-500" />
                          <span className={`text-orange-600 ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                            Save {formatPrice(originalPrice - discountedPrice)}
                          </span>
                        </div>
                      )}
                      
                      <div className={`${isMobile ? 'mt-1' : 'mt-2'} flex items-center justify-between`}>
                        <p className={`text-gray-400 flex items-center gap-0.5 ${isMobile ? 'text-[8px]' : 'text-xs'}`}>
                          <Clock size={isMobile ? 8 : 10} />
                          <span className={isMobile ? 'hidden xs:inline' : 'inline'}>Recent</span>
                        </p>
                        {product.rating > 0 && (
                          <div className="flex items-center gap-0.5">
                            <span className={`font-medium text-gray-600 ${isMobile ? 'text-[8px]' : 'text-xs'}`}>{product.rating}</span>
                            <span className={`text-yellow-400 ${isMobile ? 'text-[8px]' : 'text-xs'}`}><Star size={12} className="fill-yellow-400 text-yellow-400" /></span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {!isMobile && showScrollButtons && showRightScroll && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all"
              aria-label="Scroll right"
            >
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {recentlyViewed.length > maxItems && (
          <div className="text-center mt-4 sm:mt-6">
            <button
              onClick={handleViewAll}
              className={`bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white inline-flex items-center gap-2 font-medium rounded-lg transition-all shadow-md hover:shadow-lg ${
                isMobile ? 'text-xs px-4 py-2' : 'text-sm px-6 py-2.5'
              }`}
            >
              <Eye size={isMobile ? 14 : 16} />
              View All ({recentlyViewed.length}) Recently Viewed Products
            </button>
          </div>
        )}
      </div>

      {showAllProducts && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto" 
          onClick={handleCloseModal}
        >
          <div 
            className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto" 
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white z-10 p-3 sm:p-4 border-b flex justify-between items-center">
              <div>
                <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Clock size={isMobile ? 16 : 20} className="text-blue-500" />
                  Recently Viewed Products
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  {recentlyViewed.length} product{recentlyViewed.length !== 1 ? 's' : ''} you've viewed recently
                </p>
              </div>
              <button 
                onClick={handleCloseModal} 
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={isMobile ? 18 : 22} />
              </button>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
                {recentlyViewed.map((product) => {
                  const originalPrice = product.price || 0;
                  const discount = product.discount || 0;
                  const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
                  const hasDiscount = discount > 0;

                  return (
                    <Link
                      key={product._id}
                      to={`/product/${product.name?.toLowerCase().replace(/\s+/g, "-")}-${product._id}`}
                      onClick={handleCloseModal}
                      className="group bg-white rounded-lg sm:rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="relative aspect-square overflow-hidden bg-gray-100">
                        <img
                          src={product.image?.[0] || "/placeholder.png"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Eye size={isMobile ? 18 : 22} className="text-white" />
                          <span className={`text-white ${isMobile ? 'text-[10px]' : 'text-xs'} ml-1`}>View Details</span>
                        </div>
                        
                        {hasDiscount && (
                          <span className={`absolute top-2 left-2 bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold rounded-full shadow-md ${
                            isMobile ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
                          }`}>
                            -{discount}%
                          </span>
                        )}
                      </div>
                      <div className={`${isMobile ? 'p-2' : 'p-3'}`}>
                        <h3 className={`font-medium text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors ${
                          isMobile ? 'text-xs' : 'text-sm'
                        }`}>
                          {product.name}
                        </h3>
                        
                        <div className={`${isMobile ? 'mt-1.5' : 'mt-2'} flex items-center gap-2 flex-wrap`}>
                          <p className={`font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent ${
                            isMobile ? 'text-sm' : 'text-lg'
                          }`}>
                            {formatPrice(discountedPrice)}
                          </p>
                          {hasDiscount && (
                            <p className={`text-gray-400 line-through ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                              {formatPrice(originalPrice)}
                            </p>
                          )}
                        </div>
                        
                        {hasDiscount && (
                          <div className={`${isMobile ? 'mt-1' : 'mt-1.5'} flex items-center gap-1`}>
                            <Sparkles size={isMobile ? 10 : 12} className="text-orange-500" />
                            <span className={`text-orange-600 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                              Save {formatPrice(originalPrice - discountedPrice)}
                            </span>
                          </div>
                        )}
                        
                        <div className={`${isMobile ? 'mt-1.5' : 'mt-2'} flex items-center justify-between`}>
                          <p className={`text-gray-400 flex items-center gap-1 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>
                            <Clock size={isMobile ? 10 : 12} />
                            Recently viewed
                          </p>
                          {product.rating > 0 && (
                            <div className="flex items-center gap-0.5">
                              <span className={`font-medium text-gray-600 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                                {product.rating}
                              </span>
                              <span className={`text-yellow-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}><Star size={12} className="fill-yellow-400 text-yellow-400" /></span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {recentlyViewed.length > 0 && (
                <div className="mt-6 pt-4 border-t text-center">
                  <button
                    onClick={() => {
                      clearRecentlyViewed();
                      handleCloseModal();
                    }}
                    className={`text-red-600 hover:text-red-700 inline-flex items-center gap-2 font-medium transition-colors ${
                      isMobile ? 'text-sm' : 'text-base'
                    }`}
                  >
                    <Trash2 size={isMobile ? 16 : 18} />
                    Clear All History
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
};

export default RecentlyViewed;