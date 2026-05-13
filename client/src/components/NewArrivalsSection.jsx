import React from "react";
import { Sparkles } from "lucide-react";
import ProductCard from "./ProductCard";
import useMobile from "../hooks/useMobile";

const NewArrivalsSection = ({ products }) => {
  const isMobile = useMobile(768);

  if (!products || products.length === 0) {
    return null;
  }

  const newestProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10);

  return (
    <div className="py-4 md:py-6 lg:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6 lg:mb-8">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className={`${isMobile ? 'w-8 h-8' : 'w-10 h-10 md:w-12 md:h-12'} rounded-xl md:rounded-2xl bg-violet-100 flex items-center justify-center`}>
            <Sparkles className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5 md:w-6 md:h-6'} text-violet-600`} />
          </div>
          <div>
            <h2 className={`font-black tracking-tight text-gray-900 ${isMobile ? 'text-lg' : 'text-xl sm:text-2xl md:text-3xl'}`}>
              New Arrivals
            </h2>
            <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm md:text-base'}`}>
              Fresh products added recently • {newestProducts.length} new items
            </p>
          </div>
        </div>

        {products.length > 10 && (
          <button 
            onClick={() => window.location.href = "/products?sort=newest"}
            className={`px-3 py-1.5 border border-violet-600 text-violet-600 rounded-lg font-medium transition hover:bg-violet-600 hover:text-white ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}
          >
            View All ({products.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {newestProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default NewArrivalsSection;