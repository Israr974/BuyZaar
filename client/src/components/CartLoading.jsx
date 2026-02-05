import React from "react";

const CartLoading = ({ count = 4, variant = "grid" }) => {
  const skeletons = Array.from({ length: count }, (_, i) => i);

  if (variant === "list") {
    return (
      <div className="space-y-4">
        {skeletons.map((i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-4 animate-pulse bg-white shadow-sm"
          >
            <div className="flex gap-4">

              
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg"></div>
              
              
              <div className="flex-1 space-y-3">

                
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                
                
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
                  </div>
                  <div className="flex items-center gap-3">
                    

                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
                    </div>
                   
                   
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "card") {
    return (
      <div className="border rounded-xl p-4 animate-pulse bg-white shadow-sm h-full">
        
        <div className="w-full aspect-square bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3"></div>
        
        
        <div className="space-y-2 mb-3">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
        </div>
        
      
        <div className="flex items-center gap-2 mb-3">
          <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
        </div>
        
        
        <div className="flex items-center gap-1 mb-4">
          <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
          <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-8"></div>
        </div>
        
        
        <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
      </div>
    );
  }

 
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
      {skeletons.map((i) => (
        <div
          key={i}
          className="border border-gray-200 rounded-xl p-4 animate-pulse bg-white shadow-sm hover:shadow-md transition-shadow h-full"
        >
        
          <div className="w-full h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3"></div>
          
          
          <div className="space-y-2 mb-3">
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-4/5"></div>
            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/5"></div>
          </div>
          
          
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-16"></div>
          </div>
          
          
          <div className="h-9 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
        </div>
      ))}
    </div>
  );
};


export const ShimmerEffect = () => (
  <div className="shimmer-wrapper">
    <div className="shimmer"></div>
  </div>
);


export const QuickLoadingCard = () => (
  <div className="border rounded-lg p-3 animate-pulse bg-white">
    <div className="w-full h-40 bg-gray-200 rounded-md mb-2"></div>
    <div className="h-3 bg-gray-200 rounded mb-1"></div>
    <div className="h-3 bg-gray-200 rounded w-2/3 mb-2"></div>
    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
  </div>
);


export const CartPageLoading = () => (
  <div className="max-w-7xl mx-auto px-4 py-8">
   
    <div className="mb-8">
      <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-48 mb-4"></div>
      <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 max-w-md"></div>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     
     
      <div className="lg:col-span-2 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-xl p-4 animate-pulse bg-white">
            <div className="flex gap-4">
              <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg flex-shrink-0"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
                      <div className="w-6 h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
                    </div>
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      
      
      <div className="lg:col-span-1">
        <div className="border rounded-xl p-6 animate-pulse bg-white sticky top-24">
          <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-40 mb-6"></div>
          
          <div className="space-y-4 mb-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20"></div>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between mb-6">
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-24"></div>
              <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-28"></div>
            </div>
            
            <div className="h-11 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md mb-4"></div>
            <div className="h-10 bg-gradient-to-r from-gray-200 to-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default CartLoading;