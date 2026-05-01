
// import React from 'react';
// import { Link } from 'react-router-dom';
// import { Home, Search, ShoppingBag } from 'lucide-react';

// const NotFound = () => {
//   return (
//     <div className="min-h-screen bg-bg flex items-center justify-center p-4">
//       <div className="max-w-md text-center">
//         {/* Animated 404 */}
//         <div className="relative mb-8">
//           <h1 className="text-8xl md:text-9xl font-display font-bold gradient-text">404</h1>
//           <div className="absolute -top-4 -right-4 animate-bounce">
//             <Search className="w-8 h-8 text-accent" />
//           </div>
//         </div>
        
//         <h2 className="text-2xl font-display font-bold text-text mb-3">
//           Page Not Found
//         </h2>
//         <p className="text-text-muted mb-8">
//           Oops! The page you're looking for doesn't exist or has been moved.
//         </p>
        
//         <div className="flex flex-col sm:flex-row gap-3 justify-center">
//           <Link to="/" className="btn btn-primary flex items-center justify-center gap-2">
//             <Home size={18} />
//             Go Home
//           </Link>
//           <Link to="/search" className="btn btn-outline flex items-center justify-center gap-2">
//             <Search size={18} />
//             Search Products
//           </Link>
//         </div>
        
//         {/* Helpful Links */}
//         <div className="mt-8 pt-6 border-t border-border">
//           <p className="text-sm text-text-muted mb-3">You might be looking for:</p>
//           <div className="flex flex-wrap gap-2 justify-center">
//             <Link to="/" className="text-xs text-primary hover:underline">Home</Link>
//             <span className="text-border">•</span>
//             <Link to="/search" className="text-xs text-primary hover:underline">Search</Link>
//             <span className="text-border">•</span>
//             <Link to="/dashboard/profile" className="text-xs text-primary hover:underline">My Account</Link>
//             <span className="text-border">•</span>
//             <Link to="/wishlist" className="text-xs text-primary hover:underline">Wishlist</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotFound;
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ShoppingBag } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-md text-center">
        {/* Animated 404 */}
        <div className="relative mb-8">
          <h1 className="text-8xl md:text-9xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">404</h1>
          <div className="absolute -top-4 -right-4 animate-bounce">
            <Search className="w-8 h-8 text-orange-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-3">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:shadow-lg transition">
            <Home size={18} />
            Go Home
          </Link>
          <Link to="/search" className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:border-blue-600 hover:text-blue-600 transition">
            <Search size={18} />
            Search Products
          </Link>
        </div>
        
        {/* Helpful Links */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-3">You might be looking for:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link to="/" className="text-xs text-blue-600 hover:underline">Home</Link>
            <span className="text-gray-300">•</span>
            <Link to="/search" className="text-xs text-blue-600 hover:underline">Search</Link>
            <span className="text-gray-300">•</span>
            <Link to="/dashboard/profile" className="text-xs text-blue-600 hover:underline">My Account</Link>
            <span className="text-gray-300">•</span>
            <Link to="/wishlist" className="text-xs text-blue-600 hover:underline">Wishlist</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;