// // components/RecentlyViewed.jsx
// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Clock, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
// import useRecentlyViewed from "../hooks/useRecentlyViewed";

// const RecentlyViewed = ({ maxItems = 6, showScrollButtons = true }) => {
//   const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
//   const [showLeftScroll, setShowLeftScroll] = useState(false);
//   const [showRightScroll, setShowRightScroll] = useState(false);
//   const scrollContainerRef = React.useRef(null);

//   // Check scroll position for buttons
//   const checkScrollPosition = () => {
//     if (scrollContainerRef.current) {
//       const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
//       setShowLeftScroll(scrollLeft > 20);
//       setShowRightScroll(scrollLeft + clientWidth < scrollWidth - 20);
//     }
//   };

//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     if (container && showScrollButtons && recentlyViewed.length > 0) {
//       setTimeout(checkScrollPosition, 100);
//       container.addEventListener('scroll', checkScrollPosition);
//       window.addEventListener('resize', checkScrollPosition);
//       return () => {
//         container.removeEventListener('scroll', checkScrollPosition);
//         window.removeEventListener('resize', checkScrollPosition);
//       };
//     }
//   }, [recentlyViewed, showScrollButtons]);

//   const scroll = (direction) => {
//     if (scrollContainerRef.current) {
//       const scrollAmount = 300;
//       const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
//       scrollContainerRef.current.scrollTo({
//         left: newScrollLeft,
//         behavior: 'smooth'
//       });
//     }
//   };

//   if (recentlyViewed.length === 0) {
//     return null;
//   }

//   const displayedProducts = recentlyViewed.slice(0, maxItems);

//   return (
//     <div className="mt-12 md:mt-16 px-4 md:px-6 lg:px-8">
//       {/* Header Section */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
//         <div className="flex items-center gap-3">
//           <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//           <div>
//             <h2 className="text-xl md:text-2xl font-display font-bold text-text">
//               Recently Viewed
//             </h2>
//             <p className="text-xs md:text-sm text-text-muted mt-0.5">
//               Products you've been looking at
//             </p>
//           </div>
//           <Clock size={18} className="text-text-muted hidden sm:block" />
//         </div>
        
//         <button
//           onClick={clearRecentlyViewed}
//           className="text-sm text-text-muted hover:text-error transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-error/5 self-start sm:self-auto"
//         >
//           <Trash2 size={14} />
//           Clear History
//         </button>
//       </div>

//       {/* Products Grid / Scrollable Section */}
//       <div className="relative">
//         {/* Scroll Left Button */}
//         {showScrollButtons && showLeftScroll && (
//           <button
//             onClick={() => scroll('left')}
//             className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-card border border-border rounded-full p-2 shadow-lg hover:bg-primary hover:text-white transition-all"
//             aria-label="Scroll left"
//           >
//             <ChevronLeft size={20} />
//           </button>
//         )}

//         {/* Products Container */}
//         <div
//           ref={scrollContainerRef}
//           className={`${showScrollButtons ? 'overflow-x-auto scroll-smooth hide-scrollbar' : ''}`}
//           style={showScrollButtons ? { scrollbarWidth: 'none', msOverflowStyle: 'none' } : {}}
//         >
//           <div className={`${showScrollButtons ? 'flex gap-4' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'}`}>
//             {displayedProducts.map((product, index) => (
//               <Link
//                 key={product._id}
//                 to={`/product/${product.name?.toLowerCase().replace(/\s+/g, "-")}-${product._id}`}
//                 className={`group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
//                   showScrollButtons ? 'w-[180px] sm:w-[200px] flex-shrink-0' : ''
//                 }`}
//               >
//                 {/* Image Container */}
//                 <div className="relative aspect-square overflow-hidden bg-bg-alt">
//                   <img
//                     src={product.image?.[0] || "/placeholder.png"}
//                     alt={product.name}
//                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
//                     loading="lazy"
//                   />
//                   {/* Overlay on hover */}
//                   <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
//                     <Eye size={24} className="text-white" />
//                   </div>
//                 </div>
                
//                 {/* Product Info */}
//                 <div className="p-3">
//                   <h3 className="text-sm font-medium text-text line-clamp-2 min-h-[40px] group-hover:text-primary transition-colors">
//                     {product.name}
//                   </h3>
                  
//                   {/* Price Section */}
//                   <div className="mt-2 flex items-center gap-2 flex-wrap">
//                     <p className="text-sm font-bold gradient-text">
//                       ₹{product.price?.toLocaleString()}
//                     </p>
//                     {product.originalPrice && product.originalPrice > product.price && (
//                       <p className="text-xs text-text-muted line-through">
//                         ₹{product.originalPrice?.toLocaleString()}
//                       </p>
//                     )}
//                   </div>
                  
//                   {/* Discount Badge */}
//                   {product.discount > 0 && (
//                     <div className="mt-1">
//                       <span className="text-xs bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full">
//                         {product.discount <= 100 ? `${product.discount}% OFF` : `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
//                       </span>
//                     </div>
//                   )}
                  
//                   {/* Viewed time indicator */}
//                   <p className="text-xs text-text-muted mt-2 flex items-center gap-1">
//                     <Clock size={10} />
//                     Recently viewed
//                   </p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Scroll Right Button */}
//         {showScrollButtons && showRightScroll && (
//           <button
//             onClick={() => scroll('right')}
//             className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-card border border-border rounded-full p-2 shadow-lg hover:bg-primary hover:text-white transition-all"
//             aria-label="Scroll right"
//           >
//             <ChevronRight size={20} />
//           </button>
//         )}
//       </div>

//       {/* View All Link (if more products exist) */}
//       {recentlyViewed.length > maxItems && (
//         <div className="text-center mt-6">
//           <Link
//             to="/recently-viewed"
//             className="text-sm text-primary hover:underline inline-flex items-center gap-1"
//           >
//             View all ({recentlyViewed.length}) recently viewed products
//             <ChevronRight size={14} />
//           </Link>
//         </div>
//       )}

//       <style jsx>{`
//         .hide-scrollbar::-webkit-scrollbar {
//           display: none;
//         }
//         .hide-scrollbar {
//           -ms-overflow-style: none;
//           scrollbar-width: none;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default RecentlyViewed;

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Clock, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import useRecentlyViewed from "../hooks/useRecentlyViewed";

const RecentlyViewed = ({ maxItems = 6, showScrollButtons = true }) => {
  const { recentlyViewed, clearRecentlyViewed } = useRecentlyViewed();
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);
  const scrollContainerRef = React.useRef(null);

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
      const scrollAmount = 300;
      const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  if (recentlyViewed.length === 0) {
    return null;
  }

  const displayedProducts = recentlyViewed.slice(0, maxItems);

  return (
    <div className="mt-12 md:mt-16 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Recently Viewed
            </h2>
            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
              Products you've been looking at
            </p>
          </div>
          <Clock size={18} className="text-gray-500 hidden sm:block" />
        </div>
        
        <button
          onClick={clearRecentlyViewed}
          className="text-sm text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-red-50 self-start sm:self-auto"
        >
          <Trash2 size={14} />
          Clear History
        </button>
      </div>

      <div className="relative">
        {showScrollButtons && showLeftScroll && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
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
          <div className={`${showScrollButtons ? 'flex gap-4' : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4'}`}>
            {displayedProducts.map((product) => (
              <Link
                key={product._id}
                to={`/product/${product.name?.toLowerCase().replace(/\s+/g, "-")}-${product._id}`}
                className={`group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${
                  showScrollButtons ? 'w-[180px] sm:w-[200px] flex-shrink-0' : ''
                }`}
              >
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image?.[0] || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Eye size={24} className="text-white" />
                  </div>
                </div>
                
                <div className="p-3">
                  <h3 className="text-sm font-medium text-gray-800 line-clamp-2 min-h-[40px] group-hover:text-blue-600 transition-colors">
                    {product.name}
                  </h3>
                  
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      ₹{product.price?.toLocaleString()}
                    </p>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <p className="text-xs text-gray-500 line-through">
                        ₹{product.originalPrice?.toLocaleString()}
                      </p>
                    )}
                  </div>
                  
                  {product.discount > 0 && (
                    <div className="mt-1">
                      <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">
                        {product.discount <= 100 ? `${product.discount}% OFF` : `${Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF`}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Clock size={10} />
                    Recently viewed
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {showScrollButtons && showRightScroll && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-2 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
            aria-label="Scroll right"
          >
            <ChevronRight size={20} />
          </button>
        )}
      </div>

      {recentlyViewed.length > maxItems && (
        <div className="text-center mt-6">
          <Link
            to="/recently-viewed"
            className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1"
          >
            View all ({recentlyViewed.length}) recently viewed products
            <ChevronRight size={14} />
          </Link>
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
    </div>
  );
};

export default RecentlyViewed;