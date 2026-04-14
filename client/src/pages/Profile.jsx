import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import summaryApi from '../common/summartApi';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';
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
  
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  // Function to fetch latest user details from backend
  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token') || 
                    document.cookie.match(/accessToken=([^;]+)/)?.[1];
      
      if (!token) {
        console.log("No token found");
        return;
      }
      
      const res = await axios({
        ...summaryApi().getUserDetail,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      
      if (res.data.success) {
        const userDataFromBackend = res.data.user;
        
        // Update Redux
        dispatch(setUser(userDataFromBackend));
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(userDataFromBackend));
        
        // Update state
        setUserData({
          name: userDataFromBackend.name || '',
          email: userDataFromBackend.email || '',
          mobile: userDataFromBackend.mobile || ''
        });
        
        // Update avatar preview
        const profileUrl = userDataFromBackend.profile || userDataFromBackend.avatar || null;
        setAvatarPreview(profileUrl);
        
        return userDataFromBackend;
      }
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
    return null;
  };

  // Load user data on component mount
  useEffect(() => {
    const loadUserData = async () => {
      // First try to get from localStorage
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        
        // Update Redux if not already there
        if (!user?.id) {
          dispatch(setUser(parsedUser));
        }
        
        // Update state
        setUserData({
          name: parsedUser.name || '',
          email: parsedUser.email || '',
          mobile: parsedUser.mobile || ''
        });
        
        // Set avatar preview
        const profileUrl = parsedUser.profile || parsedUser.avatar || null;
        setAvatarPreview(profileUrl);
      }
      
      // Always fetch fresh data from backend to ensure latest info
      await fetchUserDetails();
    };
    
    loadUserData();
  }, []);

  // Update state when Redux user changes
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
        // Fetch fresh user data after update
        await fetchUserDetails();
        toast.success("Profile updated successfully!");
        setEditMode(false);
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
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

    // Show preview immediately
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
        // Fetch fresh user data after upload
        await fetchUserDetails();
        toast.success("Profile picture updated successfully!");
      } else {
        toast.error(res.data.message || "Failed to update");
        // Revert preview on error
        await fetchUserDetails();
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload profile picture");
      // Revert preview on error
      await fetchUserDetails();
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!confirm("Are you sure you want to delete your profile picture?")) {
      return;
    }

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
        // Fetch fresh user data after delete
        await fetchUserDetails();
        toast.success("Profile picture deleted successfully!");
      } else {
        toast.error(res.data.message || "Failed to delete avatar");
      }
    } catch (error) {
      console.error("Avatar delete error:", error);
      toast.error(error.response?.data?.message || "Failed to delete profile picture");
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Get the current user data (from Redux or localStorage)
  const currentUser = user?.id ? user : (localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null);
  const currentAvatar = avatarPreview || currentUser?.profile || currentUser?.avatar || null;

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center fade-in">
        <div className="text-center p-8 max-w-md">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6">
            <User className="w-12 h-12 text-text-muted" />
          </div>
          <h2 className="text-2xl font-display font-bold text-text mb-3">
            Please Login
          </h2>
          <p className="text-text-muted mb-6">
            You need to be logged in to access your profile
          </p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="btn btn-primary"
          >
            Login to Your Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 fade-in">
      <div className="container-narrow">
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden mb-6 gradient-border">
          <div className="relative h-32 bg-gradient-primary">
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
          
          <div className="relative px-6 pb-6">
            <div className="absolute -top-12 left-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl border-4 border-card overflow-hidden">
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
                    className="p-1.5 rounded-full bg-primary text-white hover:bg-primary-dark transition disabled:opacity-50"
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
                      onClick={handleDeleteAvatar}
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
                <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
                  {currentUser?.name || 'User'}
                </h1>
                <p className="text-text-muted mt-1">{currentUser?.email}</p>
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
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-primary text-white">
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
                  className="btn btn-primary flex items-center gap-2 px-6 py-3"
                >
                  <Edit size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="btn btn-primary flex items-center gap-2 px-6 py-3 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
                    className="btn btn-outline flex items-center gap-2 px-6 py-3"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-text">{currentUser?.orderHistory?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Saved Addresses</p>
                <p className="text-2xl font-bold text-text">{currentUser?.address_details?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Member Since</p>
                <p className="text-lg font-semibold text-text">
                  {currentUser?.createdAt 
                    ? new Date(currentUser.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        year: 'numeric'
                      })
                    : 'N/A'
                  }
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Spent</p>
                <p className="text-2xl font-bold text-text">
                  ₹{(currentUser?.totalSpent || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-bg-alt">
            <h2 className="text-xl font-display font-semibold text-text">Personal Information</h2>
            <p className="text-text-muted text-sm">Manage your personal details and contact information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <User size={16} className="text-primary" />
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
                      {currentUser?.name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Mail size={16} className="text-primary" />
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
                      {currentUser?.email || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Phone size={16} className="text-primary" />
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="mobile"
                      value={userData.mobile}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-card text-text focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                    />
                  ) : (
                    <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
                      {currentUser?.mobile || 'Not added'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2 flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    Member Since
                  </label>
                  <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <button 
            onClick={() => window.location.href = '/dashboard/myorder'}
            className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all hover:-translate-y-1 text-center group"
          >
            <ShoppingBag className="w-6 h-6 mx-auto text-primary mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-text">My Orders</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/dashboard/address'}
            className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all hover:-translate-y-1 text-center group"
          >
            <MapPin className="w-6 h-6 mx-auto text-accent mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-text">Addresses</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/wishlist'}
            className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all hover:-translate-y-1 text-center group"
          >
            <Heart className="w-6 h-6 mx-auto text-primary mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-text">Wishlist</span>
          </button>
          
          <button 
            onClick={() => window.location.href = '/settings'}
            className="p-4 rounded-xl bg-card border border-border hover:shadow-md transition-all hover:-translate-y-1 text-center group"
          >
            <Settings className="w-6 h-6 mx-auto text-text-muted mb-2 group-hover:scale-110 transition" />
            <span className="text-sm font-medium text-text">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;