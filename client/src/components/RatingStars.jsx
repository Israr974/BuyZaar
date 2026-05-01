// import React from "react";
// import { Star, StarHalf } from "lucide-react";

// const RatingStars = ({ rating, size = 16, showValue = false }) => {
//   const fullStars = Math.floor(rating);
//   const hasHalfStar = rating % 1 >= 0.5;
//   const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

//   return (
//     <div className="flex items-center gap-1">
//       <div className="flex items-center gap-0.5">
//         {[...Array(fullStars)].map((_, i) => (
//           <Star key={`full-${i}`} size={size} className="fill-accent text-accent" />
//         ))}
//         {hasHalfStar && (
//           <StarHalf key="half" size={size} className="fill-accent text-accent" />
//         )}
//         {[...Array(emptyStars)].map((_, i) => (
//           <Star key={`empty-${i}`} size={size} className="text-border" />
//         ))}
//       </div>
//       {showValue && (
//         <span className="text-sm text-text-muted ml-1">{rating.toFixed(1)}</span>
//       )}
//     </div>
//   );
// };

// export default RatingStars;

import React from "react";
import { Star, StarHalf } from "lucide-react";

const RatingStars = ({ rating, size = 16, showValue = false }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-orange-500 text-orange-500" />
        ))}
        {hasHalfStar && (
          <StarHalf key="half" size={size} className="fill-orange-500 text-orange-500" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-gray-200" />
        ))}
      </div>
      {showValue && (
        <span className="text-sm text-gray-500 ml-1">{rating.toFixed(1)}</span>
      )}
    </div>
  );
};

export default RatingStars;