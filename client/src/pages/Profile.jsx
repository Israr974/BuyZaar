import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import summaryApi from '../common/summartApi';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';
import { 
  User, Mail, Phone, Edit, Save, X, Calendar, 
  ShoppingBag, MapPin, Shield, CheckCircle, 
  AlertCircle, Camera, Award,Heart,Settings, TrendingUp 
} from 'lucide-react';

const Profile = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    mobile: ''
  });

  useEffect(() => {
    if (user) {
      setUserData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || ''
      });
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
        const updatedUser = { ...user, ...userData };
        dispatch(setUser(updatedUser));
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
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

  if (!user?.id) {
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
        {/* Profile Header Card */}
        <div className="bg-card rounded-2xl shadow-lg overflow-hidden mb-6 gradient-border">
          <div className="relative h-32 bg-gradient-primary">
            {/* Cover Photo */}
            <div className="absolute inset-0 bg-black/20"></div>
            <button className="absolute right-4 bottom-4 p-2 rounded-lg bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition">
              <Camera size={18} />
            </button>
          </div>
          
          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="absolute -top-12 left-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl border-4 border-card">
                  <span className="text-3xl font-bold text-white">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <button className="absolute bottom-0 right-0 p-1.5 rounded-full bg-primary text-white hover:bg-primary-dark transition">
                  <Camera size={14} />
                </button>
              </div>
            </div>

            {/* Header Content */}
            <div className="pt-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
                  {user.name || 'User'}
                </h1>
                <p className="text-text-muted mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-3">
                  {user.verify_email ? (
                    <span className="badge bg-green-100 text-green-700 flex items-center gap-1">
                      <CheckCircle size={12} />
                      Verified
                    </span>
                  ) : (
                    <span className="badge bg-yellow-100 text-yellow-700 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Pending Verification
                    </span>
                  )}
                  {user.role === 'admin' && (
                    <span className="badge bg-gradient-primary text-white flex items-center gap-1">
                      <Shield size={12} />
                      Admin
                    </span>
                  )}
                  {user.role === 'user' && (
                    <span className="badge bg-blue-100 text-blue-700 flex items-center gap-1">
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
                        <div className="spinner w-4 h-4"></div>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="stat-card hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Orders</p>
                <p className="stat-number text-2xl">{user.orderHistory?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="stat-card hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Saved Addresses</p>
                <p className="stat-number text-2xl">{user.address_details?.length || 0}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-accent" />
              </div>
            </div>
          </div>

          <div className="stat-card hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Member Since</p>
                <p className="text-lg font-semibold text-text">
                  {user?.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-US', {
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

          <div className="stat-card hover:shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Spent</p>
                <p className="stat-number text-2xl">
                  ₹{(user.totalSpent || 0).toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-bg-alt">
            <h2 className="text-xl font-display font-semibold text-text">Personal Information</h2>
            <p className="text-text-muted text-sm">Manage your personal details and contact information</p>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <User size={16} className="text-primary" />
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter your full name"
                    />
                  ) : (
                    <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
                      {user.name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-primary" />
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter your email"
                    />
                  ) : (
                    <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
                      {user.email || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <Phone size={16} className="text-primary" />
                    Phone Number
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      name="mobile"
                      value={userData.mobile}
                      onChange={handleChange}
                      className="input"
                      placeholder="Enter 10-digit phone number"
                      pattern="[0-9]{10}"
                    />
                  ) : (
                    <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
                      {user.mobile || 'Not added'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2 mb-2">
                    <Calendar size={16} className="text-primary" />
                    Member Since
                  </label>
                  <div className="text-text bg-bg-alt p-3 rounded-lg border border-border">
                    {user?.createdAt 
                      ? new Date(user.createdAt).toLocaleDateString('en-US', {
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

            {/* Email Verification Notice */}
            {!user.verify_email && (
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

        {/* Quick Actions */}
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