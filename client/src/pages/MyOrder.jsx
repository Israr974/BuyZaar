import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Package, Calendar, CreditCard,
  Truck, CheckCircle, XCircle, Clock,
  ChevronDown, ChevronUp, ExternalLink,
  ShoppingBag, TrendingUp,
  Download, Eye
} from "lucide-react";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import OrderTrackingMap from "../components/OrderTrackingMap";
import { generateInvoice } from "../utils/generateInvoice";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import toast from "react-hot-toast";
import ConfirmBox from "../components/ConfirmBox";
const MyOrders = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      const response = await Axios({
        ...summaryApi().getMyOrders,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let ordersData = [];
      if (response.data && Array.isArray(response.data)) {
        ordersData = response.data;
      } else if (response.data?.data && Array.isArray(response.data.data)) {
        ordersData = response.data.data;
      } else if (response.data?.orders && Array.isArray(response.data.orders)) {
        ordersData = response.data.orders;
      }

      setOrders(ordersData);

    } catch (err) {
      setError("Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchOrders();
    }
  }, [user.id]);

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
    if (expandedOrder !== orderId) {
      setActiveTab(prev => ({ ...prev, [orderId]: "items" }));
    }
  };

  const setOrderTab = (orderId, tab) => {
    setActiveTab(prev => ({ ...prev, [orderId]: tab }));
  };

  const handleDownloadInvoice = (order) => {
    generateInvoice(order);
  };
 const handleCancelOrder = async () => {
  if (!orderToCancel) return;

  try {
    const token = localStorage.getItem("token");
    const res = await Axios({
      ...summaryApi().cancelOrder(orderToCancel),
      data: { reason: "Cancelled by user" }, 
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.data.success) {
      toast.success("Order cancelled successfully");
      fetchOrders();
      setShowCancelConfirm(false);
      setOrderToCancel(null);
    } else {
      toast.error(res.data.message || "Failed to cancel order");
    }
  } catch (error) {
    toast.error(error.response?.data?.message || "Failed to cancel order");
  }
};

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-50 text-green-700 border-green-200";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "cancelled":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "processing":
        return <Clock size={14} />;
      case "cancelled":
        return <XCircle size={14} />;
      default:
        return <Package size={14} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "N/A";
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "N/A";
    }
  };

  const formatCreatedAt = (order) => {
    const dateString = order.createdAt || order.created || order.date || order.orderDate;
    return formatDateTime(dateString);
  };

  const calculateOrderTotal = (order) => {
    if (order.items?.length) {
      return order.items.reduce((total, item) => {
        const price = item.discountedPrice || item.priceAtTime || item.price;
        return total + (price * item.quantity);
      }, 0);
    }
    return order.totalAmount || order.total || order.amount || 0;
  };

  const getItemDisplayPrice = (item) => {
    const price = item.discountedPrice || item.priceAtTime || item.price || 0;
    const discount = item.discount || 0;
    if (discount > 0) {
      return calculateDiscountedPrice(price, discount);
    }
    return price;
  };

  const getPaymentMethod = (order) => {
    if (order.paymentMethod) return order.paymentMethod;
    if (order.payment?.method) return order.payment.method;
    return "COD";
  };

  const getOrderStatus = (order) => {
    return order.status || order.orderStatus || "Processing";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="w-12 h-12 mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-red-100 flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Orders</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <button onClick={fetchOrders} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <button onClick={() => window.location.href = '/'} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-8 py-3 rounded-lg font-medium">
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalSpent = orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
  const deliveredCount = orders.filter(o => getOrderStatus(o).toLowerCase() === "delivered").length;

  return (
    <div className="min-h-screen bg-white p-3 md:p-5 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Orders</h1>
          </div>
          <p className="text-gray-500 text-sm md:text-base ml-4">
            Track and manage all your orders in one place
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-3 ml-4">
            <span className="bg-blue-100 text-blue-700 text-xs md:text-sm px-3 py-1 rounded-full">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Calendar size={12} />
              Last updated: {formatDate(new Date())}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6 md:mb-8">
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Total Orders</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{orders.length}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Total Spent</p>
                <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  {formatPrice(totalSpent)}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-4 hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Delivered</p>
                <p className="text-xl md:text-2xl font-bold text-gray-800">{deliveredCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4">
          {orders.map((order, index) => {
            const orderTotal = calculateOrderTotal(order);
            const itemCount = order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
            const orderDate = formatCreatedAt(order);
            const orderId = order._id || index;
            const orderNumber = order.orderNumber || `ORD${order._id?.slice(-6) || `${1000 + index}`}`;
            const status = getOrderStatus(order);
            const paymentMethod = getPaymentMethod(order);
            const currentTab = activeTab[orderId] || "items";

            return (
              <div
                key={orderId}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
              >
                <div
                  className="p-3 md:p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleOrder(orderId)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 md:gap-3 mb-1">
                        <div className="p-1.5 rounded-lg bg-blue-100">
                          <Package className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-sm md:text-base">
                            Order #{orderNumber}
                          </h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Calendar size={10} />
                            {orderDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`border text-xs md:text-sm px-2 py-0.5 rounded-full flex items-center gap-1 ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          {status}
                        </span>
                        <span className="bg-gray-100 text-gray-700 border border-gray-200 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CreditCard size={12} />
                          {paymentMethod}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-right">
                        <p className="text-base md:text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                          {formatPrice(orderTotal)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-gray-500">
                        {expandedOrder === orderId ?
                          <ChevronUp size={18} /> :
                          <ChevronDown size={18} />
                        }
                      </div>
                    </div>
                  </div>
                </div>
                {expandedOrder === orderId && (
                  <div className="border-t border-gray-200">
                    <div className="flex border-b border-gray-200 bg-gray-50">
                      <button
                        onClick={() => setOrderTab(orderId, "items")}
                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors ${currentTab === "items"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-800"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <Package size={14} />
                          Order Items
                        </span>
                      </button>
                      <button
                        onClick={() => setOrderTab(orderId, "tracking")}
                        className={`px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium transition-colors ${currentTab === "tracking"
                            ? "text-blue-600 border-b-2 border-blue-600"
                            : "text-gray-500 hover:text-gray-800"
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <Truck size={14} />
                          Track Order
                        </span>
                      </button>
                    </div>

                    <div className="p-3 md:p-5">
                      {currentTab === "items" ? (
                        <div className="space-y-6">

                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                              <ShoppingBag size={16} className="text-blue-600" />
                              Order Items
                            </h4>
                            <div className="space-y-3">
                              {order.items?.map((item, idx) => {
                                const displayPrice = getItemDisplayPrice(item);
                                const originalPrice = item.price || 0;
                                const hasDiscount = item.discount > 0 || displayPrice < originalPrice;

                                return (
                                  <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-gray-200">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg border"
                                      />
                                    ) : (
                                      <div className="w-12 h-12 rounded-lg border bg-gray-100 flex items-center justify-center">
                                        <Package className="w-6 h-6 text-gray-500" />
                                      </div>
                                    )}
                                    <div className="flex-1">
                                      <p className="font-medium text-gray-800 text-sm md:text-base">{item.name}</p>
                                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-xs text-gray-500">{formatPrice(displayPrice)} each</p>
                                        {hasDiscount && (
                                          <span className="text-xs text-red-500 line-through">{formatPrice(originalPrice)}</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent text-sm md:text-base">
                                        {formatPrice(displayPrice * item.quantity)}
                                      </p>
                                      {hasDiscount && (
                                        <p className="text-xs text-gray-400 line-through">
                                          {formatPrice(originalPrice * item.quantity)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          <div>
                            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2 text-sm">
                              <CreditCard size={16} className="text-blue-600" />
                              Payment Details
                            </h4>
                            <div className="p-3 md:p-4 rounded-lg bg-white border border-gray-200">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500">Payment Method</p>
                                  <p className="font-medium text-gray-800 text-sm md:text-base">
                                    {paymentMethod}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 border border-gray-200">
                            <h4 className="font-semibold text-gray-800 mb-3 text-sm">Order Summary</h4>
                            <div className="space-y-2">
                              {order.items?.map((item, idx) => {
                                const displayPrice = getItemDisplayPrice(item);
                                const originalPrice = item.price || 0;
                                const hasDiscount = item.discount > 0 || displayPrice < originalPrice;

                                return (
                                  <div key={idx} className="flex justify-between text-sm">
                                    <span className="text-gray-500">
                                      {item.name} × {item.quantity}
                                    </span>
                                    <div className="text-right">
                                      <span className="text-gray-800">{formatPrice(displayPrice * item.quantity)}</span>
                                      {hasDiscount && (
                                        <p className="text-xs text-gray-400 line-through">{formatPrice(originalPrice * item.quantity)}</p>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}

                              <div className="border-t border-gray-200 pt-3 mt-3">
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Subtotal</span>
                                  <span className="text-gray-800">{formatPrice(orderTotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-gray-500">Shipping</span>
                                  <span className="text-green-600">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t border-gray-200">
                                  <span className="text-gray-800">Total</span>
                                  <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{formatPrice(orderTotal)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                            <button
                              onClick={() => handleDownloadInvoice(order)}
                              className="border-2 border-gray-300 text-gray-700 flex items-center gap-2 text-sm px-4 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
                            >
                              <Download size={16} />
                              Invoice
                            </button>

                            {status?.toLowerCase() !== "cancelled" && status?.toLowerCase() !== "delivered" && (
                              <button
                                onClick={() => {
                                  setOrderToCancel(orderId);
                                  setShowCancelConfirm(true);
                                }}
                                className="border-2 border-gray-300 text-gray-700 flex items-center gap-2 text-sm px-4 py-2 rounded-lg hover:border-red-600 hover:text-red-600 transition"
                              >
                                <XCircle size={16} />
                                Cancel Order
                              </button>
                            )}
                            <button
                              onClick={() => setOrderTab(orderId, "tracking")}
                              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white flex items-center gap-2 text-sm px-4 py-2 rounded-lg hover:shadow-lg transition"
                            >
                              <Truck size={16} />
                              Track Order
                            </button>
                            {status?.toLowerCase() === "delivered" && (
                              <button
                                onClick={() => window.location.href = '/'}
                                className="border-2 border-gray-300 text-gray-700 flex items-center gap-2 text-sm px-4 py-2 rounded-lg hover:border-blue-600 hover:text-blue-600 transition"
                              >
                                <ShoppingBag size={16} />
                                Buy Again
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        <OrderTrackingMap order={order} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 p-5 rounded-xl bg-gradient-to-r from-blue-50 to-orange-50 border border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-center sm:text-left">
                <h4 className="font-semibold text-gray-800">Need Help?</h4>
                <p className="text-sm text-gray-500">Contact our support team for assistance</p>
              </div>
            </div>
            <button className="border-2 border-gray-300 text-gray-700 flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:border-blue-600 hover:text-blue-600 transition">
              <ExternalLink size={14} />
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {showCancelConfirm && (
        <ConfirmBox
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          confirmText="Cancel Order"
          cancelText="Go Back"
          confirmColor="red"
          close={() => {
            setShowCancelConfirm(false);
            setOrderToCancel(null);
          }}
          cancel={() => {
            setShowCancelConfirm(false);
            setOrderToCancel(null);
          }}
          confirm={handleCancelOrder}
        />
      )}
    </div>
  );
};

export default MyOrders;