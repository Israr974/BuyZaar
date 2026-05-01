// import React from "react";
// import { Package, Heart, ShoppingBag, Search } from "lucide-react";

// const icons = {
//   package: Package,
//   heart: Heart,
//   cart: ShoppingBag,
//   search: Search
// };

// const EmptyState = ({ 
//   title = "No items found", 
//   message = "Try adjusting your search or filter criteria",
//   icon = "package",
//   actionText = "Start Shopping",
//   onAction,
//   image 
// }) => {
//   const Icon = icons[icon] || Package;

//   return (
//     <div className="text-center py-12 max-w-md mx-auto">
//       {image ? (
//         <img src={image} alt={title} className="w-40 h-40 mx-auto mb-6" />
//       ) : (
//         <div className="w-24 h-24 mx-auto rounded-full bg-bg-alt flex items-center justify-center mb-6">
//           <Icon className="w-12 h-12 text-text-muted" />
//         </div>
//       )}
//       <h3 className="text-xl font-display font-semibold text-text mb-2">
//         {title}
//       </h3>
//       <p className="text-text-muted mb-6">
//         {message}
//       </p>
//       {onAction && (
//         <button onClick={onAction} className="btn btn-primary">
//           {actionText}
//         </button>
//       )}
//     </div>
//   );
// };

// export default EmptyState;

import React from "react";
import { Package, Heart, ShoppingBag, Search } from "lucide-react";

const icons = {
  package: Package,
  heart: Heart,
  cart: ShoppingBag,
  search: Search
};

const EmptyState = ({ 
  title = "No items found", 
  message = "Try adjusting your search or filter criteria",
  icon = "package",
  actionText = "Start Shopping",
  onAction,
  image 
}) => {
  const Icon = icons[icon] || Package;

  return (
    <div className="text-center py-12 max-w-md mx-auto">
      {image ? (
        <img src={image} alt={title} className="w-40 h-40 mx-auto mb-6" />
      ) : (
        <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <Icon className="w-12 h-12 text-gray-500" />
        </div>
      )}
      <h3 className="text-xl font-bold text-gray-800 mb-2">
        {title}
      </h3>
      <p className="text-gray-500 mb-6">
        {message}
      </p>
      {onAction && (
        <button onClick={onAction} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;