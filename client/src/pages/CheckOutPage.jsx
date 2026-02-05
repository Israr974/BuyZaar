import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import DeliveryAddress from "./DeliveryAddress";
import toast from "react-hot-toast";

const CheckOutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  const cartitems = useSelector((state) => state.cart.cartitems);
  const navigate = useNavigate();

  
  const fetchAddresses = async () => {
    try {
      const res = await Axios({
        ...summaryApi().getAddresses,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setAddresses(res.data.data || []);
        if (res.data.data?.length > 0) {
          setSelectedAddress(res.data.data[0]);
        }
      }
    } catch {
      toast.error("Failed to load addresses");
    }
  };

  
  useEffect(() => {
    fetchAddresses();
    
  }, []);

  
  const handleDeleteAddress = async (id) => {
    if (!window.confirm("Delete this address?")) return;

    try {
      const res = await Axios({
        ...summaryApi().deleteAddress(id),
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Address deleted");
        fetchAddresses();
      }
    } catch {
      toast.error("Failed to delete address");
    }
  };

  
  const totalPrice = cartitems.reduce(
    (sum, item) =>
      sum + (item.productId?.price || 0) * (item.quantity || 0),
    0
  );

  const formatINR = (value) =>
    value.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

 
  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Select delivery address");
      return;
    }

    navigate(`/payment/${paymentMethod}`, {
      state: { selectedAddress, cartitems, totalPrice },
      
    });
    
  };


  return (
    <div className="container-narrow section-padding grid lg:grid-cols-3 gap-8">
      
      <div className="lg:col-span-2 space-y-8">
        
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-display">Delivery Address</h2>
            <button
              className="btn btn-secondary text-sm"
              onClick={() => {
                setAddressToEdit(null);
                setOpenAddress(true);
              }}
            >
              + Add New
            </button>
          </div>

          <div className="space-y-4">
            {addresses.map((addr) => {
              const active = selectedAddress === addr;

              return (
                <div
                  key={addr._id}
                  className={`flex justify-between p-4 rounded-lg border
                    ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                >
                  <label className="flex gap-3 cursor-pointer">
                    <input
                      type="radio"
                      checked={active}
                      onChange={() => setSelectedAddress(addr)}
                     
                    />
                    <div className="text-sm">
                      <p className="font-medium">
                        {addr.address_line}, {addr.city}
                      </p>
                      <p className="text-text-muted">
                        {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-text-muted">📞 {addr.mobile}</p>
                    </div>
                  </label>

                  <div className="flex flex-col gap-2 text-sm">
                    <button
                      className="text-primary"
                      onClick={() => {
                        setAddressToEdit(addr);
                        setOpenAddress(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteAddress(addr._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        
        <div className="card p-6">
          <h2 className="text-xl font-display mb-4">Payment Method</h2>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { id: "cod", label: "Cash on Delivery" },
              { id: "card", label: "Card" },
              { id: "upi", label: "UPI / Net Banking" },
            ].map((method) => (
              <label
                key={method.id}
                className={`p-4 border rounded-lg text-center cursor-pointer
                  ${
                    paymentMethod === method.id
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={paymentMethod === method.id}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="hidden"
                />
                <p className="font-medium">{method.label}</p>
              </label>
            ))}
          </div>
        </div>
      </div>

      
      <div className="card p-6 sticky top-24 h-fit">
        <h2 className="text-xl font-display mb-4">Order Summary</h2>

        <div className="space-y-3 max-h-60 overflow-y-auto">
          {cartitems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>
                {item.productId?.name} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatINR(item.productId?.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span className="gradient-text">{formatINR(totalPrice)}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          className="btn btn-primary w-full mt-6"
        >
          Place Order
        </button>
      </div>

      {openAddress && (
        <DeliveryAddress
          onClose={() => setOpenAddress(false)}
          refreshAddresses={fetchAddresses}
          addressToEdit={addressToEdit}
        />
      )}
    </div>
  );
};

export default CheckOutPage;

