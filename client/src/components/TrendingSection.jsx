import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import ProductCard from "./ProductCard";
import useMobile from "../hooks/useMobile";

const TrendingSection = ({ products, loading = false, initialLimit = 10 }) => {
  const isMobile = useMobile(768);
  const [showAll, setShowAll] = useState(false);

  const displayedProducts = showAll ? products : products.slice(0, initialLimit);
  const hasMore = products.length > initialLimit;

  if (loading) {
    return (
      <div className="py-4 md:py-6 lg:py-8">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-xl animate-pulse"></div>
          <div className="flex-1">
            <div className="h-5 sm:h-6 w-32 sm:w-40 bg-gray-200 rounded animate-pulse mb-1"></div>
            <div className="h-3 sm:h-4 w-40 sm:w-56 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="h-56 sm:h-64 bg-gray-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!products?.length) return null;

  return (
    <div className="py-4 md:py-6 lg:py-8">
      <div className="flex items-center gap-2 sm:gap-3 mb-4 md:mb-6 lg:mb-8">
        <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'} rounded-xl md:rounded-2xl bg-blue-100 flex items-center justify-center`}>
          <TrendingUp size={isMobile ? 18 : 20} className="text-blue-600" />
        </div>
        <div>
          <h2 className={`font-black tracking-tight text-gray-900 ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl md:text-3xl'}`}>
            Trending Products
          </h2>
          <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm md:text-base'}`}>
            Highest rated products by our customers
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {displayedProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center mt-6 md:mt-8">
          <button
            onClick={() => setShowAll(!showAll)}
            className={`px-6 py-2 rounded-lg font-medium transition ${
              showAll 
                ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } ${isMobile ? 'text-xs' : 'text-sm'}`}
          >
            {showAll ? "Show Less" : `Load More (${products.length - initialLimit} more)`}
          </button>
        </div>
      )}

      {!showAll && hasMore && (
        <p className="text-center text-gray-400 text-xs mt-3">
          Showing {initialLimit} of {products.length} products
        </p>
      )}
    </div>
  );
};

export default TrendingSection;