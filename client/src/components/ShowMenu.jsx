import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import AxiosError from "../utils/AxiosToError";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { logout } from "../redux/userSlice";
import {
  User, Package,MapPin,ShoppingBag,Settings,HelpCircle,LogOut,Shield,ExternalLink,
} from "lucide-react";
import IsAdmin from "../utils/IsAdmin";

const ShowMenu = ({ user, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAdmin = IsAdmin(user?.role);

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.(); // Close dropdown
  };

  const handleLogout = async () => {
    try {
      // Optional: backend logout
      await Axios(summaryApi().logout).catch(() => {});
    } catch (error) {
      AxiosError(error);
    } finally {
      // Use userSlice logout to clear Redux state + localStorage
      dispatch(logout());

      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    }
  };

  if (!user) return null;

  const menuItems = [
    { icon: <User size={18} />, label: "My Profile", path: "/dashboard/profile" },
    { icon: <Package size={18} />, label: "My Orders", path: "/dashboard/myorder" },
    { icon: <MapPin size={18} />, label: "Saved Addresses", path: "/dashboard/address" },
    { icon: <Settings size={18} />, label: "Settings" },
    { icon: <HelpCircle size={18} />, label: "Help Center" },
  ];

  const adminItems = [
    { icon: <Shield size={18} />, label: "Category", path: "/dashboard/category" },
    { icon: <Shield size={18} />, label: "Sub Category", path: "/dashboard/subcategory" },
    { icon: <Shield size={18} />, label: "Upload Product", path: "/dashboard/uploadproduct" },
    { icon: <Shield size={18} />, label: "Products", path: "/dashboard/product" },
    { icon: <Shield size={18} />, label: "Orders", path: "/dashboard/order" },
  ];

  return (
    <div className="bg-card rounded-xl shadow-lg border border-border p-4 min-w-[280px]">
      {/* User Info */}
      <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-primary/5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-lg">
            {user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-text">{user?.name || "User"}</h3>
              {isAdmin && <span className="badge badge-accent text-xs">Admin</span>}
            </div>
            <p className="text-sm text-text-muted">{user?.email || "No email"}</p>
          </div>
        </div>
        <button
          onClick={() => handleNavigation("/dashboard/profile")}
          className="p-2 hover:bg-primary/10 rounded-lg transition"
          title="View Profile"
        >
          <ExternalLink size={16} className="text-primary" />
        </button>
      </div>

      {/* Divider */}
      <div className="border-t border-border my-3"></div>

      {/* Menu Items */}
      <div className="space-y-1 mb-4">
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-primary/5 transition text-left"
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>



      {isAdmin && (
        <>
          <div className="mb-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 px-3 mb-2">
              <Shield size={16} className="text-accent" />
              <span className="text-xs font-semibold text-text-muted uppercase tracking-wide">
                Admin Panel
              </span>
            </div>
            <div className="space-y-1">
              {adminItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/5 transition text-left"
                >
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition font-medium mt-4"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};

export default ShowMenu;
