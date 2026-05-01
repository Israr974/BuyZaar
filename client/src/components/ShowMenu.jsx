// import React from "react";
// import { useDispatch } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Axios from "../utils/Axios";
// import AxiosError from "../utils/AxiosToError";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import { logout } from "../redux/userSlice";
// import {
//   User, Package, MapPin, ShoppingBag, Settings, HelpCircle, 
//   LogOut, Shield, ExternalLink, Heart, Clock, Star, Gift, X
// } from "lucide-react";
// import IsAdmin from "../utils/IsAdmin";

// const ShowMenu = ({ user, onClose, isMobile = false, wishlistCount = 0 }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const isAdmin = IsAdmin(user?.role);

//   const handleNavigation = (path) => {
//     navigate(path);
//     onClose?.();
//   };

//   const handleLogout = async () => {
//     try {
//       await Axios(summaryApi().logout).catch(() => {});
//     } catch (error) {
//       AxiosError(error);
//     } finally {
//       dispatch(logout());
//       toast.success("Logged out successfully");
//       navigate("/login", { replace: true });
//       onClose?.();
//     }
//   };

//   if (!user) return null;

//   // Menu items for regular users
//   const menuItems = [
//     { icon: <User size={18} />, label: "My Profile", path: "/dashboard/profile" },
//     { icon: <Package size={18} />, label: "My Orders", path: "/dashboard/myorder" },
//     { icon: <Heart size={18} />, label: "Wishlist", path: "/dashboard/wishlist", badge: wishlistCount },
//     { icon: <MapPin size={18} />, label: "Saved Addresses", path: "/dashboard/address" },
//     { icon: <Settings size={18} />, label: "Settings", path: "/dashboard/setting" },
//     { icon: <HelpCircle size={18} />, label: "Help Center", path: "/dashboard/help" },
//   ];

//   // Admin menu items
//   const adminItems = [
//     { icon: <Shield size={18} />, label: "Category", path: "/dashboard/category" },
//     { icon: <Shield size={18} />, label: "Sub Category", path: "/dashboard/subcategory" },
//     { icon: <Shield size={18} />, label: "Upload Product", path: "/dashboard/uploadproduct" },
//     { icon: <Shield size={18} />, label: "Products", path: "/dashboard/product" },
//     { icon: <Shield size={18} />, label: "Orders", path: "/dashboard/order" },
//   ];

//   return (
//     <div className={`
//       ${isMobile 
//         ? 'w-full h-full overflow-y-auto' 
//         : 'bg-card rounded-xl shadow-lg border border-border p-4 min-w-[280px]'
//       }
//     `}>
//       {/* Close button for mobile */}
//       {isMobile && (
//         <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between mb-2">
//           <div className="flex items-center gap-2">
//             <ShoppingBag className="w-5 h-5 text-primary" />
//             <h2 className="text-lg font-bold gradient-text">Menu</h2>
//           </div>
//           <button
//             onClick={onClose}
//             className="p-2 rounded-lg hover:bg-primary/5 active:bg-primary/10 transition-colors"
//             aria-label="Close menu"
//           >
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       )}

//       {/* User Info */}
//       <div className={`flex items-center justify-between mb-4 p-3 rounded-lg bg-primary/5 ${isMobile ? 'mx-4' : ''}`}>
//         <div className="flex items-center gap-3">
//           <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
//             {user?.name?.charAt(0).toUpperCase() || "U"}
//           </div>
//           <div>
//             <div className="flex items-center gap-2">
//               <h3 className="font-semibold text-text">{user?.name || "User"}</h3>
//               {isAdmin && <span className="badge bg-accent text-white text-xs px-2 py-0.5 rounded-full">Admin</span>}
//             </div>
//             <p className="text-sm text-text-muted">{user?.email || "No email"}</p>
//           </div>
//         </div>
//         <button
//           onClick={() => handleNavigation("/dashboard/profile")}
//           className="p-2 hover:bg-primary/10 rounded-lg transition"
//           title="View Profile"
//         >
//           <ExternalLink size={16} className="text-primary" />
//         </button>
//       </div>

//       {/* Divider */}
//       <div className={`border-t border-border my-3 ${isMobile ? 'mx-4' : ''}`}></div>

//       {/* Menu Items */}
//       <div className={`space-y-1 mb-4 ${isMobile ? 'mx-4' : ''}`}>
//         {menuItems.map((item) => (
//           <button
//             key={item.label}
//             onClick={() => handleNavigation(item.path)}
//             className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition text-left group"
//           >
//             <span className="text-primary">{item.icon}</span>
//             <span className="text-sm font-medium flex-1 text-left">{item.label}</span>
//             {item.badge > 0 && (
//               <span className="bg-accent text-white text-xs px-2 py-0.5 rounded-full">
//                 {item.badge}
//               </span>
//             )}
//           </button>
//         ))}
//       </div>

//       {/* Admin Panel Section */}
//       {isAdmin && (
//         <div className={`mb-3 pt-3 border-t border-border ${isMobile ? 'mx-4' : ''}`}>
//           <div className="flex items-center gap-2 px-3 mb-2">
//             <Shield size={16} className="text-accent" />
//             <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
//               Admin Panel
//             </span>
//           </div>
//           <div className="space-y-1">
//             {adminItems.map((item) => (
//               <button
//                 key={item.label}
//                 onClick={() => handleNavigation(item.path)}
//                 className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/5 transition text-left"
//               >
//                 <span className="text-accent">{item.icon}</span>
//                 <span className="text-sm font-medium">{item.label}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Trending Section (Mobile Only) */}
//       {isMobile && (
//         <div className={`mb-3 pt-3 border-t border-border ${isMobile ? 'mx-4' : ''}`}>
//           <div className="flex items-center gap-2 px-3 mb-2">
//             <span className="text-lg">🔥</span>
//             <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
//               Trending Now
//             </span>
//           </div>
//           <div className="space-y-1">
//             {["Smartphones", "Laptops", "Men's Fashion", "Women's Fashion"].map((item) => (
//               <button
//                 key={item}
//                 onClick={() => {
//                   navigate(`/search?q=${encodeURIComponent(item)}`);
//                   onClose();
//                 }}
//                 className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/5 transition text-left"
//               >
//                 <span className="text-sm">{item}</span>
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Footer Links (Mobile Only) */}
//       {isMobile && (
//         <div className={`mt-4 pt-3 border-t border-border ${isMobile ? 'mx-4' : ''}`}>
//           <div className="flex justify-around gap-2 text-xs text-text-muted">
//             <button onClick={() => handleNavigation("/help")} className="hover:text-primary">Help</button>
//             <button onClick={() => handleNavigation("/contact")} className="hover:text-primary">Contact</button>
//             <button onClick={() => handleNavigation("/about")} className="hover:text-primary">About</button>
//             <button onClick={() => handleNavigation("/terms")} className="hover:text-primary">Terms</button>
//           </div>
//           <p className="text-center text-xs text-text-muted mt-3">
//             © 2024 BuyZaar. All rights reserved.
//           </p>
//         </div>
//       )}

//       {/* Logout Button */}
//       <div className={`${!isMobile ? 'mt-4' : 'p-4 border-t border-border mt-4'}`}>
//         <button
//           onClick={handleLogout}
//           className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
//         >
//           <LogOut size={18} />
//           Logout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ShowMenu;

import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { logout } from "../redux/userSlice";
import {
  User, Package, MapPin, ShoppingBag, Settings, HelpCircle, 
  LogOut, Shield, ExternalLink, Heart, Clock, Star, Gift, X
} from "lucide-react";
import IsAdmin from "../utils/IsAdmin";

const ShowMenu = ({ user, onClose, isMobile = false, wishlistCount = 0 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = IsAdmin(user?.role);

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = async () => {
    try {
      await Axios(summaryApi().logout).catch(() => {});
    } catch (error) {
      AxiosError(error);
    } finally {
      dispatch(logout());
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
      onClose?.();
    }
  };

  if (!user) return null;

  const menuItems = [
    { icon: <User size={18} />, label: "My Profile", path: "/dashboard/profile" },
    { icon: <Package size={18} />, label: "My Orders", path: "/dashboard/myorder" },
    { icon: <Heart size={18} />, label: "Wishlist", path: "/dashboard/wishlist", badge: wishlistCount },
    { icon: <MapPin size={18} />, label: "Saved Addresses", path: "/dashboard/address" },
    { icon: <Settings size={18} />, label: "Settings", path: "/dashboard/setting" },
    { icon: <HelpCircle size={18} />, label: "Help Center", path: "/dashboard/help" },
  ];

  const adminItems = [
    { icon: <Shield size={18} />, label: "Category", path: "/dashboard/category" },
    { icon: <Shield size={18} />, label: "Sub Category", path: "/dashboard/subcategory" },
    { icon: <Shield size={18} />, label: "Upload Product", path: "/dashboard/uploadproduct" },
    { icon: <Shield size={18} />, label: "Products", path: "/dashboard/product" },
    { icon: <Shield size={18} />, label: "Orders", path: "/dashboard/order" },
  ];

  return (
    <div className={`
      ${isMobile 
        ? 'w-full h-full overflow-y-auto' 
        : 'bg-white rounded-xl shadow-lg border border-gray-200 p-4 min-w-[280px]'
      }
    `}>
      {isMobile && (
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">Menu</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      <div className={`flex items-center justify-between mb-4 p-3 rounded-lg bg-blue-50 ${isMobile ? 'mx-4' : ''}`}>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800">{user?.name || "User"}</h3>
              {isAdmin && <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">Admin</span>}
            </div>
            <p className="text-sm text-gray-500">{user?.email || "No email"}</p>
          </div>
        </div>
        <button
          onClick={() => handleNavigation("/dashboard/profile")}
          className="p-2 hover:bg-blue-100 rounded-lg transition"
          title="View Profile"
        >
          <ExternalLink size={16} className="text-blue-600" />
        </button>
      </div>

      <div className={`border-t border-gray-200 my-3 ${isMobile ? 'mx-4' : ''}`}></div>

      <div className={`space-y-1 mb-4 ${isMobile ? 'mx-4' : ''}`}>
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition text-left group"
          >
            <span className="text-blue-600">{item.icon}</span>
            <span className="text-sm font-medium flex-1 text-left text-gray-700">{item.label}</span>
            {item.badge > 0 && (
              <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {isAdmin && (
        <div className={`mb-3 pt-3 border-t border-gray-200 ${isMobile ? 'mx-4' : ''}`}>
          <div className="flex items-center gap-2 px-3 mb-2">
            <Shield size={16} className="text-orange-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Admin Panel
            </span>
          </div>
          <div className="space-y-1">
            {adminItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleNavigation(item.path)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-orange-50 transition text-left"
              >
                <span className="text-orange-500">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isMobile && (
        <div className={`mb-3 pt-3 border-t border-gray-200 ${isMobile ? 'mx-4' : ''}`}>
          <div className="flex items-center gap-2 px-3 mb-2">
            <span className="text-lg">🔥</span>
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Trending Now
            </span>
          </div>
          <div className="space-y-1">
            {["Smartphones", "Laptops", "Men's Fashion", "Women's Fashion"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  navigate(`/search?q=${encodeURIComponent(item)}`);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-blue-50 transition text-left"
              >
                <span className="text-sm text-gray-700">{item}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {isMobile && (
        <div className={`mt-4 pt-3 border-t border-gray-200 ${isMobile ? 'mx-4' : ''}`}>
          <div className="flex justify-around gap-2 text-xs text-gray-500">
            <button onClick={() => handleNavigation("/help")} className="hover:text-blue-600">Help</button>
            <button onClick={() => handleNavigation("/contact")} className="hover:text-blue-600">Contact</button>
            <button onClick={() => handleNavigation("/about")} className="hover:text-blue-600">About</button>
            <button onClick={() => handleNavigation("/terms")} className="hover:text-blue-600">Terms</button>
          </div>
          <p className="text-center text-xs text-gray-500 mt-3">
            © 2024 BuyZaar. All rights reserved.
          </p>
        </div>
      )}

      <div className={`${!isMobile ? 'mt-4' : 'p-4 border-t border-gray-200 mt-4'}`}>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </div>
  );
};

export default ShowMenu;