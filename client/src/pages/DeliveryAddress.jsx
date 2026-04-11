import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { 
  X, MapPin, Home, Building, Navigation, 
  Phone, Mail, Save, AlertCircle, CheckCircle,
  User, LocateFixed
} from "lucide-react";

const DeliveryAddress = ({ onClose, refreshAddresses, addressToEdit }) => {
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    mobile: "",
    name: "",
    address_type: "home",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        addressLine: addressToEdit.address_line || "",
        city: addressToEdit.city || "",
        state: addressToEdit.state || "",
        pincode: addressToEdit.pincode || "",
        country: addressToEdit.country || "India",
        mobile: addressToEdit.mobile || "",
        name: addressToEdit.name || "",
        address_type: addressToEdit.address_type || "home",
      });
    }
  }, [addressToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!formData.addressLine.trim()) {
      newErrors.addressLine = "Address line is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    
    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode";
    }
    
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const api = addressToEdit
        ? summaryApi().updateAddress(addressToEdit._id)
        : summaryApi().addAddress;

      const payload = {
        address_line: formData.addressLine,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        mobile: formData.mobile,
        name: formData.name,
        address_type: formData.address_type,
      };

      const res = await Axios({
        ...api,
        data: payload,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        toast.success(addressToEdit ? "Address updated successfully!" : "Address added successfully!", {
          icon: <CheckCircle size={18} />,
          duration: 3000,
        });
        refreshAddresses();
        onClose();
      } else {
        toast.error(res.data.message || "Failed to save address");
      }
    } catch (error) {
      let message = error?.response?.data?.message || "Failed to save address";

      if (message?.includes("mobile")) {
        message = "Please enter a valid 10-digit mobile number starting with 6–9";
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 fade-in">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-zoom-in">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-display font-bold gradient-text">
                  {addressToEdit ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {addressToEdit ? "Update your delivery address" : "Add a new delivery address"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="overflow-y-auto p-5 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label className="label flex items-center gap-2">
                <User size={14} className="text-primary" />
                Full Name <span className="text-error">*</span>
              </label>
              <input
                className={`input ${errors.name ? 'border-error' : ''}`}
                name="name"
                placeholder="Enter recipient name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Address Line */}
            <div>
              <label className="label flex items-center gap-2">
                <MapPin size={14} className="text-primary" />
                Address Line <span className="text-error">*</span>
              </label>
              <textarea
                className={`input resize-none ${errors.addressLine ? 'border-error' : ''}`}
                name="addressLine"
                placeholder="House number, street, area"
                rows="2"
                value={formData.addressLine}
                onChange={handleChange}
              />
              {errors.addressLine && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.addressLine}
                </p>
              )}
            </div>

            {/* Address Type */}
            <div>
              <label className="label flex items-center gap-2">
                <Navigation size={14} className="text-primary" />
                Address Type
              </label>
              <div className="flex gap-3">
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  formData.address_type === 'home' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="address_type"
                    value="home"
                    checked={formData.address_type === 'home'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Home size={16} />
                  <span className="text-sm">Home</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  formData.address_type === 'office' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="address_type"
                    value="office"
                    checked={formData.address_type === 'office'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <Building size={16} />
                  <span className="text-sm">Office</span>
                </label>
                <label className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                  formData.address_type === 'other' 
                    ? 'border-primary bg-primary/5 text-primary' 
                    : 'border-border hover:border-primary/50'
                }`}>
                  <input
                    type="radio"
                    name="address_type"
                    value="other"
                    checked={formData.address_type === 'other'}
                    onChange={handleChange}
                    className="hidden"
                  />
                  <MapPin size={16} />
                  <span className="text-sm">Other</span>
                </label>
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-2">
                  City <span className="text-error">*</span>
                </label>
                <input
                  className={`input ${errors.city ? 'border-error' : ''}`}
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && (
                  <p className="mt-1 text-xs text-error">{errors.city}</p>
                )}
              </div>
              <div>
                <label className="label flex items-center gap-2">
                  State <span className="text-error">*</span>
                </label>
                <input
                  className={`input ${errors.state ? 'border-error' : ''}`}
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && (
                  <p className="mt-1 text-xs text-error">{errors.state}</p>
                )}
              </div>
            </div>

            {/* Pincode & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label flex items-center gap-2">
                  Pincode <span className="text-error">*</span>
                </label>
                <input
                  className={`input ${errors.pincode ? 'border-error' : ''}`}
                  name="pincode"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                />
                {errors.pincode && (
                  <p className="mt-1 text-xs text-error">{errors.pincode}</p>
                )}
              </div>
              <div>
                <label className="label flex items-center gap-2">
                  Country <span className="text-error">*</span>
                </label>
                <input
                  className="input"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="label flex items-center gap-2">
                <Phone size={14} className="text-primary" />
                Mobile Number <span className="text-error">*</span>
              </label>
              <input
                className={`input ${errors.mobile ? 'border-error' : ''}`}
                name="mobile"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
              />
              {errors.mobile && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.mobile}
                </p>
              )}
              <p className="mt-1 text-xs text-text-muted">
                We'll send order updates to this number
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-card border-t border-border p-5">
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline px-6 py-2.5 rounded-xl"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary px-6 py-2.5 rounded-xl flex items-center gap-2 min-w-[120px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Address
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliveryAddress;