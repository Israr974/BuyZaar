// import React, { useEffect, useState, useRef } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import axios from 'axios';
// import summaryApi from '../common/summartApi';
// import toast from 'react-hot-toast';
// import { setUser } from '../redux/userSlice';
// import { DeleteConfirmBox } from '../components/ConfirmBox';
// import { 
//   User, Mail, Phone, Edit, Save, X, Calendar, 
//   ShoppingBag, MapPin, Shield, CheckCircle, 
//   AlertCircle, Camera, Award, Heart, Settings, TrendingUp 
// } from 'lucide-react';

// const Profile = () => {
//   const user = useSelector((state) => state.user);
//   const dispatch = useDispatch();

//   const [editMode, setEditMode] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [uploadingAvatar, setUploadingAvatar] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState(null);
//   const fileInputRef = useRef(null);
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [isLoadingStats, setIsLoadingStats] = useState(false);
  
//   // Stats state
//   const [stats, setStats] = useState({
//     totalOrders: 0,
//     totalSpent: 0,
//     savedAddresses: 0,
//     wishlistCount: 0,
//     pendingOrders: 0,
//     deliveredOrders: 0,
//     cancelledOrders: 0
//   });
  
//   const [userData, setUserData] = useState({
//     name: '',
//     email: '',
//     mobile: ''
//   });

//   // Function to fetch latest user details from backend
//   const fetchUserDetails = async () => {
//     try {
//       const token = localStorage.getItem('token') || 
//                     document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
//       if (!token) {
//         console.log("No token found");
//         return;
//       }
      
//       const res = await axios({
//         ...summaryApi().getUserDetail,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true
//       });
      
//       console.log("User Details Response:", res.data);
      
//       if (res.data.success) {
//         const userDataFromBackend = res.data.user || res.data.data;
        
//         // Update Redux
//         dispatch(setUser(userDataFromBackend));
        
//         // Update localStorage
//         localStorage.setItem('user', JSON.stringify(userDataFromBackend));
        
//         // Update state
//         setUserData({
//           name: userDataFromBackend.name || '',
//           email: userDataFromBackend.email || '',
//           mobile: userDataFromBackend.mobile || ''
//         });
        
//         // Update avatar preview
//         const profileUrl = userDataFromBackend.profile || userDataFromBackend.avatar || null;
//         setAvatarPreview(profileUrl);
        
//         return userDataFromBackend;
//       }
//     } catch (error) {
//       console.error("Failed to fetch user details:", error);
//     }
//     return null;
//   };
  
//   // Function to fetch orders
//   const fetchUserOrders = async () => {
//     try {
//       const token = localStorage.getItem('token') || 
//                     document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
//       if (!token) return;
      
//       const res = await axios({
//         ...summaryApi().getMyOrders,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true
//       });
      
//       console.log("Orders Response:", res.data);
      
//       if (res.data.success) {
//         // Handle different response formats
//         const orders = res.data.orders || res.data.data || [];
        
//         console.log("Orders array:", orders);
        
//         // Calculate stats from orders
//         const totalOrders = orders.length;
        
//         // Calculate total spent from delivered orders only
//         const totalSpent = orders
//           .filter(order => {
//             const status = order.orderStatus || order.status;
//             return status === 'delivered';
//           })
//           .reduce((sum, order) => {
//             const amount = order.totalAmount || order.total || order.amount || 0;
//             return sum + amount;
//           }, 0);
        
//         const pendingOrders = orders.filter(order => {
//           const status = order.orderStatus || order.status;
//           return status === 'pending' || status === 'processing';
//         }).length;
        
//         const deliveredOrders = orders.filter(order => {
//           const status = order.orderStatus || order.status;
//           return status === 'delivered';
//         }).length;
        
//         const cancelledOrders = orders.filter(order => {
//           const status = order.orderStatus || order.status;
//           return status === 'cancelled';
//         }).length;
        
//         setStats(prev => ({
//           ...prev,
//           totalOrders,
//           totalSpent,
//           pendingOrders,
//           deliveredOrders,
//           cancelledOrders
//         }));
        
//         return orders;
//       }
//     } catch (error) {
//       console.error("Failed to fetch orders:", error);
//     }
//     return [];
//   };
  
//   // Function to fetch addresses
//   const fetchAddresses = async () => {
//     try {
//       const token = localStorage.getItem('token') || 
//                     document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
//       if (!token) return;
      
//       const res = await axios({
//         ...summaryApi().getAddresses,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true
//       });
      
//       console.log("Addresses Response:", res.data);
      
//       if (res.data.success) {
//         const addresses = res.data.data || res.data.addresses || [];
//         setStats(prev => ({
//           ...prev,
//           savedAddresses: addresses.length
//         }));
//       }
//     } catch (error) {
//       console.error("Failed to fetch addresses:", error);
//     }
//   };
  
//   // Function to fetch wishlist
//   const fetchWishlist = async () => {
//     try {
//       const token = localStorage.getItem('token') || 
//                     document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
//       if (!token) return;
      
//       const res = await axios({
//         ...summaryApi().getWishlist,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true
//       });
      
//       console.log("Wishlist Response:", res.data);
      
//       if (res.data.success) {
//         const wishlist = res.data.data || res.data.items || res.data.wishlist || [];
//         setStats(prev => ({
//           ...prev,
//           wishlistCount: wishlist.length
//         }));
//       }
//     } catch (error) {
//       console.error("Failed to fetch wishlist:", error);
//     }
//   };

//   // Calculate stats from user object (fallback)
//   const calculateStatsFromUser = (userData) => {
//     if (!userData) return;
    
//     // Check for order history in user object
//     const orderHistory = userData.orderHistory || [];
//     const addressDetails = userData.address_details || [];
//     const wishlist = userData.wishlist || [];
    
//     const totalOrders = orderHistory.length;
//     const totalSpent = orderHistory
//       .filter(order => {
//         const status = order.orderStatus || order.status;
//         return status === 'delivered';
//       })
//       .reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
    
//     const pendingOrders = orderHistory.filter(order => {
//       const status = order.orderStatus || order.status;
//       return status === 'pending' || status === 'processing';
//     }).length;
    
//     const deliveredOrders = orderHistory.filter(order => {
//       const status = order.orderStatus || order.status;
//       return status === 'delivered';
//     }).length;
    
//     setStats(prev => ({
//       ...prev,
//       totalOrders: totalOrders || prev.totalOrders,
//       totalSpent: totalSpent || prev.totalSpent,
//       savedAddresses: addressDetails.length || prev.savedAddresses,
//       wishlistCount: wishlist.length || prev.wishlistCount,
//       pendingOrders: pendingOrders || prev.pendingOrders,
//       deliveredOrders: deliveredOrders || prev.deliveredOrders
//     }));
//   };

//   // Load all data
//   const loadAllData = async () => {
//     setIsLoadingStats(true);
    
//     // Fetch from all APIs
//     await Promise.all([
//       fetchUserDetails(),
//       fetchUserOrders(),
//       fetchAddresses(),
//       fetchWishlist()
//     ]);
    
//     setIsLoadingStats(false);
//   };

//   // Load user data on component mount
//   useEffect(() => {
//     const loadUserData = async () => {
//       // First try to get from localStorage
//       const storedUser = localStorage.getItem('user');
      
//       if (storedUser) {
//         const parsedUser = JSON.parse(storedUser);
        
//         // Update Redux if not already there
//         if (!user?.id) {
//           dispatch(setUser(parsedUser));
//         }
        
//         // Update state
//         setUserData({
//           name: parsedUser.name || '',
//           email: parsedUser.email || '',
//           mobile: parsedUser.mobile || ''
//         });
        
//         // Set avatar preview
//         const profileUrl = parsedUser.profile || parsedUser.avatar || null;
//         setAvatarPreview(profileUrl);
        
//         // Calculate stats from stored user
//         calculateStatsFromUser(parsedUser);
//       }
      
//       // Load all fresh data
//       await loadAllData();
//     };
    
//     loadUserData();
//   }, []);

//   // Update state when Redux user changes
//   useEffect(() => {
//     if (user && user.id) {
//       setUserData({
//         name: user.name || '',
//         email: user.email || '',
//         mobile: user.mobile || ''
//       });
      
//       const profileUrl = user.profile || user.avatar || null;
//       if (profileUrl) {
//         setAvatarPreview(profileUrl);
//       }
      
//       // Recalculate stats when user updates
//       calculateStatsFromUser(user);
//     }
//   }, [user]);

//   const handleChange = (e) => {
//     setUserData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value
//     }));
//   };

//   const handleEdit = () => {
//     setEditMode(true);
//   };

//   const handleCancel = () => {
//     setEditMode(false);
//     setUserData({
//       name: user.name || '',
//       email: user.email || '',
//       mobile: user.mobile || ''
//     });
//   };

//   const handleSave = async () => {
//     if (!userData.name.trim()) {
//       toast.error("Name is required");
//       return;
//     }

//     if (!userData.email.trim()) {
//       toast.error("Email is required");
//       return;
//     }

//     if (userData.mobile && !/^\d{10}$/.test(userData.mobile)) {
//       toast.error("Please enter a valid 10-digit phone number");
//       return;
//     }

//     try {
//       setLoading(true);
      
//       const token = localStorage.getItem('token') || 
//                     document.cookie.match(/accessToken=([^;]+)/)?.[1];

//       const res = await axios({
//         ...summaryApi().updateUser,
//         data: userData,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true
//       });

//       if (res.data.success) {
//         await fetchUserDetails();
//         toast.success("Profile updated successfully!");
//         setEditMode(false);
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

//   const handleAvatarClick = () => {
//     fileInputRef.current?.click();
//   };

//   const handleAvatarChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
//     if (!allowedTypes.includes(file.type)) {
//       toast.error('Please upload a valid image (JPEG, PNG, or WEBP)');
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       toast.error('Image size should be less than 2MB');
//       return;
//     }

//     const reader = new FileReader();
//     reader.onload = (event) => {
//       setAvatarPreview(event.target.result);
//     };
//     reader.readAsDataURL(file);

//     await uploadAvatar(file);
//   };

//   const uploadAvatar = async (file) => {
//     try {
//       setUploadingAvatar(true);
      
//       const imageFormData = new FormData();
//       imageFormData.append('image', file);
      
//       const uploadRes = await axios({
//         ...summaryApi().uploadImage,
//         data: imageFormData,
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });
      
//       const imageUrl = uploadRes?.data?.imageUrl || uploadRes?.data?.url;
      
//       if (!imageUrl) {
//         toast.error("Failed to upload image");
//         return;
//       }
      
//       const token = localStorage.getItem('token');
      
//       const res = await axios({
//         ...summaryApi().uploadAvatar,
//         data: { image: imageUrl },
//         headers: { Authorization: `Bearer ${token}` },
//         withCredentials: true
//       });
      
//       if (res.data.success) {
//         await fetchUserDetails();
//         toast.success("Profile picture updated successfully!");
//       } else {
//         toast.error(res.data.message || "Failed to update");
//         await fetchUserDetails();
//       }
//     } catch (error) {
//       console.error("Upload error:", error);
//       toast.error("Failed to upload profile picture");
//       await fetchUserDetails();
//     } finally {
//       setUploadingAvatar(false);
//     }
//   };

//   const confirmDeleteAvatar = () => {
//     setShowDeleteConfirm(true);
//   };

//   const handleDeleteAvatar = async () => {
//     setShowDeleteConfirm(false);
    
//     try {
//       setUploadingAvatar(true);
      
//       const token = localStorage.getItem('token') || 
//                     document.cookie.match(/accessToken=([^;]+)/)?.[1];

//       const res = await axios({
//         ...summaryApi().deleteAvatar,
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         withCredentials: true
//       });

//       if (res.data.success) {
//         await fetchUserDetails();
//         toast.success("Profile picture deleted successfully!");
//       } else {
//         toast.error(res.data.message || "Failed to delete avatar");
//       }
//     } catch (error) {
//       console.error("Avatar delete error:", error);
//       toast.error(error.response?.data?.message || "Failed to delete profile picture");
//     } finally {
//       setUploadingAvatar(false);
//     }
//   };

//   const cancelDeleteAvatar = () => {
//     setShowDeleteConfirm(false);
//   };

//   // Get the current user data (from Redux or localStorage)
//   const currentUser = user?.id ? user : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
//   const currentAvatar = avatarPreview || currentUser?.profile || currentUser?.avatar || null;

//   if (!currentUser) {
//     return (
//       <div className="min-h-screen flex items-center justify-center fade-in">
//         <div className="text-center p-8 max-w-md">
//           <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6">
//             <User className="w-12 h-12 text-text-muted" />
//           </div>
//           <h2 className="text-2xl font-display font-bold text-text mb-3">
//             Please Login
//           </h2>
//           <p className="text-text-muted mb-6">
//             You need to be logged in to access your profile
//           </p>
//           <button 
//             onClick={() => window.location.href = '/login'}
//             className="btn btn-primary"
//           >
//             Login to Your Account
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 fade-in">
//       <div className="container-narrow">
//         <div className="bg-card rounded-2xl shadow-lg overflow-hidden mb-6 gradient-border">
//           <div className="relative h-32 bg-gradient-primary">
//             <div className="absolute inset-0 bg-black/20"></div>
//           </div>
          
//           <div className="relative px-6 pb-6">
//             <div className="absolute -top-12 left-6">
//               <div className="relative group">
//                 <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl border-4 border-card overflow-hidden">
//                   {currentAvatar && currentAvatar !== '/placeholder-profile.png' ? (
//                     <img 
//                       src={currentAvatar} 
//                       alt="Profile" 
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <span className="text-3xl font-bold text-white">
//                       {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
//                     </span>
//                   )}
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 flex gap-1">
//                   <button 
//                     onClick={handleAvatarClick}
//                     disabled={uploadingAvatar}
//                     className="p-1.5 rounded-full bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50"
//                     title="Change profile picture"
//                   >
//                     {uploadingAvatar ? (
//                       <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     ) : (
//                       <Camera size={12} />
//                     )}
//                   </button>
//                   {currentAvatar && currentAvatar !== '/placeholder-profile.png' && (
//                     <button 
//                       onClick={confirmDeleteAvatar}
//                       disabled={uploadingAvatar}
//                       className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
//                       title="Delete profile picture"
//                     >
//                       <X size={12} />
//                     </button>
//                   )}
//                 </div>
//                 <input
//                   ref={fileInputRef}
//                   type="file"
//                   accept="image/jpeg,image/jpg,image/png,image/webp"
//                   onChange={handleAvatarChange}
//                   className="hidden"
//                 />
//               </div>
//             </div>

//             <div className="pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
//               <div>
//                 <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
//                   {currentUser?.name || 'User'}
//                 </h1>
//                 <p className="text-text-muted mt-1">{currentUser?.email}</p>
//                 <div className="flex items-center gap-2 mt-3 flex-wrap">
//                   {currentUser?.verify_email ? (
//                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
//                       <CheckCircle size={12} />
//                       Verified
//                     </span>
//                   ) : (
//                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
//                       <AlertCircle size={12} />
//                       Pending Verification
//                     </span>
//                   )}
//                   {currentUser?.role === 'admin' && (
//                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-primary text-white">
//                       <Shield size={12} />
//                       Admin
//                     </span>
//                   )}
//                   {currentUser?.role === 'user' && (
//                     <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
//                       <User size={12} />
//                       Member
//                     </span>
//                   )}
//                 </div>
//               </div>

//               {!editMode ? (
//                 <button
//                   onClick={handleEdit}
//                   className="btn btn-primary flex items-center gap-2 px-6 py-3"
//                 >
//                   <Edit size={18} />
//                   Edit Profile
//                 </button>
//               ) : (
//                 <div className="flex gap-3">
//                   <button
//                     onClick={handleSave}
//                     disabled={loading}
//                     className="btn btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50"
//                   >
//                     {loading ? (
//                       <>
//                         <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                         Saving...
//                       </>
//                     ) : (
//                       <>
//                         <Save size={18} />
//                         Save Changes
//                       </>
//                     )}
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     className="btn btn-outline flex items-center gap-2 px-6 py-3"
//                   >
//                     <X size={18} />
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Cards */}
//         {isLoadingStats ? (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             {[...Array(4)].map((_, i) => (
//               <div key={i} className="bg-card rounded-xl border border-border p-4 animate-pulse">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <div className="h-4 bg-bg-alt rounded w-20 mb-2"></div>
//                     <div className="h-8 bg-bg-alt rounded w-12"></div>
//                   </div>
//                   <div className="w-12 h-12 rounded-full bg-bg-alt"></div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
//             <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-text-muted text-sm">Total Orders</p>
//                   <p className="text-2xl font-bold text-text">{stats.totalOrders}</p>
//                   {stats.pendingOrders > 0 && (
//                     <p className="text-xs text-warning mt-1">{stats.pendingOrders} pending</p>
//                   )}
//                   {stats.deliveredOrders > 0 && (
//                     <p className="text-xs text-success mt-1">{stats.deliveredOrders} delivered</p>
//                   )}
//                 </div>
//                 <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                   <ShoppingBag className="w-6 h-6 text-primary" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-text-muted text-sm">Saved Addresses</p>
//                   <p className="text-2xl font-bold text-text">{stats.savedAddresses}</p>
//                 </div>
//                 <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
//                   <MapPin className="w-6 h-6 text-accent" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-text-muted text-sm">Wishlist Items</p>
//                   <p className="text-2xl font-bold text-text">{stats.wishlistCount}</p>
//                 </div>
//                 <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
//                   <Heart className="w-6 h-6 text-red-500" />
//                 </div>
//               </div>
//             </div>

//             <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-text-muted text-sm">Total Spent</p>
//                   <p className="text-2xl font-bold gradient-text">
//                     ₹{stats.totalSpent.toLocaleString()}
//                   </p>
//                 </div>
//                 <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
//                   <TrendingUp className="w-6 h-6 text-success" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
//           <div className="px-6 py-4 border-b border-border bg-bg-alt">
//             <h2 className="text-xl font-display font-semibold text-text">Personal Information</h2>
//             <p className="text-text-muted text-sm">Manage your personal details and contact information</p>
//           </div>
          
//           <div className="p-6">
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
//                     <User size={16} className="text-primary" />
//                     Full Name
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="text"
//                       name="name"
//                       value={userData.name}
//                       onChange={handleChange}
//                       className="w-full px-4 py-2 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
//                       placeholder="Enter your full name"
//                     />
//                   ) : (
//                     <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
//                       {currentUser?.name || 'Not provided'}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
//                     <Mail size={16} className="text-primary" />
//                     Email Address
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="email"
//                       name="email"
//                       value={userData.email}
//                       onChange={handleChange}
//                       className="w-full px-4 py-2 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
//                       placeholder="Enter your email"
//                     />
//                   ) : (
//                     <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
//                       {currentUser?.email || 'Not provided'}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-6">
//                 <div>
//                   <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
//                     <Phone size={16} className="text-primary" />
//                     Phone Number
//                   </label>
//                   {editMode ? (
//                     <input
//                       type="tel"
//                       name="mobile"
//                       value={userData.mobile}
//                       onChange={handleChange}
//                       className="w-full px-4 py-2 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
//                       placeholder="Enter 10-digit phone number"
//                       maxLength={10}
//                     />
//                   ) : (
//                     <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
//                       {currentUser?.mobile || 'Not added'}
//                     </div>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
//                     <Calendar size={16} className="text-primary" />
//                     Member Since
//                   </label>
//                   <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
//                     {currentUser?.createdAt 
//                       ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
//                           year: 'numeric',
//                           month: 'long',
//                           day: 'numeric'
//                         })
//                       : 'N/A'
//                     }
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {!currentUser?.verify_email && (
//               <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
//                 <div className="flex items-start gap-3">
//                   <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
//                   <div>
//                     <h4 className="font-semibold text-yellow-800">Email Not Verified</h4>
//                     <p className="text-sm text-yellow-700 mt-1">
//                       Please verify your email address to access all features and receive order updates.
//                     </p>
//                     <button className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline">
//                       Resend Verification Email →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

        
//       </div>

//       {/* DeleteConfirmBox for Profile Picture */}
//       {showDeleteConfirm && (
//         <DeleteConfirmBox
//           close={cancelDeleteAvatar}
//           cancel={cancelDeleteAvatar}
//           confirm={handleDeleteAvatar}
//           itemName="your profile picture"
//         />
//       )}
//     </div>
//   );
// };

// export default Profile;

import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import summaryApi from '../common/summartApi';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';
import { DeleteConfirmBox } from '../components/ConfirmBox';
import { 
  User, Mail, Phone, Edit, Save, X, Calendar, 
  ShoppingBag, MapPin, Shield, CheckCircle, 
  AlertCircle, Camera, Award, Heart, Settings, TrendingUp 
} from 'lucide-react';

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalSpent: 0,
    savedAddresses: 0,
    wishlistCount: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0
  });
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token') || 
                    document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
      if (!token) return;
      
      const res = await axios({
        ...summaryApi().getUserDetail,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        const userDataFromBackend = res.data.user || res.data.data;
        
        dispatch(setUser(userDataFromBackend));
        localStorage.setItem('user', JSON.stringify(userDataFromBackend));
        
        setUserData({
          name: userDataFromBackend.name || '',
          email: userDataFromBackend.email || '',
          mobile: userDataFromBackend.mobile || ''
        });
        
        const profileUrl = userDataFromBackend.profile || userDataFromBackend.avatar || null;
        setAvatarPreview(profileUrl);
        
        return userDataFromBackend;
      }
    } catch (error) {
      // Silent fail
    }
    return null;
  };
  
  const fetchUserOrders = async () => {
    try {
      const token = localStorage.getItem('token') || 
                    document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
      if (!token) return;
      
      const res = await axios({
        ...summaryApi().getMyOrders,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        const orders = res.data.orders || res.data.data || [];
        
        const totalOrders = orders.length;
        
        const totalSpent = orders
          .filter(order => {
            const status = order.orderStatus || order.status;
            return status === 'delivered';
          })
          .reduce((sum, order) => {
            const amount = order.totalAmount || order.total || order.amount || 0;
            return sum + amount;
          }, 0);
        
        const pendingOrders = orders.filter(order => {
          const status = order.orderStatus || order.status;
          return status === 'pending' || status === 'processing';
        }).length;
        
        const deliveredOrders = orders.filter(order => {
          const status = order.orderStatus || order.status;
          return status === 'delivered';
        }).length;
        
        const cancelledOrders = orders.filter(order => {
          const status = order.orderStatus || order.status;
          return status === 'cancelled';
        }).length;
        
        setStats(prev => ({
          ...prev,
          totalOrders,
          totalSpent,
          pendingOrders,
          deliveredOrders,
          cancelledOrders
        }));
        
        return orders;
      }
    } catch (error) {
      // Silent fail
    }
    return [];
  };
  
  const fetchAddresses = async () => {
    try {
      const token = localStorage.getItem('token') || 
                    document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
      if (!token) return;
      
      const res = await axios({
        ...summaryApi().getAddresses,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        const addresses = res.data.data || res.data.addresses || [];
        setStats(prev => ({
          ...prev,
          savedAddresses: addresses.length
        }));
      }
    } catch (error) {
      // Silent fail
    }
  };
  
  const fetchWishlist = async () => {
    try {
      const token = localStorage.getItem('token') || 
                    document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
      if (!token) return;
      
      const res = await axios({
        ...summaryApi().getWishlist,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        const wishlist = res.data.data || res.data.items || res.data.wishlist || [];
        setStats(prev => ({
          ...prev,
          wishlistCount: wishlist.length
        }));
      }
    } catch (error) {
      // Silent fail
    }
  };

  const calculateStatsFromUser = (userData) => {
    if (!userData) return;
    
    const orderHistory = userData.orderHistory || [];
    const addressDetails = userData.address_details || [];
    const wishlist = userData.wishlist || [];
    
    const totalOrders = orderHistory.length;
    const totalSpent = orderHistory
      .filter(order => {
        const status = order.orderStatus || order.status;
        return status === 'delivered';
      })
      .reduce((sum, order) => sum + (order.totalAmount || order.total || 0), 0);
    
    const pendingOrders = orderHistory.filter(order => {
      const status = order.orderStatus || order.status;
      return status === 'pending' || status === 'processing';
    }).length;
    
    const deliveredOrders = orderHistory.filter(order => {
      const status = order.orderStatus || order.status;
      return status === 'delivered';
    }).length;
    
    setStats(prev => ({
      ...prev,
      totalOrders: totalOrders || prev.totalOrders,
      totalSpent: totalSpent || prev.totalSpent,
      savedAddresses: addressDetails.length || prev.savedAddresses,
      wishlistCount: wishlist.length || prev.wishlistCount,
      pendingOrders: pendingOrders || prev.pendingOrders,
      deliveredOrders: deliveredOrders || prev.deliveredOrders
    }));
  };

  const loadAllData = async () => {
    setIsLoadingStats(true);
    
    await Promise.all([
      fetchUserDetails(),
      fetchUserOrders(),
      fetchAddresses(),
      fetchWishlist()
    ]);
    
    setIsLoadingStats(false);
  };

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        if (!user?.id) {
          dispatch(setUser(parsedUser));
        }
        
        setUserData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          mobile: parsedUser.mobile || ''
        });
        
        const profileUrl = parsedUser.profile || parsedUser.avatar || null;
        setAvatarPreview(profileUrl);
        
        calculateStatsFromUser(parsedUser);
      }
      
      await loadAllData();
    };
    
    loadUserData();
  }, []);

  useEffect(() => {
    if (user && user.id) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
      
      const profileUrl = user.profile || user.avatar || null;
      if (profileUrl) {
        setAvatarPreview(profileUrl);
      }
      
      calculateStatsFromUser(user);
    }
  }, [user]);

  const handleChange = (e) => {
    setUserData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setUserData({
      name: user.name || '',
      email: user.email || '',
      mobile: user.mobile || ''
    });
  };

  const handleSave = async () => {
    if (!userData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!userData.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (userData.mobile && !/^\d{10}$/.test(userData.mobile)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      
      const token = localStorage.getItem('token') || 
                    document.cookie.match(/accessToken=([^;]+)/)?.[1];

      const res = await axios({
        ...summaryApi().updateUser,
        data: userData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (res.data.success) {
        await fetchUserDetails();
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, or WEBP)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image size should be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setAvatarPreview(event.target.result);
    };
    reader.readAsDataURL(file);

    await uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    try {
      setUploadingAvatar(true);
      
      const imageFormData = new FormData();
      imageFormData.append('image', file);
      
      const uploadRes = await axios({
        ...summaryApi().uploadImage,
        data: imageFormData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      const imageUrl = uploadRes?.data?.imageUrl || uploadRes?.data?.url;
      
      if (!imageUrl) {
        toast.error("Failed to upload image");
        return;
      }
      
      const token = localStorage.getItem('token');
      
      const res = await axios({
        ...summaryApi().uploadAvatar,
        data: { image: imageUrl },
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true
      });
      
      if (res.data.success) {
        await fetchUserDetails();
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update");
        await fetchUserDetails();
      }
    } catch (error) {
      toast.error("Failed to upload profile picture");
      await fetchUserDetails();
    } finally {
      setUploadingAvatar(false);
    }
  };

  const confirmDeleteAvatar = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteAvatar = async () => {
    setShowDeleteConfirm(false);
    
    try {
      setUploadingAvatar(true);
      
      const token = localStorage.getItem('token') || 
                    document.cookie.match(/accessToken=([^;]+)/)?.[1];

      const res = await axios({
        ...summaryApi().deleteAvatar,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });

      if (res.data.success) {
        await fetchUserDetails();
        toast.success("Profile picture deleted successfully!");
      } else {
        toast.error(res.data.message || "Failed to delete avatar");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const cancelDeleteAvatar = () => {
    setShowDeleteConfirm(false);
  };

  const currentUser = user?.id ? user : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const currentAvatar = avatarPreview || currentUser?.profile || currentUser?.avatar || null;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-gray-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Please Login
          </h2>
          <p className="text-gray-500 mb-6">
            You need to be logged in to access your profile
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium"
          >
            Login to Your Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-cyan-500">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="relative px-6 pb-6">
            <div className="absolute -top-12 left-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center shadow-xl border-4 border-white overflow-hidden">
                  {currentAvatar && currentAvatar !== '/placeholder-profile.png' ? (
                    <img 
                      src={currentAvatar} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-white">
                      {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <button 
                    onClick={handleAvatarClick}
                    disabled={uploadingAvatar}
                    className="p-1.5 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                    title="Change profile picture"
                  >
                    {uploadingAvatar ? (
                      <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera size={12} />
                    )}
                  </button>
                  {currentAvatar && currentAvatar !== '/placeholder-profile.png' && (
                    <button 
                      onClick={confirmDeleteAvatar}
                      disabled={uploadingAvatar}
                      className="p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition disabled:opacity-50"
                      title="Delete profile picture"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>
            </div>

            <div className="pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                  {currentUser?.name || 'User'}
                </h1>
                <p className="text-gray-500 mt-1">{currentUser?.email}</p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {currentUser?.verify_email ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                      <AlertCircle size={12} />
                      Pending Verification
                    </span>
                  )}
                  {currentUser?.role === 'admin' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-600 to-cyan-500 text-white">
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                  {currentUser?.role === 'user' && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      <User size={12} />
                      Member
                    </span>
                  )}
                </div>
              </div>

              {!editMode ? (
                <button
                  onClick={handleEdit}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2 px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2 px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="border-2 border-gray-300 text-gray-700 flex items-center gap-2 px-6 py-3 rounded-lg font-medium hover:border-blue-600 hover:text-blue-600 transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {isLoadingStats ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="h-4 bg-gray-100 rounded w-20 mb-2"></div>
                    <div className="h-8 bg-gray-100 rounded w-12"></div>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gray-100"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalOrders}</p>
                  {stats.pendingOrders > 0 && (
                    <p className="text-xs text-yellow-600 mt-1">{stats.pendingOrders} pending</p>
                  )}
                  {stats.deliveredOrders > 0 && (
                    <p className="text-xs text-green-600 mt-1">{stats.deliveredOrders} delivered</p>
                  )}
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Saved Addresses</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.savedAddresses}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Wishlist Items</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.wishlistCount}</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Total Spent</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                    ₹{stats.totalSpent.toLocaleString()}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
            <p className="text-gray-500 text-sm">Manage your personal details and contact information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <User size={16} className="text-blue-600" />
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                      {currentUser?.name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-blue-600" />
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                      {currentUser?.email || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-blue-600" />
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="mobile"
                      value={userData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-600 transition"
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                    />
                  ) : (
                    <div className="text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                      {currentUser?.mobile || 'Not added'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-800 mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" />
                    Member Since
                  </label>
                  <div className="text-gray-800 bg-gray-100 p-3 rounded-lg border border-gray-200">
                    {currentUser?.createdAt 
                      ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'
                    }
                  </div>
                </div>
              </div>
            </div>

            {!currentUser?.verify_email && (
              <div className="mt-6 p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-yellow-800">Email Not Verified</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      Please verify your email address to access all features and receive order updates.
                    </p>
                    <button className="mt-2 text-sm font-medium text-yellow-800 hover:text-yellow-900 underline">
                      Resend Verification Email →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showDeleteConfirm && (
        <DeleteConfirmBox
          close={cancelDeleteAvatar}
          cancel={cancelDeleteAvatar}
          confirm={handleDeleteAvatar}
          itemName="your profile picture"
        />
      )}
    </div>
  );
};

export default Profile;