// import React from "react";

// const SkeletonLoader = ({ type = "product", count = 4 }) => {
//   const skeletons = Array(count).fill(null);

//   if (type === "product") {
//     return (
//       <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
//         {skeletons.map((_, i) => (
//           <div key={i} className="bg-card rounded-xl border border-border p-3 animate-pulse">
//             <div className="aspect-square bg-bg-alt rounded-lg mb-3"></div>
//             <div className="h-4 bg-bg-alt rounded w-3/4 mb-2"></div>
//             <div className="h-4 bg-bg-alt rounded w-1/2 mb-2"></div>
//             <div className="h-6 bg-bg-alt rounded w-2/3"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (type === "list") {
//     return (
//       <div className="space-y-3">
//         {skeletons.map((_, i) => (
//           <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
//             <div className="flex gap-4">
//               <div className="w-20 h-20 bg-bg-alt rounded-lg"></div>
//               <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-bg-alt rounded w-3/4"></div>
//                 <div className="h-3 bg-bg-alt rounded w-1/2"></div>
//                 <div className="h-5 bg-bg-alt rounded w-24"></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (type === "card") {
//     return (
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
//         {skeletons.map((_, i) => (
//           <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
//             <div className="h-40 bg-bg-alt rounded-lg mb-3"></div>
//             <div className="h-4 bg-bg-alt rounded w-3/4 mb-2"></div>
//             <div className="h-3 bg-bg-alt rounded w-1/2"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   return null;
// };

// export default SkeletonLoader;

import React from "react";

const SkeletonLoader = ({ type = "product", count = 4 }) => {
  const skeletons = Array(count).fill(null);

  const baseClass = "bg-card rounded-xl border border-border p-3 animate-pulse";
  const shimmerClass = "bg-gradient-to-r from-bg-alt via-border to-bg-alt bg-[length:200%_100%] animate-shimmer";

  if (type === "product") {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {skeletons.map((_, i) => (
          <div key={i} className={baseClass}>
            <div className={`aspect-square ${shimmerClass} rounded-lg mb-3`}></div>
            <div className={`h-4 ${shimmerClass} rounded w-3/4 mb-2`}></div>
            <div className={`h-4 ${shimmerClass} rounded w-1/2 mb-2`}></div>
            <div className={`h-6 ${shimmerClass} rounded w-2/3`}></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
            <div className="flex gap-4">
              <div className={`w-20 h-20 ${shimmerClass} rounded-lg`}></div>
              <div className="flex-1 space-y-2">
                <div className={`h-4 ${shimmerClass} rounded w-3/4`}></div>
                <div className={`h-3 ${shimmerClass} rounded w-1/2`}></div>
                <div className={`h-5 ${shimmerClass} rounded w-24`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "card") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {skeletons.map((_, i) => (
          <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
            <div className={`h-40 ${shimmerClass} rounded-lg mb-3`}></div>
            <div className={`h-4 ${shimmerClass} rounded w-3/4 mb-2`}></div>
            <div className={`h-3 ${shimmerClass} rounded w-1/2`}></div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default SkeletonLoader;