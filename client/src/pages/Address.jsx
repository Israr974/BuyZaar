
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import { 
  MapPin, Plus, Edit2, Trash2, Home, 
  Building, Navigation, Phone, User,
  Building2, Package, Globe, Shield,
  Clock, Truck
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
          border: "border-green-200",
          iconColor: "text-green-600",
          badgeColor: "badge-success"
        };
      case "office":
        return {
          icon: <Building2 size={20} />,
          text: "Office",
          bg: "bg-blue-50",
          border: "border-blue-200",
          iconColor: "text-blue-600",
          badgeColor: "badge-primary"
        };
      case "other":
        return {
          icon: <Package size={20} />,
          text: "Other",
          bg: "bg-purple-50",
          border: "border-purple-200",
          iconColor: "text-purple-600",
          badgeColor: "badge-accent"
        };
      default:
        return {
          icon: <MapPin size={20} />,
          text: "Address",
          bg: "bg-gray-50",
          border: "border-gray-200",
          iconColor: "text-gray-600",
          badgeColor: "badge-primary"
        };
    }
  };

  
  const filteredAddresses = addresses.filter(addr => {
    if (activeFilter === 'all') return true;
    return addr.address_type?.toLowerCase() === activeFilter;
  });

  
  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-6 md:p-8 fade-in">
        <div className="container-narrow">
          <div className="animate-pulse space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg w-64"></div>
                <div className="h-4 bg-gray-200 rounded w-48"></div>
              </div>
              <div className="h-14 bg-gray-200 rounded-xl w-48"></div>
            </div>

            <div className="flex gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg w-24"></div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-sm"
                  style={{ animationDelay: `${i * 0.1}s` }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

 
  const stats = {
    total: addresses.length,
    home: addresses.filter(a => a.address_type?.toLowerCase() === 'home').length,
    office: addresses.filter(a => a.address_type?.toLowerCase() === 'office').length,
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 fade-in">
      <div className="container-narrow">
       
        <div className="mb-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-display font-bold gradient-text mb-3">
                My Addresses
              </h1>
              <p className="text-text-muted text-lg">
                Manage your delivery addresses for faster checkout
              </p>
            </div>
            <button
              onClick={() => setOpenAddress(true)}
              className="btn btn-primary flex items-center gap-3 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Add New Address
            </button>
          </div>

         
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="card p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Total Addresses</p>
                  <p className="text-3xl font-bold text-text">{stats.total}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
                  <Home className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Home Addresses</p>
                  <p className="text-3xl font-bold text-text">{stats.home}</p>
                </div>
              </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                  <Building className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <p className="text-text-muted text-sm">Office Addresses</p>
                  <p className="text-3xl font-bold text-text">{stats.office}</p>
                </div>
              </div>
            </div>
          </div>

          
          
          <div className="flex flex-wrap gap-3 mb-8">
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
        </div>

        
        
        {filteredAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {filteredAddresses.map((addr) => {
              const config = getAddressTypeConfig(addr.address_type);

              return (
                <div
                  key={addr._id}
                  className="card card-hover"
                >
                  <div className="p-6">
                    
                    
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-lg ${config.bg}`}>
                          <div className={config.iconColor}>
                            {config.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-text">
                            {addr.name || "My Address"}
                          </h3>
                          <div className="mt-1">
                            <span className={`badge ${config.badgeColor}`}>
                              {config.text}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => setAddressToEdit(addr)}
                          className="p-2 hover:bg-primary/10 rounded-lg transition"
                          title="Edit address"
                        >
                          <Edit2 size={18} className="text-text-muted hover:text-primary" />
                        </button>
                        <button
                          onClick={() => setAddressToDelete(addr._id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition"
                          title="Delete address"
                        >
                          <Trash2 size={18} className="text-text-muted hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <MapPin size={18} className="text-text-muted mt-1 flex-shrink-0" />
                        <div>
                          <p className="font-medium text-text">{addr.address_line}</p>
                          <p className="text-sm text-text-muted">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-sm text-text-muted">{addr.country}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <User size={16} className="text-text-muted flex-shrink-0" />
                        <span className="text-sm text-text">{addr.name}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Phone size={16} className="text-text-muted flex-shrink-0" />
                        <span className="text-sm text-text">{addr.mobile}</span>
                      </div>
                    </div>

                    
                    <div className="pt-4 border-t border-border">
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            toast.success("Address selected for delivery");
                          }}
                          className="btn btn-primary flex-1"
                        >
                          <Truck size={16} className="mr-2" />
                          Use This Address
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          
          
          <div className="card p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-8 animate-float">
                <MapPin className="w-16 h-16 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-text mb-4">
                No Addresses Found
              </h2>
              <p className="text-text-muted mb-8">
                {activeFilter === 'all' 
                  ? "You haven't added any addresses yet. Add your first address to get started."
                  : `No ${activeFilter} addresses found. Try adding one or check other filters.`
                }
              </p>
              <button
                onClick={() => setOpenAddress(true)}
                className="btn btn-primary px-8 py-4"
              >
                <Plus size={20} className="mr-3" />
                Add New Address
              </button>
            </div>
          </div>
        )}

        
        
        {addresses.length > 0 && (
          <div className="card p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-50">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-text mb-1">Address Security</h3>
                <p className="text-sm text-text-muted">
                  Your addresses are securely stored and only used for delivery purposes. 
                  We never share your address information with third parties.
                </p>
              </div>
            </div>
          </div>
        )}

        
        
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

        
        
        <div className="text-center text-text-muted text-sm mt-12">
          <p className="flex items-center justify-center gap-2">
            <Clock size={14} />
            Addresses are synced across all your devices
            <span className="mx-2">•</span>
            <Shield size={14} />
            End-to-end encrypted storage
          </p>
        </div>
      </div>
    </div>
  );
};

export default Address;