// import React, { useEffect, useState } from "react";
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import { 
//   X, MapPin, Home, Building, Navigation, 
//   Phone, Save, AlertCircle, User
// } from "lucide-react";

// const DeliveryAddress = ({ onClose, refreshAddresses, addressToEdit }) => {
//   const [formData, setFormData] = useState({
//     name: "",
//     address_line: "",
//     city: "",
//     state: "",
//     pincode: "",
//     country: "India",
//     mobile: "",
//     address_type: "home",
//   });

//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     const originalOverflow = document.body.style.overflow;
//     const originalPaddingRight = document.body.style.paddingRight;
//     const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
//     document.body.style.overflow = 'hidden';
//     document.body.style.paddingRight = `${scrollbarWidth}px`;
    
//     return () => {
//       document.body.style.overflow = originalOverflow;
//       document.body.style.paddingRight = originalPaddingRight;
//     };
//   }, []);

//   useEffect(() => {
//     if (addressToEdit) {
//       setFormData({
//         name: addressToEdit.name || "",
//         address_line: addressToEdit.address_line || "",
//         city: addressToEdit.city || "",
//         state: addressToEdit.state || "",
//         pincode: addressToEdit.pincode || "",
//         country: addressToEdit.country || "India",
//         mobile: addressToEdit.mobile || "",
//         address_type: addressToEdit.address_type || "home",
//       });
//     }
//   }, [addressToEdit]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     if (errors[name]) {
//       setErrors({ ...errors, [name]: "" });
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = "Name is required";
//     if (!formData.address_line.trim()) newErrors.address_line = "Address line is required";
//     if (!formData.city.trim()) newErrors.city = "City is required";
//     if (!formData.state.trim()) newErrors.state = "State is required";
    
//     if (!formData.pincode.trim()) {
//       newErrors.pincode = "Pincode is required";
//     } else if (!/^\d{6}$/.test(formData.pincode)) {
//       newErrors.pincode = "Enter a valid 6-digit pincode";
//     }
    
//     if (!formData.mobile.trim()) {
//       newErrors.mobile = "Mobile number is required";
//     } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
//       newErrors.mobile = "Enter a valid 10-digit mobile number";
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const token = localStorage.getItem("token");
//       const api = addressToEdit
//         ? summaryApi().updateAddress(addressToEdit._id)
//         : summaryApi().addAddress;

//       const payload = {
//         name: formData.name,
//         address_line: formData.address_line,
//         city: formData.city,
//         state: formData.state,
//         pincode: formData.pincode,
//         country: formData.country,
//         mobile: formData.mobile,
//         address_type: formData.address_type,
//       };

//       const res = await Axios({
//         ...api,
//         data: payload,
//         headers: {
//           Authorization: `Bearer ${token}`,
//           "Content-Type": "application/json",
//         },
//       });

//       if (res.data.success) {
//         toast.success(addressToEdit ? "Address updated successfully!" : "Address added successfully!");
//         refreshAddresses();
//         onClose();
//       } else {
//         toast.error(res.data.message || "Failed to save address");
//       }
//     } catch (error) {
//       const message = error?.response?.data?.message || "Failed to save address";
//       toast.error(message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleBackdropClick = (e) => {
//     if (e.target === e.currentTarget) {
//       onClose();
//     }
//   };

//   return (
//     <div 
//       className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm"
//       onClick={handleBackdropClick}
//     >
//       <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden">
//         {/* Header */}
//         <div className="flex-shrink-0 bg-card border-b border-border p-4 md:p-5">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-2 md:gap-3">
//               <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
//                 <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
//               </div>
//               <div>
//                 <h2 className="text-lg md:text-xl font-display font-bold gradient-text">
//                   {addressToEdit ? "Edit Address" : "Add New Address"}
//                 </h2>
//                 <p className="text-xs text-text-muted mt-0.5">
//                   {addressToEdit ? "Update your delivery address" : "Add a new delivery address"}
//                 </p>
//               </div>
//             </div>
//             <button
//               onClick={onClose}
//               className="p-1.5 md:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
//             >
//               <X size={18} className="md:w-5 md:h-5" />
//             </button>
//           </div>
//         </div>

//         {/* Form Body */}
//         <div className="flex-1 overflow-y-auto p-4 md:p-5">
//           <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
//             {/* Full Name */}
//             <div>
//               <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                 <User size={12} className="text-primary" />
//                 Full Name <span className="text-error">*</span>
//               </label>
//               <input
//                 className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
//                   errors.name ? 'border-error' : 'border-border'
//                 } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
//                 name="name"
//                 placeholder="Enter recipient name"
//                 value={formData.name}
//                 onChange={handleChange}
//               />
//               {errors.name && (
//                 <p className="mt-1 text-xs text-error flex items-center gap-1">
//                   <AlertCircle size={12} />
//                   {errors.name}
//                 </p>
//               )}
//             </div>

//             {/* Address Line */}
//             <div>
//               <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                 <MapPin size={12} className="text-primary" />
//                 Address Line <span className="text-error">*</span>
//               </label>
//               <textarea
//                 className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
//                   errors.address_line ? 'border-error' : 'border-border'
//                 } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none`}
//                 name="address_line"
//                 placeholder="House number, street, area"
//                 rows="2"
//                 value={formData.address_line}
//                 onChange={handleChange}
//               />
//               {errors.address_line && (
//                 <p className="mt-1 text-xs text-error flex items-center gap-1">
//                   <AlertCircle size={12} />
//                   {errors.address_line}
//                 </p>
//               )}
//             </div>

//             {/* Address Type */}
//             <div>
//               <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                 <Navigation size={12} className="text-primary" />
//                 Address Type
//               </label>
//               <div className="flex flex-wrap gap-2 md:gap-3">
//                 {[
//                   { value: "home", icon: Home, label: "Home" },
//                   { value: "office", icon: Building, label: "Office" },
//                   { value: "other", icon: MapPin, label: "Other" },
//                 ].map(({ value, icon: Icon, label }) => (
//                   <label
//                     key={value}
//                     className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border cursor-pointer transition-all text-xs md:text-sm ${
//                       formData.address_type === value
//                         ? "border-primary bg-primary/5 text-primary"
//                         : "border-border hover:border-primary/50"
//                     }`}
//                   >
//                     <input
//                       type="radio"
//                       name="address_type"
//                       value={value}
//                       checked={formData.address_type === value}
//                       onChange={handleChange}
//                       className="hidden"
//                     />
//                     <Icon size={14} className="md:w-4 md:h-4" />
//                     <span>{label}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* City & State */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
//               <div>
//                 <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                   City <span className="text-error">*</span>
//                 </label>
//                 <input
//                   className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
//                     errors.city ? 'border-error' : 'border-border'
//                   } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
//                   name="city"
//                   placeholder="City"
//                   value={formData.city}
//                   onChange={handleChange}
//                 />
//                 {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
//               </div>
//               <div>
//                 <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                   State <span className="text-error">*</span>
//                 </label>
//                 <input
//                   className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
//                     errors.state ? 'border-error' : 'border-border'
//                   } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
//                   name="state"
//                   placeholder="State"
//                   value={formData.state}
//                   onChange={handleChange}
//                 />
//                 {errors.state && <p className="mt-1 text-xs text-error">{errors.state}</p>}
//               </div>
//             </div>

//             {/* Pincode & Country */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
//               <div>
//                 <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                   Pincode <span className="text-error">*</span>
//                 </label>
//                 <input
//                   className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
//                     errors.pincode ? 'border-error' : 'border-border'
//                   } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
//                   name="pincode"
//                   placeholder="6-digit pincode"
//                   value={formData.pincode}
//                   onChange={handleChange}
//                   maxLength={6}
//                   inputMode="numeric"
//                 />
//                 {errors.pincode && <p className="mt-1 text-xs text-error">{errors.pincode}</p>}
//               </div>
//               <div>
//                 <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                   Country
//                 </label>
//                 <input
//                   className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-border bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             {/* Mobile Number */}
//             <div>
//               <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
//                 <Phone size={12} className="text-primary" />
//                 Mobile Number <span className="text-error">*</span>
//               </label>
//               <input
//                 className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
//                   errors.mobile ? 'border-error' : 'border-border'
//                 } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
//                 name="mobile"
//                 placeholder="10-digit mobile number"
//                 value={formData.mobile}
//                 onChange={handleChange}
//                 maxLength={10}
//                 inputMode="numeric"
//               />
//               {errors.mobile && (
//                 <p className="mt-1 text-xs text-error flex items-center gap-1">
//                   <AlertCircle size={12} />
//                   {errors.mobile}
//                 </p>
//               )}
//               <p className="mt-1 text-xs text-text-muted">
//                 We'll send order updates to this number
//               </p>
//             </div>
//           </form>
//         </div>

//         {/* Footer */}
//         <div className="flex-shrink-0 bg-card border-t border-border p-4 md:p-5">
//           <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl border border-border text-text hover:bg-bg-alt transition text-sm md:text-base"
//               disabled={isSubmitting}
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               onClick={handleSubmit}
//               disabled={isSubmitting}
//               className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition flex items-center justify-center gap-2 min-w-[120px] text-sm md:text-base disabled:opacity-50"
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                   <span>Saving...</span>
//                 </>
//               ) : (
//                 <>
//                   <Save size={16} />
//                   <span>Save Address</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DeliveryAddress;
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { 
  X, MapPin, Home, Building, Navigation, 
  Phone, Save, AlertCircle, User
} from "lucide-react";

const DeliveryAddress = ({ onClose, refreshAddresses, addressToEdit }) => {
  const [formData, setFormData] = useState({
    name: "",
    address_line: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    mobile: "",
    address_type: "home",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPaddingRight;
    };
  }, []);

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        name: addressToEdit.name || "",
        address_line: addressToEdit.address_line || "",
        city: addressToEdit.city || "",
        state: addressToEdit.state || "",
        pincode: addressToEdit.pincode || "",
        country: addressToEdit.country || "India",
        mobile: addressToEdit.mobile || "",
        address_type: addressToEdit.address_type || "home",
      });
    }
  }, [addressToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.address_line.trim()) newErrors.address_line = "Address line is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    
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
      const token = localStorage.getItem("token");
      const api = addressToEdit
        ? summaryApi().updateAddress(addressToEdit._id)
        : summaryApi().addAddress;

      const payload = {
        name: formData.name,
        address_line: formData.address_line,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        country: formData.country,
        mobile: formData.mobile,
        address_type: formData.address_type,
      };

      const res = await Axios({
        ...api,
        data: payload,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (res.data.success) {
        toast.success(addressToEdit ? "Address updated successfully!" : "Address added successfully!");
        refreshAddresses();
        onClose();
      } else {
        toast.error(res.data.message || "Failed to save address");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save address");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const addressTypes = [
    { value: "home", icon: Home, label: "Home" },
    { value: "office", icon: Building, label: "Office" },
    { value: "other", icon: MapPin, label: "Other" },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-black/60 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] md:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 bg-card border-b border-border p-4 md:p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="p-1.5 md:p-2 rounded-lg bg-primary/10">
                <MapPin className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-display font-bold gradient-text">
                  {addressToEdit ? "Edit Address" : "Add New Address"}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  {addressToEdit ? "Update your delivery address" : "Add a new delivery address"}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 md:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
            >
              <X size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-5">
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            {/* Full Name */}
            <div>
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                <User size={12} className="text-primary" />
                Full Name <span className="text-error">*</span>
              </label>
              <input
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
                  errors.name ? 'border-error' : 'border-border'
                } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
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
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                <MapPin size={12} className="text-primary" />
                Address Line <span className="text-error">*</span>
              </label>
              <textarea
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
                  errors.address_line ? 'border-error' : 'border-border'
                } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition resize-none`}
                name="address_line"
                placeholder="House number, street, area"
                rows="2"
                value={formData.address_line}
                onChange={handleChange}
              />
              {errors.address_line && (
                <p className="mt-1 text-xs text-error flex items-center gap-1">
                  <AlertCircle size={12} />
                  {errors.address_line}
                </p>
              )}
            </div>

            {/* Address Type */}
            <div>
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                <Navigation size={12} className="text-primary" />
                Address Type
              </label>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {addressTypes.map(({ value, icon: Icon, label }) => (
                  <label
                    key={value}
                    className={`flex items-center gap-1.5 md:gap-2 px-3 md:px-4 py-1.5 md:py-2 rounded-lg border cursor-pointer transition-all text-xs md:text-sm ${
                      formData.address_type === value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="address_type"
                      value={value}
                      checked={formData.address_type === value}
                      onChange={handleChange}
                      className="hidden"
                    />
                    <Icon size={14} className="md:w-4 md:h-4" />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* City & State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                  City <span className="text-error">*</span>
                </label>
                <input
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
                    errors.city ? 'border-error' : 'border-border'
                  } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
                {errors.city && <p className="mt-1 text-xs text-error">{errors.city}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                  State <span className="text-error">*</span>
                </label>
                <input
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
                    errors.state ? 'border-error' : 'border-border'
                  } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
                  name="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                />
                {errors.state && <p className="mt-1 text-xs text-error">{errors.state}</p>}
              </div>
            </div>

            {/* Pincode & Country */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                  Pincode <span className="text-error">*</span>
                </label>
                <input
                  className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
                    errors.pincode ? 'border-error' : 'border-border'
                  } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
                  name="pincode"
                  placeholder="6-digit pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength={6}
                  inputMode="numeric"
                />
                {errors.pincode && <p className="mt-1 text-xs text-error">{errors.pincode}</p>}
              </div>
              <div>
                <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                  Country
                </label>
                <input
                  className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border border-border bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Mobile Number */}
            <div>
              <label className="flex items-center gap-2 text-xs md:text-sm font-medium text-text mb-2">
                <Phone size={12} className="text-primary" />
                Mobile Number <span className="text-error">*</span>
              </label>
              <input
                className={`w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg border ${
                  errors.mobile ? 'border-error' : 'border-border'
                } bg-card text-text text-sm md:text-base focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition`}
                name="mobile"
                placeholder="10-digit mobile number"
                value={formData.mobile}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
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
        <div className="flex-shrink-0 bg-card border-t border-border p-4 md:p-5">
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 md:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl border border-border text-text hover:bg-bg-alt transition text-sm md:text-base"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-4 md:px-6 py-2 md:py-2.5 rounded-xl bg-primary text-white hover:bg-primary-dark transition flex items-center justify-center gap-2 min-w-[120px] text-sm md:text-base disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Save Address</span>
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