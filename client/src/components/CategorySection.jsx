import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { validateUrlConverter } from "../utils/validateUrl";
import useMobile from "../hooks/useMobile";

const CategorySection = ({ categories, loading }) => {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(10);
  const isMobile = useMobile(768);

  const redirectToCategory = (categoryId, categoryName) => {
    const slug = validateUrlConverter(categoryName);
    navigate(`/${slug}-${categoryId}/all-all`);
  };

  const loadMore = () => setVisibleCount(prev => prev + 10);
  const showLess = () => setVisibleCount(10);

  const hasMore = visibleCount < categories.length;
  const hasVisible = visibleCount > 10;

  if (loading) {
    return (
      <div className="py-4 md:py-5">
        <div className="mb-3 md:mb-4">
          <div className="h-6 w-28 bg-gray-200 rounded animate-pulse mb-1"></div>
          <div className="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {[1,2,3,4,5,6,7,8,9,10].map(i => (
            <div key={i} className="rounded-xl bg-gray-200 animate-pulse aspect-square"></div>
          ))}
        </div>
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <div className="py-4 md:py-5">
      
      <div className="mb-4 md:mb-5">
        <h2 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-xl'}`}>
          Shop By Category
        </h2>
        <p className={`text-gray-500 mt-0.5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Explore {categories.length} premium collections
        </p>
      </div>

      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
        {categories.slice(0, visibleCount).map((category) => (
          <div
            key={category._id}
            onClick={() => redirectToCategory(category._id, category.name)}
            className="group cursor-pointer text-center"
          >
          
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 shadow-md group-hover:shadow-xl transition-all duration-300 aspect-square">
              <img
                src={category.image || "/placeholder.png"}
                alt={category.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                onError={(e) => e.target.src = "/placeholder.png"}
              />
              
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition duration-300"></div>
            </div>
            
            <h3 className={`font-semibold text-gray-800 mt-2 line-clamp-1 ${
              isMobile ? 'text-xs' : 'text-sm'
            }`}>
              {category.name}
            </h3>
            
            {category.productCount && (
              <p className={`text-gray-400 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
                {category.productCount} items
              </p>
            )}
          </div>
        ))}
      </div>

      
      {(hasMore || hasVisible) && (
        <div className="flex justify-center gap-3 mt-6 md:mt-8">
          {hasMore && (
            <button 
              onClick={loadMore} 
              className={`px-4 py-2 bg-blue-600 text-white rounded-lg font-medium transition hover:bg-blue-700 hover:shadow-md ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
            >
              Load More
            </button>
          )}
          {hasVisible && (
            <button 
              onClick={showLess} 
              className={`px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium transition hover:bg-gray-300 ${
                isMobile ? 'text-xs' : 'text-sm'
              }`}
            >
              Show Less
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySection;