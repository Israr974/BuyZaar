// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import { setUser } from "../redux/userSlice";
// import { 
//   User, Lock, Bell, Globe, Shield, LogOut, 
//   Moon, Sun, Smartphone, Mail, Eye, EyeOff, 
//   Trash2, Download, Save, CheckCircle,
//   Tag, Languages, Truck
// } from "lucide-react";
// import ConfirmBox from "../components/ConfirmBox";

// const Settings = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();
  
//   const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
//   const [activeTab, setActiveTab] = useState("account");
//   const [isEditing, setIsEditing] = useState(false);
//   const [passwordVisible, setPasswordVisible] = useState(false);
//   const [loading, setLoading] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     currentPassword: "",
//     newPassword: "",
//     confirmPassword: "",
//   });

//   const [notifications, setNotifications] = useState({
//     orderUpdates: true,
//     promotions: false,
//     newsletter: true,
//     smsAlerts: false,
//   });

//   // Fetch user data on mount
//   useEffect(() => {
//     if (user) {
//       setFormData(prev => ({
//         ...prev,
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.mobile || "",
//       }));
//     }
//   }, [user]);

//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios({
//         ...summaryApi().getUserDetail,
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });
      
//       if (res.data.success) {
//         const userData = res.data.user;
//         dispatch(setUser(userData));
//         localStorage.setItem("user", JSON.stringify(userData));
//         setFormData(prev => ({
//           ...prev,
//           name: userData.name || "",
//           email: userData.email || "",
//           phone: userData.mobile || "",
//         }));
//       }
//     } catch (error) {
//       console.error("Failed to fetch user:", error);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleNotificationChange = (key) => {
//     setNotifications({ ...notifications, [key]: !notifications[key] });
//     toast.success(`${key} preference updated`);
//   };

//   // Update Profile
//   const handleUpdateProfile = async () => {
//     if (!formData.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }

//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios({
//         ...summaryApi().updateUser,
//         data: { 
//           name: formData.name.trim(),
//           mobile: formData.phone 
//         },
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         toast.success("Profile updated successfully!");
//         await fetchUserDetails();
//         setIsEditing(false);
//       } else {
//         toast.error(res.data.message || "Update failed");
//       }
//     } catch (error) {
//       console.error("Update error:", error);
//       toast.error(error.response?.data?.message || "Failed to update profile");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Change Password
//   const handleChangePassword = async () => {
//     if (!formData.currentPassword) {
//       toast.error("Current password is required");
//       return;
//     }
//     if (!formData.newPassword || formData.newPassword.length < 6) {
//       toast.error("New password must be at least 6 characters");
//       return;
//     }
//     if (formData.newPassword !== formData.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }
    
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios({
//         ...summaryApi().updateUser,
//         data: { password: formData.newPassword },
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         toast.success("Password changed successfully! Please login again.");
//         setFormData({
//           ...formData,
//           currentPassword: "",
//           newPassword: "",
//           confirmPassword: "",
//         });
//         // Optional: Logout user to re-login with new password
//         setTimeout(() => {
//           handleLogout();
//         }, 2000);
//       } else {
//         toast.error(res.data.message || "Failed to change password");
//       }
//     } catch (error) {
//       console.error("Password change error:", error);
//       toast.error(error.response?.data?.message || "Failed to change password");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete Account
//   const handleDeleteAccount = async () => {
//     setShowDeleteConfirm(false);
//     setLoading(true);
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios({
//         ...summaryApi().deleteAccount,
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true,
//       });

//       if (res.data.success) {
//         toast.success("Account deleted successfully");
//         localStorage.clear();
//         window.location.href = "/";
//       } else {
//         toast.error(res.data.message || "Failed to delete account");
//       }
//     } catch (error) {
//       console.error("Delete account error:", error);
//       toast.error(error.response?.data?.message || "Failed to delete account");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleThemeToggle = () => {
//     const newTheme = !darkMode ? "dark" : "light";
//     setDarkMode(!darkMode);
//     localStorage.setItem("theme", newTheme);
//     document.documentElement.classList.toggle("dark");
//     toast.success(`${newTheme} mode activated`);
//   };

//   const handleLogout = () => {
//     setShowLogoutConfirm(false);
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     window.location.href = "/login";
//   };

//   const tabs = [
//     { id: "account", label: "Account", icon: User },
//     { id: "security", label: "Security", icon: Lock },
//     { id: "notifications", label: "Notifications", icon: Bell },
//     { id: "preferences", label: "Preferences", icon: Globe },
//     { id: "privacy", label: "Privacy", icon: Shield },
//   ];

//   return (
//     <div className="min-h-screen bg-bg p-3 md:p-6">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="mb-6">
//           <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
//             Settings
//           </h1>
//           <p className="text-text-muted text-sm">
//             Manage your account preferences and privacy
//           </p>
//         </div>

//         {/* Top Tabs */}
//         <div className="mb-6 border-b border-border overflow-x-auto">
//           <div className="flex gap-1 min-w-max">
//             {tabs.map((tab) => {
//               const Icon = tab.icon;
//               const isActive = activeTab === tab.id;
//               return (
//                 <button
//                   key={tab.id}
//                   onClick={() => setActiveTab(tab.id)}
//                   className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${
//                     isActive
//                       ? "text-primary border-b-2 border-primary bg-primary/5"
//                       : "text-text-muted hover:text-text hover:bg-bg-alt"
//                   }`}
//                 >
//                   <Icon size={16} className="md:w-4 md:h-4" />
//                   <span className="text-sm md:text-base">{tab.label}</span>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Account Settings Tab */}
//         {activeTab === "account" && (
//           <div className="bg-card rounded-xl border border-border overflow-hidden">
//             <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//               <div className="flex items-center gap-2 md:gap-3">
//                 <User size={18} className="text-primary" />
//                 <h2 className="font-semibold text-text text-sm md:text-base">Account Information</h2>
//               </div>
//             </div>
            
//             <div className="p-4 md:p-6 space-y-4 md:space-y-5">
//               <div>
//                 <label className="block text-xs md:text-sm font-medium text-text mb-1 md:mb-2">
//                   Full Name
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
//                   />
//                 ) : (
//                   <div className="p-2 md:p-3 rounded-lg bg-bg-alt border border-border text-text text-sm">
//                     {user?.name || "Not set"}
//                   </div>
//                 )}
//               </div>

//               {/* Email - READ ONLY */}
//               <div>
//                 <label className="block text-xs md:text-sm font-medium text-text mb-1 md:mb-2">
//                   Email Address
//                 </label>
//                 <div className="p-2 md:p-3 rounded-lg bg-bg-alt border border-border text-text text-sm opacity-70">
//                   {user?.email || "Not set"}
//                   <span className="text-xs text-text-muted ml-2">(Email cannot be changed)</span>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs md:text-sm font-medium text-text mb-1 md:mb-2">
//                   Phone Number
//                 </label>
//                 {isEditing ? (
//                   <input
//                     type="tel"
//                     name="phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     placeholder="10-digit mobile number"
//                     maxLength={10}
//                     disabled={loading}
//                     className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
//                   />
//                 ) : (
//                   <div className="p-2 md:p-3 rounded-lg bg-bg-alt border border-border text-text text-sm">
//                     {user?.mobile || "Not set"}
//                   </div>
//                 )}
//               </div>

//               <div className="flex justify-end gap-2 md:gap-3 pt-4">
//                 {isEditing ? (
//                   <>
//                     <button
//                       onClick={() => setIsEditing(false)}
//                       disabled={loading}
//                       className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg border border-border text-text hover:bg-bg-alt transition text-sm disabled:opacity-50"
//                     >
//                       Cancel
//                     </button>
//                     <button
//                       onClick={handleUpdateProfile}
//                       disabled={loading}
//                       className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition text-sm disabled:opacity-50 flex items-center gap-2"
//                     >
//                       {loading ? (
//                         <>
//                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                           Saving...
//                         </>
//                       ) : (
//                         "Save"
//                       )}
//                     </button>
//                   </>
//                 ) : (
//                   <button
//                     onClick={() => setIsEditing(true)}
//                     className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition text-sm"
//                   >
//                     Edit Profile
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* Logout Button */}
//             <div className="border-t border-border p-4 md:p-6">
//               <button
//                 onClick={() => setShowLogoutConfirm(true)}
//                 className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-error/10 text-error hover:bg-error/20 transition text-sm"
//               >
//                 <LogOut size={16} />
//                 Logout
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Security Settings Tab */}
//         {activeTab === "security" && (
//           <div className="bg-card rounded-xl border border-border overflow-hidden">
//             <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//               <div className="flex items-center gap-2 md:gap-3">
//                 <Lock size={18} className="text-primary" />
//                 <h2 className="font-semibold text-text text-sm md:text-base">Change Password</h2>
//               </div>
//             </div>
            
//             <div className="p-4 md:p-6 space-y-4 md:space-y-5">
//               <div>
//                 <label className="block text-xs md:text-sm font-medium text-text mb-1 md:mb-2">
//                   Current Password
//                 </label>
//                 <div className="relative">
//                   <input
//                     type={passwordVisible ? "text" : "password"}
//                     name="currentPassword"
//                     value={formData.currentPassword}
//                     onChange={handleChange}
//                     disabled={loading}
//                     className="w-full px-3 md:px-4 py-1.5 md:py-2 pr-10 rounded-lg border border-border bg-card text-text text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50"
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setPasswordVisible(!passwordVisible)}
//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
//                   >
//                     {passwordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
//                   </button>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs md:text-sm font-medium text-text mb-1 md:mb-2">
//                   New Password
//                 </label>
//                 <input
//                   type="password"
//                   name="newPassword"
//                   value={formData.newPassword}
//                   onChange={handleChange}
//                   disabled={loading}
//                   className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none disabled:opacity-50"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs md:text-sm font-medium text-text mb-1 md:mb-2">
//                   Confirm New Password
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   disabled={loading}
//                   className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-border bg-card text-text text-sm focus:outline-none disabled:opacity-50"
//                 />
//               </div>

//               <div className="flex justify-end">
//                 <button
//                   onClick={handleChangePassword}
//                   disabled={loading}
//                   className="px-4 md:px-6 py-1.5 md:py-2 rounded-lg bg-primary text-white hover:bg-primary-dark transition text-sm disabled:opacity-50 flex items-center gap-2"
//                 >
//                   {loading ? (
//                     <>
//                       <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                       Updating...
//                     </>
//                   ) : (
//                     "Update Password"
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Notifications Tab */}
//         {activeTab === "notifications" && (
//           <div className="bg-card rounded-xl border border-border overflow-hidden">
//             <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//               <div className="flex items-center gap-2 md:gap-3">
//                 <Bell size={18} className="text-primary" />
//                 <h2 className="font-semibold text-text text-sm md:text-base">Notification Preferences</h2>
//               </div>
//             </div>
            
//             <div className="divide-y divide-border">
//               {[
//                 { key: "orderUpdates", label: "Order Updates", desc: "Get notified about order status changes", icon: Truck },
//                 { key: "promotions", label: "Promotions & Offers", desc: "Exclusive deals and discounts", icon: Tag },
//                 { key: "newsletter", label: "Newsletter", desc: "Weekly product updates", icon: Mail },
//                 { key: "smsAlerts", label: "SMS Alerts", desc: "Receive text message updates", icon: Smartphone },
//               ].map((item) => {
//                 const Icon = item.icon;
//                 return (
//                   <div key={item.key} className="p-4 md:p-5 flex items-center justify-between">
//                     <div className="flex items-center gap-2 md:gap-3">
//                       <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
//                         <Icon size={14} className="text-primary" />
//                       </div>
//                       <div>
//                         <h3 className="font-medium text-text text-sm">{item.label}</h3>
//                         <p className="text-xs text-text-muted">{item.desc}</p>
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => handleNotificationChange(item.key)}
//                       className={`relative w-10 h-5 rounded-full transition-colors ${
//                         notifications[item.key] ? "bg-primary" : "bg-border"
//                       }`}
//                     >
//                       <span
//                         className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
//                           notifications[item.key] ? "left-5" : "left-0.5"
//                         }`}
//                       />
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Preferences Tab */}
//         {activeTab === "preferences" && (
//           <div className="space-y-4 md:space-y-6">
//             {/* Theme */}
//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//                 <div className="flex items-center gap-2 md:gap-3">
//                   <Globe size={18} className="text-primary" />
//                   <h2 className="font-semibold text-text text-sm md:text-base">Appearance</h2>
//                 </div>
//               </div>
//               <div className="p-4 md:p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 md:gap-3">
//                     {darkMode ? <Moon size={18} className="text-primary" /> : <Sun size={18} className="text-primary" />}
//                     <div>
//                       <h3 className="font-medium text-text text-sm">Dark Mode</h3>
//                       <p className="text-xs text-text-muted">Switch between light and dark theme</p>
//                     </div>
//                   </div>
//                   <button
//                     onClick={handleThemeToggle}
//                     className={`relative w-10 h-5 rounded-full transition-colors ${darkMode ? "bg-primary" : "bg-border"}`}
//                   >
//                     <span
//                       className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
//                         darkMode ? "left-5" : "left-0.5"
//                       }`}
//                     />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Language & Currency */}
//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//                 <div className="flex items-center gap-2 md:gap-3">
//                   <Languages size={18} className="text-primary" />
//                   <h2 className="font-semibold text-text text-sm md:text-base">Language & Region</h2>
//                 </div>
//               </div>
//               <div className="p-4 md:p-6 space-y-3 md:space-y-4">
//                 <div>
//                   <label className="block text-xs font-medium text-text mb-1">Language</label>
//                   <select className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-text text-sm">
//                     <option value="en">English</option>
//                     <option value="hi">हिन्दी (Hindi)</option>
//                     <option value="bn">বাংলা (Bengali)</option>
//                     <option value="te">తెలుగు (Telugu)</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-medium text-text mb-1">Currency</label>
//                   <select className="w-full px-3 py-1.5 rounded-lg border border-border bg-card text-text text-sm">
//                     <option value="INR">Indian Rupee (₹)</option>
//                     <option value="USD">US Dollar ($)</option>
//                     <option value="EUR">Euro (€)</option>
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Privacy Tab */}
//         {activeTab === "privacy" && (
//           <div className="space-y-4 md:space-y-6">
//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//                 <div className="flex items-center gap-2 md:gap-3">
//                   <Download size={18} className="text-primary" />
//                   <h2 className="font-semibold text-text text-sm md:text-base">Data & Privacy</h2>
//                 </div>
//               </div>
//               <div className="p-4 md:p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="font-medium text-text text-sm">Download Your Data</h3>
//                     <p className="text-xs text-text-muted">Get a copy of your account data</p>
//                   </div>
//                   <button 
//                     onClick={() => toast.info("Feature coming soon")}
//                     className="btn-outline px-3 md:px-4 py-1 text-sm"
//                   >
//                     Request
//                   </button>
//                 </div>
                
//                 <div className="border-t border-border pt-4 mt-4">
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <h3 className="font-medium text-error text-sm">Delete Account</h3>
//                       <p className="text-xs text-text-muted">Permanently delete your account</p>
//                     </div>
//                     <button
//                       onClick={() => setShowDeleteConfirm(true)}
//                       className="px-3 md:px-4 py-1 text-sm rounded-lg bg-error/10 text-error hover:bg-error/20 transition"
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="bg-card rounded-xl border border-border overflow-hidden">
//               <div className="px-4 md:px-6 py-3 md:py-4 border-b border-border bg-bg-alt">
//                 <div className="flex items-center gap-2 md:gap-3">
//                   <Smartphone size={18} className="text-primary" />
//                   <h2 className="font-semibold text-text text-sm md:text-base">Active Sessions</h2>
//                 </div>
//               </div>
//               <div className="p-4 md:p-6">
//                 <div className="flex items-center justify-between">
//                   <div className="flex items-center gap-2 md:gap-3">
//                     <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
//                       <Smartphone size={14} className="text-primary" />
//                     </div>
//                     <div>
//                       <h3 className="font-medium text-text text-sm">Current Session</h3>
//                       <p className="text-xs text-text-muted">Active now</p>
//                     </div>
//                   </div>
//                   <span className="text-xs text-success flex items-center gap-1">
//                     <CheckCircle size={10} />
//                     Active
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Logout Confirmation */}
//       {showLogoutConfirm && (
//         <ConfirmBox
//           title="Logout"
//           message="Are you sure you want to logout?"
//           confirmText="Logout"
//           cancelText="Cancel"
//           confirmColor="red"
//           close={() => setShowLogoutConfirm(false)}
//           cancel={() => setShowLogoutConfirm(false)}
//           confirm={handleLogout}
//         />
//       )}

//       {/* Delete Account Confirmation */}
//       {showDeleteConfirm && (
//         <ConfirmBox
//           title="Delete Account"
//           message="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
//           confirmText="Delete"
//           cancelText="Cancel"
//           confirmColor="red"
//           close={() => setShowDeleteConfirm(false)}
//           cancel={() => setShowDeleteConfirm(false)}
//           confirm={handleDeleteAccount}
//         />
//       )}
//     </div>
//   );
// };

// export default Settings;

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { setUser } from "../redux/userSlice";
import { 
  User, Lock, Bell, Globe, Shield, LogOut, 
  Moon, Sun, Smartphone, Mail, Eye, EyeOff, 
  Trash2, Download, Save, CheckCircle,
  Tag, Languages, Truck
} from "lucide-react";
import ConfirmBox from "../components/ConfirmBox";

const Settings = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  
  const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState("account");
  const [isEditing, setIsEditing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newsletter: true,
    smsAlerts: false,
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
      }));
    }
  }, [user]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios({
        ...summaryApi().getUserDetail,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      
      if (res.data.success) {
        const userData = res.data.user;
        dispatch(setUser(userData));
        localStorage.setItem("user", JSON.stringify(userData));
        setFormData(prev => ({
          ...prev,
          name: userData.name || "",
          email: userData.email || "",
          phone: userData.mobile || "",
        }));
      }
    } catch (error) {
      // Silent fail
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNotificationChange = (key) => {
    setNotifications({ ...notifications, [key]: !notifications[key] });
    toast.success(`${key} preference updated`);
  };

  const handleUpdateProfile = async () => {
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios({
        ...summaryApi().updateUser,
        data: { 
          name: formData.name.trim(),
          mobile: formData.phone 
        },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Profile updated successfully!");
        await fetchUserDetails();
        setIsEditing(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!formData.currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (!formData.newPassword || formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios({
        ...summaryApi().updateUser,
        data: { password: formData.newPassword },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Password changed successfully! Please login again.");
        setFormData({
          ...formData,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setTimeout(() => {
          handleLogout();
        }, 2000);
      } else {
        toast.error(res.data.message || "Failed to change password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios({
        ...summaryApi().deleteAccount,
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      if (res.data.success) {
        toast.success("Account deleted successfully");
        localStorage.clear();
        window.location.href = "/";
      } else {
        toast.error(res.data.message || "Failed to delete account");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  const handleThemeToggle = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark");
    toast.success(`${newTheme} mode activated`);
  };

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "preferences", label: "Preferences", icon: Globe },
    { id: "privacy", label: "Privacy", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-white p-3 md:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Settings
          </h1>
          <p className="text-gray-500 text-sm">
            Manage your account preferences and privacy
          </p>
        </div>

        {/* Top Tabs */}
        <div className="mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 md:px-6 py-2 md:py-3 rounded-t-lg font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50"
                      : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Icon size={16} className="md:w-4 md:h-4" />
                  <span className="text-sm md:text-base">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Account Settings Tab */}
        {activeTab === "account" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 md:gap-3">
                <User size={18} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800 text-sm md:text-base">Account Information</h2>
              </div>
            </div>
            
            <div className="p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
                  />
                ) : (
                  <div className="p-2 md:p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-sm">
                    {user?.name || "Not set"}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2">
                  Email Address
                </label>
                <div className="p-2 md:p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-sm opacity-70">
                  {user?.email || "Not set"}
                  <span className="text-xs text-gray-500 ml-2">(Email cannot be changed)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    disabled={loading}
                    className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
                  />
                ) : (
                  <div className="p-2 md:p-3 rounded-lg bg-gray-100 border border-gray-200 text-gray-800 text-sm">
                    {user?.mobile || "Not set"}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 md:gap-3 pt-4">
                {isEditing ? (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      disabled={loading}
                      className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-100 transition text-sm disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleUpdateProfile}
                      disabled={loading}
                      className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg transition text-sm disabled:opacity-50 flex items-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Saving...
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-3 md:px-5 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg transition text-sm"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 md:p-6">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition text-sm"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Security Settings Tab */}
        {activeTab === "security" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 md:gap-3">
                <Lock size={18} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800 text-sm md:text-base">Change Password</h2>
              </div>
            </div>
            
            <div className="p-4 md:p-6 space-y-4 md:space-y-5">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-3 md:px-4 py-1.5 md:py-2 pr-10 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible(!passwordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                  >
                    {passwordVisible ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none disabled:opacity-50"
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-800 mb-1 md:mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-3 md:px-4 py-1.5 md:py-2 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleChangePassword}
                  disabled={loading}
                  className="px-4 md:px-6 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg transition text-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Updating...
                    </>
                  ) : (
                    "Update Password"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center gap-2 md:gap-3">
                <Bell size={18} className="text-blue-600" />
                <h2 className="font-semibold text-gray-800 text-sm md:text-base">Notification Preferences</h2>
              </div>
            </div>
            
            <div className="divide-y divide-gray-200">
              {[
                { key: "orderUpdates", label: "Order Updates", desc: "Get notified about order status changes", icon: Truck },
                { key: "promotions", label: "Promotions & Offers", desc: "Exclusive deals and discounts", icon: Tag },
                { key: "newsletter", label: "Newsletter", desc: "Weekly product updates", icon: Mail },
                { key: "smsAlerts", label: "SMS Alerts", desc: "Receive text message updates", icon: Smartphone },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.key} className="p-4 md:p-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="p-1.5 md:p-2 rounded-lg bg-blue-100">
                        <Icon size={14} className="text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-sm">{item.label}</h3>
                        <p className="text-xs text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleNotificationChange(item.key)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${
                        notifications[item.key] ? "bg-blue-600" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          notifications[item.key] ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === "preferences" && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 md:gap-3">
                  <Globe size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-800 text-sm md:text-base">Appearance</h2>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    {darkMode ? <Moon size={18} className="text-blue-600" /> : <Sun size={18} className="text-blue-600" />}
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">Dark Mode</h3>
                      <p className="text-xs text-gray-500">Switch between light and dark theme</p>
                    </div>
                  </div>
                  <button
                    onClick={handleThemeToggle}
                    className={`relative w-10 h-5 rounded-full transition-colors ${darkMode ? "bg-blue-600" : "bg-gray-300"}`}
                  >
                    <span
                      className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                        darkMode ? "left-5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 md:gap-3">
                  <Languages size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-800 text-sm md:text-base">Language & Region</h2>
                </div>
              </div>
              <div className="p-4 md:p-6 space-y-3 md:space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Language</label>
                  <select className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm">
                    <option value="en">English</option>
                    <option value="hi">हिन्दी (Hindi)</option>
                    <option value="bn">বাংলা (Bengali)</option>
                    <option value="te">తెలుగు (Telugu)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-800 mb-1">Currency</label>
                  <select className="w-full px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-800 text-sm">
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === "privacy" && (
          <div className="space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 md:gap-3">
                  <Download size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-800 text-sm md:text-base">Data & Privacy</h2>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-gray-800 text-sm">Download Your Data</h3>
                    <p className="text-xs text-gray-500">Get a copy of your account data</p>
                  </div>
                  <button 
                    onClick={() => toast.info("Feature coming soon")}
                    className="border-2 border-gray-300 text-gray-700 px-3 md:px-4 py-1 text-sm rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
                  >
                    Request
                  </button>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-red-600 text-sm">Delete Account</h3>
                      <p className="text-xs text-gray-500">Permanently delete your account</p>
                    </div>
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="px-3 md:px-4 py-1 text-sm rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-4 md:px-6 py-3 md:py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2 md:gap-3">
                  <Smartphone size={18} className="text-blue-600" />
                  <h2 className="font-semibold text-gray-800 text-sm md:text-base">Active Sessions</h2>
                </div>
              </div>
              <div className="p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="p-1.5 md:p-2 rounded-lg bg-blue-100">
                      <Smartphone size={14} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">Current Session</h3>
                      <p className="text-xs text-gray-500">Active now</p>
                    </div>
                  </div>
                  <span className="text-xs text-green-600 flex items-center gap-1">
                    <CheckCircle size={10} />
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {showLogoutConfirm && (
        <ConfirmBox
          title="Logout"
          message="Are you sure you want to logout?"
          confirmText="Logout"
          cancelText="Cancel"
          confirmColor="red"
          close={() => setShowLogoutConfirm(false)}
          cancel={() => setShowLogoutConfirm(false)}
          confirm={handleLogout}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmBox
          title="Delete Account"
          message="Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
          close={() => setShowDeleteConfirm(false)}
          cancel={() => setShowDeleteConfirm(false)}
          confirm={handleDeleteAccount}
        />
      )}
    </div>
  );
};

export default Settings;