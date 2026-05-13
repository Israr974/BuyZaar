import React, { useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import useMobile from "../hooks/useMobile";

const BestSellersSection = ({ products }) => {
  const isMobile = useMobile(768);
  const [showAll, setShowAll] = useState(false);
  
  const displayedProducts = showAll ? products : products.slice(0, 5);
  const hasMore = products.length > 5;

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="py-4 md:py-6 lg:py-8">
      <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 shadow-xl">
        
        <div className="absolute top-0 right-0 w-32 sm:w-48 md:w-72 h-32 sm:h-48 md:h-72 bg-orange-500/20 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-24 sm:w-32 h-24 sm:h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
        
        <div className="relative z-10 p-4 sm:p-6 md:p-8 lg:p-10">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="text-center sm:text-left">
              <h2 className={`font-black text-white ${isMobile ? 'text-2xl' : 'text-3xl md:text-4xl'} mb-2`}>
                Best Sellers
              </h2>
              <p className={`text-slate-300 ${isMobile ? 'text-sm' : 'text-base md:text-lg'}`}>
                Most popular products loved by customers • {products.length} items
              </p>
            </div>
            
            {!showAll && hasMore ? (
              <button
                onClick={() => setShowAll(true)}
                className={`inline-flex items-center justify-center bg-white text-slate-900 font-bold rounded-xl transition hover:scale-105 hover:shadow-lg ${
                  isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base md:text-lg'
                }`}
              >
                View All ({products.length})
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              showAll && (
                <button
                  onClick={() => setShowAll(false)}
                  className={`inline-flex items-center justify-center bg-gray-200 text-gray-800 font-bold rounded-xl transition hover:bg-gray-300 ${
                    isMobile ? 'px-4 py-2 text-sm' : 'px-6 py-3 text-base md:text-lg'
                  }`}
                >
                  Show Less
                </button>
              )
            )}
          </div>
          
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
            {displayedProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
          
        
          {hasMore && !showAll && (
            <div className="flex justify-center mt-6 md:mt-8">
              <button
                onClick={() => setShowAll(true)}
                className="px-6 py-2 bg-white/20 backdrop-blur text-white rounded-lg font-medium hover:bg-white/30 transition"
              >
                Load More ({products.length - 5} more)
              </button>
            </div>
          )}
        </div>
        
      
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500/50 via-orange-500 to-orange-500/50"></div>
      </div>
    </div>
  );
};

export default BestSellersSection;