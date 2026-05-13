import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CardProduct from "./CardProduct";
import SkeletonLoader from "./SkeletonLoader";

const ProductRow = ({ title, products, loading = false, viewAllLink = null }) => {
  const sliderRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-[220px] flex-shrink-0">
              <SkeletonLoader type="product" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) return null;

  return (
    <div className="mb-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
            View All
          </a>
        )}
      </div>

      <div className="relative group">
        <div
          ref={sliderRef}
          className="flex overflow-x-auto gap-5 pb-4 hide-scrollbar scroll-smooth"
        >
          {products.map((product) => (
            <div key={product._id} className="w-[220px] md:w-[250px] flex-shrink-0">
              <CardProduct product={product} />
            </div>
          ))}
        </div>

        {products.length > 4 && (
          <>
            <button
              onClick={() => scroll("left")}
              className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductRow;