import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import { 
  MapPin, Plus, Edit2, Trash2, Home, 
  Building, Phone, User,
  Building2, Package, Globe, Shield,
  Clock, Truck, CheckCircle
} from "lucide-react";
import ConfirmBox from "../components/ConfirmBox";
import DeliveryAddress from "./DeliveryAddress";
import toast from "react-hot-toast";

const Address = () => {
  const [addresses, setAddresses] = useState([]);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  const token = localStorage.getItem("token");

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...summaryApi().getAddresses,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAddresses(res.data.data || []);
      }
    } catch (error) {
      console.error("Fetch address error:", error);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDeleteAddress = async (id) => {
    try {
      const res = await Axios({
        ...summaryApi().deleteAddress(id),
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Address deleted successfully");
        fetchAddresses();
        setAddressToDelete(null);
      }
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error("Failed to delete address");
    }
  };

  const getAddressTypeConfig = (type) => {
    switch (type?.toLowerCase()) {
      case "home":
        return {
          icon: <Home size={20} />,
          text: "Home",
          bg: "bg-green-50",
          iconColor: "text-green-600",
          badgeColor: "bg-green-100 text-green-700"
        };
      case "office":
        return {
          icon: <Building2 size={20} />,
          text: "Office",
          bg: "bg-blue-50",
          iconColor: "text-blue-600",
          badgeColor: "bg-blue-100 text-blue-700"
        };
      case "other":
        return {
          icon: <Package size={20} />,
          text: "Other",
          bg: "bg-purple-50",
          iconColor: "text-purple-600",
          badgeColor: "bg-purple-100 text-purple-700"
        };
      default:
        return {
          icon: <MapPin size={20} />,
          text: "Address",
          bg: "bg-gray-50",
          iconColor: "text-gray-600",
          badgeColor: "bg-gray-100 text-gray-700"
        };
    }
  };

  const filteredAddresses = addresses.filter(addr => {
    if (activeFilter === 'all') return true;
    return addr.address_type?.toLowerCase() === activeFilter;
  });

  const stats = {
    total: addresses.length,
    home: addresses.filter(a => a.address_type?.toLowerCase() === 'home').length,
    office: addresses.filter(a => a.address_type?.toLowerCase() === 'office').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-6 md:p-8 fade-in">
        <div className="container-narrow">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="spinner w-12 h-12 mb-4"></div>
              <p className="text-text-muted">Loading your addresses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text">
              My Addresses
            </h1>
          </div>
          <p className="text-text-muted ml-4">
            Manage your delivery addresses for faster checkout
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Addresses</p>
                <p className="text-2xl font-bold gradient-text">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Home Addresses</p>
                <p className="text-2xl font-bold gradient-text">{stats.home}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Office Addresses</p>
                <p className="text-2xl font-bold gradient-text">{stats.office}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-card rounded-xl border border-border">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`btn ${activeFilter === 'all' ? 'btn-primary' : 'btn-outline'} px-5 py-2.5`}
            >
              <Globe size={16} className="mr-2" />
              All Addresses
            </button>
            <button
              onClick={() => setActiveFilter('home')}
              className={`btn ${activeFilter === 'home' ? 'btn-primary' : 'btn-outline'} px-5 py-2.5`}
            >
              <Home size={16} className="mr-2" />
              Home
            </button>
            <button
              onClick={() => setActiveFilter('office')}
              className={`btn ${activeFilter === 'office' ? 'btn-primary' : 'btn-outline'} px-5 py-2.5`}
            >
              <Building size={16} className="mr-2" />
              Office
            </button>
          </div>
          
          <button
            onClick={() => setOpenAddress(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <Plus size={18} />
            Add New Address
          </button>
        </div>

        {/* Addresses Grid */}
        {filteredAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAddresses.map((addr) => {
              const config = getAddressTypeConfig(addr.address_type);

              return (
                <div
                  key={addr._id}
                  className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${config.bg}`}>
                          <div className={config.iconColor}>
                            {config.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-text">
                            {addr.name || "My Address"}
                          </h3>
                          <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full ${config.badgeColor}`}>
                            {config.text}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => setAddressToEdit(addr)}
                          className="p-1.5 hover:bg-primary/10 rounded-lg transition"
                          title="Edit address"
                        >
                          <Edit2 size={16} className="text-text-muted hover:text-primary" />
                        </button>
                        <button
                          onClick={() => setAddressToDelete(addr._id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition"
                          title="Delete address"
                        >
                          <Trash2 size={16} className="text-text-muted hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    {/* Address Details */}
                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-text-muted mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-text">{addr.address_line}</p>
                          <p className="text-xs text-text-muted">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-xs text-text-muted">{addr.country}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User size={14} className="text-text-muted" />
                        <span className="text-sm text-text-muted">{addr.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-text-muted" />
                        <span className="text-sm text-text-muted">{addr.mobile}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        toast.success("Address selected for delivery");
                      }}
                      className="w-full btn btn-primary py-2 text-sm flex items-center justify-center gap-2"
                    >
                      <Truck size={14} />
                      Deliver to this Address
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-6">
                <MapPin className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-text mb-3">
                No Addresses Found
              </h2>
              <p className="text-text-muted mb-6">
                {activeFilter === 'all' 
                  ? "You haven't added any addresses yet. Add your first address to get started."
                  : `No ${activeFilter} addresses found. Try adding one or check other filters.`
                }
              </p>
              <button
                onClick={() => setOpenAddress(true)}
                className="btn btn-primary px-6 py-3"
              >
                <Plus size={18} className="mr-2" />
                Add New Address
              </button>
            </div>
          </div>
        )}

        {/* Security Note */}
        {addresses.length > 0 && (
          <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-text mb-1">Address Security</h3>
                <p className="text-sm text-text-muted">
                  Your addresses are securely stored and only used for delivery purposes. 
                  We never share your address information with third parties.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Sync Info */}
        <div className="mt-6 text-center text-text-muted text-sm">
          <p className="flex items-center justify-center gap-2">
            <Clock size={14} />
            Addresses are synced across all your devices
            <span className="mx-2">•</span>
            <Shield size={14} />
            End-to-end encrypted storage
          </p>
        </div>
      </div>

      {/* Add/Edit Address Modal */}
      {(openAddress || addressToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <DeliveryAddress
              onClose={() => {
                setOpenAddress(false);
                setAddressToEdit(null);
              }}
              refreshAddresses={fetchAddresses}
              addressToEdit={addressToEdit}
            />
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {addressToDelete && (
        <ConfirmBox
          title="Delete Address"
          message="Are you sure you want to delete this address? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          confirmColor="red"
          close={() => setAddressToDelete(null)}
          cancel={() => setAddressToDelete(null)}
          confirm={() => handleDeleteAddress(addressToDelete)}
        />
      )}
    </div>
  );
};

export default Address;