
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import DeliveryAddress from "./DeliveryAddress";
import toast from "react-hot-toast";
import ConfirmBox from "../components/ConfirmBox";
import {
  MapPin, Plus, Edit2, Trash2, CreditCard,
  Wallet, Truck, Shield, CheckCircle, Package,
  IndianRupee, ArrowRight, Home, Building, Phone
} from "lucide-react";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";

const CheckOutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [openAddress, setOpenAddress] = useState(false);
  const [addressToEdit, setAddressToEdit] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isProcessing, setIsProcessing] = useState(false);
const [addressToDelete, setAddressToDelete] = useState(null);

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
        if (res.data.data?.length > 0 && !selectedAddress) {
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
      setAddressToDelete(null);
    }
  } catch {
    toast.error("Failed to delete address");
  }
};

  const totalPrice = cartitems.reduce(
    (sum, item) => {
      const originalPrice = item.productId?.price || 0;
      const discount = item.productId?.discount || 0;
      const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
      return sum + (discountedPrice) * (item.quantity || 0);
    },
    0
  );

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    if (cartitems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    setIsProcessing(true);

    navigate(`/payment/${paymentMethod}`, {
      state: {
        selectedAddress,
        cartitems,
        totalPrice,
        subTotal: totalPrice
      },
    });
  };

  const getAddressIcon = (type) => {
    if (type?.toLowerCase() === 'home') return <Home size={14} />;
    if (type?.toLowerCase() === 'office') return <Building size={14} />;
    return <MapPin size={14} />;
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Checkout
            </h1>
          </div>
          <p className="text-gray-500 ml-4">
            Complete your purchase by selecting address and payment method
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-semibold text-gray-800">Delivery Address</h2>
                  </div>
                  <button
                    className="border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 text-sm py-2 px-4 rounded-lg flex items-center gap-2 transition"
                    onClick={() => {
                      setAddressToEdit(null);
                      setOpenAddress(true);
                    }}
                  >
                    <Plus size={14} />
                    Add New Address
                  </button>
                </div>
              </div>

              <div className="p-5">
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <MapPin className="w-8 h-8 text-gray-500" />
                    </div>
                    <p className="text-gray-500 mb-3">No addresses saved</p>
                    <button
                      onClick={() => setOpenAddress(true)}
                      className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm"
                    >
                      Add New Address
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => {
                      const isSelected = selectedAddress?._id === addr._id;
                      const addressType = addr.address_type || 'home';

                      return (
                        <div
                          key={addr._id}
                          className={`flex justify-between items-start p-4 rounded-xl border-2 transition-all cursor-pointer ${isSelected
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-blue-300"
                            }`}
                          onClick={() => setSelectedAddress(addr)}
                        >
                          <div className="flex gap-3 flex-1">
                            <input
                              type="radio"
                              checked={isSelected}
                              onChange={() => setSelectedAddress(addr)}
                              className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-600"
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-gray-800">
                                  {addr.name}
                                </span>
                                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                                  {getAddressIcon(addressType)}
                                  {addressType.charAt(0).toUpperCase() + addressType.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500">
                                {addr.address_line}
                              </p>
                              <p className="text-sm text-gray-500">
                                {addr.city}, {addr.state} - {addr.pincode}
                              </p>
                              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                <Phone size={14} />
                                {addr.mobile}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <button
                              className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAddressToEdit(addr);
                                setOpenAddress(true);
                              }}
                            >
                              <Edit2 size={14} />
                            </button>

                            <button
  className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
  onClick={(e) => {
    e.stopPropagation();
    setAddressToDelete(addr._id);
  }}
>
  <Trash2 size={14} />
</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-800">Payment Method</h2>
                </div>
              </div>

              <div className="p-5">
                <div className="grid sm:grid-cols-3 gap-4">
                  {[
                    { id: "cod", label: "Cash on Delivery", icon: Truck, desc: "Pay when delivered" },
                    { id: "card", label: "Card Payment", icon: CreditCard, desc: "Credit/Debit Card" },
                    { id: "upi", label: "UPI / Net Banking", icon: Wallet, desc: "Google Pay, PhonePe etc." },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === method.id
                          ? "border-blue-600 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
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
                      <div className="text-center">
                        <div className="flex justify-center mb-2">
                          <method.icon className={`w-8 h-8 ${paymentMethod === method.id ? "text-blue-600" : "text-gray-500"
                            }`} />
                        </div>
                        <p className="font-semibold text-gray-800 text-sm">{method.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-700">Secure Checkout</p>
                  <p className="text-xs text-gray-500">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 p-5 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-600" />
                Order Summary
              </h2>

              <div className="space-y-3 max-h-64 overflow-y-auto mb-4">
                {cartitems.map((item, i) => {
                  const originalPrice = item.productId?.price || 0;
                  const discount = item.productId?.discount || 0;
                  const discountedPrice = calculateDiscountedPrice(originalPrice, discount);

                  return (
                    <div key={i} className="flex gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.productId?.image?.[0] ? (
                          <img
                            src={item.productId.image[0]}
                            alt={item.productId?.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-6 h-6 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {item.productId?.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                          {discount > 0 && (
                            <span className="text-xs text-red-500">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold text-gray-800 text-sm">
                          {formatPrice(discountedPrice * item.quantity)}
                        </span>
                        {discount > 0 && (
                          <p className="text-xs text-gray-400 line-through">
                            {formatPrice(originalPrice * item.quantity)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-gray-800">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="text-gray-800">Included</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-800">Total</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing || addresses.length === 0}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl mt-5 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    Place Order
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Truck size={12} />
                    Free Delivery
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle size={12} />
                    Easy Returns
                  </span>
                  <span className="flex items-center gap-1">
                    <Shield size={12} />
                    Secure Payment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openAddress && (
        <DeliveryAddress
          onClose={() => {
            setOpenAddress(false);
            setAddressToEdit(null);
          }}
          refreshAddresses={fetchAddresses}
          addressToEdit={addressToEdit}
        />
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

export default CheckOutPage;