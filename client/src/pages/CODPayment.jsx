import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Axios from "../utils/Axios"; 
import summaryApi from "../common/summartApi"; 
import toast from "react-hot-toast";
import { 
  Package, Truck, Wallet, CheckCircle, 
  MapPin, User, Phone, IndianRupee,
  Shield, Clock, Receipt, Sparkles,
  AlertCircle, ChevronRight, CreditCard
} from "lucide-react";

const CODPayment = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedAddress, cartitems, totalPrice, subTotal } = location.state || {};

  const handleConfirm = async () => {
  if (!selectedAddress || !selectedAddress._id) {
    toast.error("Please select a delivery address!");
    return;
  }

  if (!cartitems || cartitems.length === 0) {
    toast.error("Your cart is empty!");
    return;
  }

  setLoading(true);

  try {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("You must login first!");
      setLoading(false);
      return;
    }

    
    const payload = {
      items: cartitems.map(item => ({
        product: item.productId?._id || item._id,
        quantity: item.quantity
      })),
      shippingAddressId: selectedAddress._id, 
      paymentMethod: "COD", 
      discount: 0,
      notes: "COD Order"
    };

    
    payload.priceBreakdown = {
      subTotal: subTotal || totalPrice,
      shippingFee: 0,
      tax: 0,
      discount: 0,
      total: totalPrice
    };

    console.log("COD Order Payload:", JSON.stringify(payload, null, 2));

    const response = await Axios({
      ...summaryApi().placeOrder,
      data: payload,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    console.log("COD Order Response:", response.data);

    if (response.data.success) {
      toast.success("COD Order placed successfully!");
      
      
      navigate("/payment/success", {
        state: {
          order: response.data.order,
          paymentMethod: "Cash on Delivery",
          amount: totalPrice,
          orderNumber: response.data.order?.orderNumber,
          message: "Your order has been placed successfully. Pay on delivery."
        }
      });

      
       await Axios(summaryApi().clearCart);
    } else {
      toast.error(response.data.message || "Failed to place order");
    }

  } catch (error) {
    console.error("COD Payment Error Full:", error);
    
    if (error.response) {
     
      console.error("Error Status:", error.response.status);
      console.error("Error Data:", error.response.data);
      console.error("Error Headers:", error.response.headers);
      
      const errorMessage = error.response.data?.message || 
                          error.response.data?.error || 
                          "Failed to place order";
      
     
      if (error.response.status === 400) {
        if (error.response.data?.outOfStockProducts) {
          toast.error("Some products are out of stock!");
        
          console.log("Out of stock:", error.response.data.outOfStockProducts);
        } else if (error.response.data?.maxCODAmount) {
          toast.error(`COD limit is ₹${error.response.data.maxCODAmount}. Please use online payment.`);
        }
      } else if (error.response.status === 401) {
        toast.error("Session expired. Please login again.");
        localStorage.removeItem("token");
        navigate("/login");
      } else if (error.response.status === 404) {
        toast.error("Address not found. Please select a valid address.");
      } else {
        toast.error(errorMessage);
      }
    } else if (error.request) {
      
      console.error("No response received:", error.request);
      toast.error("Network error. Please check your connection.");
    } else {
      
      console.error("Error:", error.message);
      toast.error(error.message || "Something went wrong");
    }
  } finally {
    setLoading(false);
  }
};

  const getDeliveryEstimate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + 3);
    return deliveryDate.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    });
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8 fade-in">
      <div className="container-narrow">
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent/80 mb-6 animate-float">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold gradient-text mb-4">
            Cash on Delivery
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Place your order now and pay in cash when it arrives at your doorstep
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-8">
            
            <div className="card card-hover p-8">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10">
                  <Wallet className="w-8 h-8 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-display font-bold text-text">
                    How Cash on Delivery Works
                  </h2>
                  <p className="text-text-muted mt-1">
                    Simple, secure, and convenient payment at delivery
                  </p>
                </div>
                <ChevronRight className="text-primary/40" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-xl bg-gradient-to-b from-white to-primary/5 border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-text mb-2">Place Order</h3>
                  <p className="text-sm text-text-muted">
                    Order without any upfront payment
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-b from-white to-primary/5 border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-text mb-2">We Ship</h3>
                  <p className="text-sm text-text-muted">
                    Prepare and dispatch within 24 hours
                  </p>
                </div>

                <div className="text-center p-6 rounded-xl bg-gradient-to-b from-white to-primary/5 border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-text mb-2">Pay & Receive</h3>
                  <p className="text-sm text-text-muted">
                    Pay cash when you receive your order
                  </p>
                </div>
              </div>
            </div>

            
            <div className="card p-8">
              <div className="flex items-start gap-6">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5">
                  <AlertCircle className="w-8 h-8 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-display font-bold text-text mb-4">
                    Important Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text">Exact Change</h4>
                          <p className="text-sm text-text-muted">
                            Please have exact change ready for delivery
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text">Verify Items</h4>
                          <p className="text-sm text-text-muted">
                            Check all items before making payment
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text">Order ID</h4>
                          <p className="text-sm text-text-muted">
                            Keep order ID ready for verification
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <h4 className="font-medium text-text">Payment Amount</h4>
                          <p className="text-sm text-text-muted">
                            ₹{totalPrice} will be collected upon delivery
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            
            <div className="card p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-blue-50">
                    <Truck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-text text-xl">
                      Delivery Timeline
                    </h3>
                    <p className="text-text-muted text-sm">
                      Estimated arrival date
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    {getDeliveryEstimate()}
                  </div>
                  <div className="text-sm text-text-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Usually 3-5 business days
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div className="space-y-8">
            
            <div className="card card-hover p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Receipt className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-display font-bold text-text">
                  Order Summary
                </h2>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted">Subtotal</span>
                  <span className="font-medium text-text">
                    ₹{subTotal || totalPrice}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted">Shipping</span>
                  <span className="badge badge-success">FREE</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-text-muted">Taxes</span>
                  <span className="font-medium text-text">
                    ₹{Math.round((totalPrice - (subTotal || totalPrice)) * 100) / 100 || 0}
                  </span>
                </div>
                <div className="pt-4 border-t border-border">
                  <div className="flex justify-between items-center py-3">
                    <span className="text-lg font-bold text-text">Total Amount</span>
                    <span className="text-2xl font-bold gradient-text">
                      ₹{totalPrice}
                    </span>
                  </div>
                  <div className="badge badge-primary mt-2">
                    Payable upon delivery
                  </div>
                </div>
              </div>

             
              <button
                onClick={handleConfirm}
                disabled={loading}
                className="btn btn-primary w-full py-4 text-lg font-semibold group"
              >
                {loading ? (
                  <>
                    <div className="spinner mr-3"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-3" />
                    Confirm COD Order
                    <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-text-muted mt-4">
                No online payment required • 100% Secure
              </p>
            </div>

            
            {selectedAddress && (
              <div className="card card-hover p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-text">
                    Delivery Address
                  </h3>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gradient-to-r from-primary/5 to-accent/5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-text">{selectedAddress.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="w-3 h-3 text-text-muted" />
                          <span className="text-sm text-text-muted">{selectedAddress.mobile}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-text font-medium">{selectedAddress.address_line}</p>
                      <p className="text-sm text-text-muted">
                        {selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="badge badge-accent">
                          {selectedAddress.address_type || 'Home'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            
            <div className="card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Shield className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-xl font-display font-bold text-text">
                  COD Benefits
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-text">
                    No risk online payment
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-text">
                    Pay only after inspection
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-text">
                    Easy cash payment
                  </span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 transition">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium text-text">
                    No card details required
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="mt-16 text-center">
          <div className="glass max-w-3xl mx-auto p-8 rounded-2xl">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
              <h4 className="text-xl font-display font-bold gradient-text">
                100% Secure Cash on Delivery
              </h4>
              <Sparkles className="w-6 h-6 text-accent animate-pulse" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 rounded-xl bg-white/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-text-muted">
                  Your order is secured until delivery
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <Truck className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-text-muted">
                  Real-time delivery tracking
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/50">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <p className="text-sm text-text-muted">
                  Easy cash payment option
                </p>
              </div>
            </div>
            
            <p className="text-sm text-text-muted max-w-2xl mx-auto">
              Your order will be processed immediately. Our delivery executive will contact you 
              before arrival. Please ensure someone is available at the delivery address to 
              receive the order and make the payment of ₹{totalPrice}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CODPayment;