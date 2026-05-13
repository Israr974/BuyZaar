import React from "react";

const BrandStrip = () => {
  const brands = [
    { name: "Nike", logo: "https://via.placeholder.com/100x40?text=Nike" },
    { name: "Adidas", logo: "https://via.placeholder.com/100x40?text=Adidas" },
    { name: "Puma", logo: "https://via.placeholder.com/100x40?text=Puma" },
    { name: "Zara", logo: "https://via.placeholder.com/100x40?text=Zara" },
    { name: "H&M", logo: "https://via.placeholder.com/100x40?text=HM" },
    { name: "Apple", logo: "https://via.placeholder.com/100x40?text=Apple" },
  ];

  return (
    <div className="py-8 bg-gray-50 border-y border-gray-100">
      <div className="container mx-auto px-4">
        <h3 className="text-center text-gray-400 text-xs uppercase tracking-wider mb-6">
          Trusted By Leading Brands
        </h3>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
          {brands.map((brand, index) => (
            <div key={index} className="text-gray-400 font-semibold text-lg md:text-xl">
              {brand.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BrandStrip;