import React from "react";
import useMobile from "../hooks/useMobile";

const BrandsSection = () => {
  const brands = ["Apple", "Samsung", "Nike", "Adidas", "Sony", "Puma"];
  const isMobile = useMobile(768);

  return (
    <div className="py-4 md:py-6 lg:py-8">
      <div className="text-center mb-4 md:mb-6 lg:mb-8">
        <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
          Top Brands
        </h2>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Trusted by leading global brands
        </p>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {brands.map((brand, index) => (
          <div
            key={index}
            className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl h-16 sm:h-20 md:h-24 flex items-center justify-center shadow-sm border border-gray-100 hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group"
          >
            <h3 className={`font-bold text-gray-700 group-hover:text-blue-600 transition-colors ${
              isMobile ? 'text-sm' : 'text-base md:text-lg lg:text-xl'
            }`}>
              {brand}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandsSection;