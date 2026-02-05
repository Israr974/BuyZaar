import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import summaryApi from '../common/summartApi';
import toast from 'react-hot-toast';
import { setUser } from '../redux/userSlice';
import { User, Mail, Phone, Edit, Save, X, Calendar } from 'lucide-react';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Please login to view profile</h2>
          <p className="text-gray-500">You need to be logged in to access your profile</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <span className="text-2xl font-bold text-white">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name || 'User'}</h1>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    user.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {user.status || 'active'}
                  </span>
                  {user.role && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {user.role}
                    </span>
                  )}
                </div>
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
                      <div className="spinner"></div>
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

          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-6">
                <div>
                  <label className="label flex items-center gap-2">
                    <User size={16} />
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
                    <div className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {user.name || 'Not provided'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Mail size={16} />
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
                    <div className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {user.email || 'Not provided'}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label flex items-center gap-2">
                    <Phone size={16} />
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
                    <div className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {user.mobile || 'Not added'}
                    </div>
                  )}
                </div>

                <div>
                  <label className="label flex items-center gap-2">
                    <Calendar size={16} />
                    Member Since
                  </label>
                  <div className="text-lg font-medium text-gray-900 bg-gray-50 p-3 rounded-lg">
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
          </div>
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Orders</h3>
              <span className="text-2xl font-bold text-primary">{user.orderHistory?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Total orders placed</p>
            <button className="mt-4 text-primary hover:text-primary-dark text-sm font-medium">
              View Order History →
            </button>
          </div>

          
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Saved Addresses</h3>
              <span className="text-2xl font-bold text-primary">{user.address_details?.length || 0}</span>
            </div>
            <p className="text-sm text-gray-600">Delivery addresses saved</p>
            <button className="mt-4 text-primary hover:text-primary-dark text-sm font-medium">
              Manage Addresses →
            </button>
          </div>

        
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Account Status</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.verify_email 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.verify_email ? 'Verified' : 'Pending'}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {user.verify_email 
                ? 'Your email is verified' 
                : 'Please verify your email address'
              }
            </p>
            {!user.verify_email && (
              <button className="mt-4 text-primary hover:text-primary-dark text-sm font-medium">
                Resend Verification →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;