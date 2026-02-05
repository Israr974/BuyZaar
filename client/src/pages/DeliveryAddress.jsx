
import React, { useEffect, useState } from "react";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";

const DeliveryAddress = ({ onClose, refreshAddresses, addressToEdit }) => {
  const [formData, setFormData] = useState({
    addressLine: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    mobile: "",
  });

  useEffect(() => {
    if (addressToEdit) {
      setFormData({
        addressLine: addressToEdit.address_line, // ✅ map back
        city: addressToEdit.city,
        state: addressToEdit.state,
        pincode: addressToEdit.pincode,
        country: addressToEdit.country,
        mobile: addressToEdit.mobile,
      });
    }
  }, [addressToEdit]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        toast.success(addressToEdit ? "Address updated" : "Address added");
        refreshAddresses();
        onClose();
      }
    } catch (error) {
  let message = error?.response?.data?.message;

  if (message?.includes("mobile")) {
    message = "Please enter a valid 10-digit mobile number starting with 6–9";
  }

  toast.error(message || "Failed to save address");
}

    
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start py-12">
      <div className="card w-full max-w-2xl p-8 fade-in">
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-display gradient-text">
            {addressToEdit ? "Edit Address" : "Add New Address"}
          </h2>
          <button onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            className="input"
            name="addressLine"
            placeholder="Address Line"
            value={formData.addressLine}
            onChange={handleChange}
            required
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <input
              className="input"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="state"
              placeholder="State"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <input
              className="input"
              name="pincode"
              placeholder="Pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
            />
            <input
              className="input"
              name="country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <input
            className="input"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
          />

          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save Address
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeliveryAddress;
