import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import { 
  MapPin, Plus, Edit2, Trash2, Home, 
  Building, Phone, User,
  Building2, Package, Shield,
  Truck
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

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await Axios({
        ...summaryApi().getAddresses,
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setAddresses(res.data.data || []);
      }
    } catch {
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
      const token = localStorage.getItem("token");
      const res = await Axios({
        ...summaryApi().deleteAddress(id),
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        toast.success("Address deleted successfully");
        fetchAddresses();
        setAddressToDelete(null);
      }
    } catch {
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
      default:
        return {
          icon: <Package size={20} />,
          text: "Other",
          bg: "bg-purple-50",
          iconColor: "text-purple-600",
          badgeColor: "bg-purple-100 text-purple-700"
        };
    }
  };

  const filteredAddresses = addresses.filter(addr => {
    if (activeFilter === 'all') return true;
    return addr.address_type === activeFilter;
  });

  const stats = {
    total: addresses.length,
    home: addresses.filter(a => a.address_type === 'home').length,
    office: addresses.filter(a => a.address_type === 'office').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading your addresses...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
              My Addresses
            </h1>
          </div>
          <p className="text-gray-500 ml-4">
            Manage your delivery addresses for faster checkout
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Addresses</p>
                <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Home</p>
                <p className="text-2xl font-bold text-green-600">{stats.home}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <Home className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Office</p>
                <p className="text-2xl font-bold text-blue-600">{stats.office}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Building className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                activeFilter === 'all' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-blue-100'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter('home')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeFilter === 'home' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-blue-100'
              }`}
            >
              <Home size={16} />
              Home ({stats.home})
            </button>
            <button
              onClick={() => setActiveFilter('office')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 ${
                activeFilter === 'office' 
                  ? 'bg-blue-600 text-white shadow-md' 
                  : 'bg-gray-100 text-gray-500 hover:bg-blue-100'
              }`}
            >
              <Building size={16} />
              Office ({stats.office})
            </button>
          </div>
          
          <button
            onClick={() => setOpenAddress(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium hover:shadow-lg transition"
          >
            <Plus size={18} />
            Add New Address
          </button>
        </div>

        {filteredAddresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAddresses.map((addr) => {
              const config = getAddressTypeConfig(addr.address_type);

              return (
                <div
                  key={addr._id}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${config.bg}`}>
                          <div className={config.iconColor}>
                            {config.icon}
                          </div>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
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
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition"
                          title="Edit address"
                        >
                          <Edit2 size={16} className="text-gray-500 hover:text-blue-600" />
                        </button>
                        <button
                          onClick={() => setAddressToDelete(addr._id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition"
                          title="Delete address"
                        >
                          <Trash2 size={16} className="text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 mb-5">
                      <div className="flex items-start gap-2">
                        <MapPin size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm text-gray-800">{addr.address_line}</p>
                          <p className="text-xs text-gray-500">
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                          <p className="text-xs text-gray-500">{addr.country}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <User size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-500">{addr.name}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-gray-500" />
                        <span className="text-sm text-gray-500">{addr.mobile}</span>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-2 rounded-lg text-sm flex items-center justify-center gap-2 hover:shadow-lg transition">
                      <Truck size={14} />
                      Deliver to this Address
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center mb-6">
                <MapPin className="w-12 h-12 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-3">
                No Addresses Found
              </h2>
              <p className="text-gray-500 mb-6">
                {activeFilter === 'all' 
                  ? "You haven't added any addresses yet. Add your first address to get started."
                  : `No ${activeFilter} addresses found. Try a different category or add a new address.`
                }
              </p>
              <button
                onClick={() => setOpenAddress(true)}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition"
              >
                <Plus size={18} className="inline mr-2" />
                Add New Address
              </button>
            </div>
          </div>
        )}

        {addresses.length > 0 && (
          <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 border border-gray-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Address Security</h3>
                <p className="text-sm text-gray-500">
                  Your addresses are securely stored and only used for delivery purposes.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {(openAddress || addressToEdit) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
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
    </div>
  );
};

export default Address;