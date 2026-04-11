import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  Package, Calendar, MapPin, CreditCard, 
  Truck, CheckCircle, XCircle, Clock,
  ChevronDown, ChevronUp, ExternalLink, 
  Receipt, Eye, ShoppingBag, TrendingUp,
  Download, Navigation
} from "lucide-react";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";
import OrderTrackingMap from "../components/OrderTrackingMap";
import { generateInvoice } from "../utils/generateInvoice";

const MyOrders = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeTab, setActiveTab] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await Axios({
        ...summaryApi().getMyOrders,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setOrders(response.data);
      } else if (response.data && response.data.data) {
        setOrders(response.data.data);
      } else if (response.data && response.data.orders) {
        setOrders(response.data.orders);
      } else {
        setOrders([]);
      }
      
    } catch (err) {
      console.error("Failed to fetch orders", err);
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
    // Reset active tab when expanding
    if (expandedOrder !== orderId) {
      setActiveTab(prev => ({ ...prev, [orderId]: "items" }));
    }
  };

  const setOrderTab = (orderId, tab) => {
    setActiveTab(prev => ({ ...prev, [orderId]: tab }));
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "success":
      case "paid":
        return "bg-success/10 text-success border-success/20";
      case "shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "processing":
        return "bg-warning/10 text-warning border-warning/20";
      case "cancelled":
      case "failed":
        return "bg-error/10 text-error border-error/20";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "paid":
        return <CheckCircle size={14} />;
      case "shipped":
        return <Truck size={14} />;
      case "processing":
      case "pending":
        return <Clock size={14} />;
      case "cancelled":
      case "failed":
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
    } catch (error) {
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
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      return "N/A";
    }
  };

  const formatCreatedAt = (order) => {
    const dateString = order.createdAt || order.created || order.date || order.orderDate;
    return formatDateTime(dateString);
  };

  const calculateOrderTotal = (order) => {
    if (order.items && Array.isArray(order.items)) {
      return order.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    }
    return 0;
  };

  const handleDownloadInvoice = (order) => {
    generateInvoice(order, user);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg p-4 md:p-6 fade-in">
        <div className="container-narrow">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="spinner w-12 h-12 mb-4"></div>
              <p className="text-text-muted">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-bg p-4 md:p-6 fade-in">
        <div className="container-narrow">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full bg-error/10 flex items-center justify-center mb-4">
              <XCircle className="w-10 h-10 text-error" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text mb-3">Error Loading Orders</h2>
            <p className="text-text-muted mb-6">{error}</p>
            <button onClick={fetchOrders} className="btn btn-primary">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-bg p-4 md:p-6 fade-in">
        <div className="container-narrow">
          <div className="bg-card rounded-2xl shadow-lg border border-border p-8 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-bg-alt flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-text-muted" />
            </div>
            <h2 className="text-2xl font-display font-bold text-text mb-3">No Orders Yet</h2>
            <p className="text-text-muted mb-8 max-w-md mx-auto">
              You haven't placed any orders yet. Start shopping to see your order history here.
            </p>
            <button onClick={() => window.location.href = '/'} className="btn btn-primary px-8 py-3">
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalSpent = orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0);
  const deliveredCount = orders.filter(o => 
    o.orderStatus?.toLowerCase() === "delivered" || 
    o.status?.toLowerCase() === "delivered"
  ).length;

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6 lg:p-8 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text">My Orders</h1>
          </div>
          <p className="text-text-muted ml-4">
            Track and manage all your orders in one place
          </p>
          <div className="flex items-center gap-4 mt-4 ml-4">
            <span className="badge bg-primary/10 text-primary">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </span>
            <span className="text-sm text-text-muted flex items-center gap-1">
              <Calendar size={14} />
              Last updated: {formatDate(new Date())}
            </span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Orders</p>
                <p className="stat-number text-2xl">{orders.length}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Package className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Total Spent</p>
                <p className="stat-number text-2xl">₹{totalSpent.toLocaleString('en-IN')}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="stat-label">Delivered</p>
                <p className="stat-number text-2xl">{deliveredCount}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map((order, index) => {
            const orderTotal = calculateOrderTotal(order);
            const itemCount = order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
            const orderDate = formatCreatedAt(order);
            const orderId = order._id || index;
            const orderNumber = order.orderNumber || `ORD${order._id?.slice(-8) || `${1000 + index}`}`;
            const status = order.orderStatus || order.status || "Processing";
            const currentTab = activeTab[orderId] || "items";
            
            return (
              <div
                key={orderId}
                className="bg-card rounded-xl shadow-sm border border-border overflow-hidden hover:shadow-md transition-all duration-300"
              >
                {/* Order Header */}
                <div 
                  className="p-5 cursor-pointer hover:bg-bg-alt/50 transition-colors"
                  onClick={() => toggleOrder(orderId)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Package className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-text">
                            Order #{orderNumber}
                          </h3>
                          <p className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                            <Calendar size={12} />
                            {orderDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`badge border ${getStatusColor(status)} flex items-center gap-1`}>
                          {getStatusIcon(status)}
                          {status}
                        </span>
                        <span className="badge bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1">
                          <CreditCard size={12} />
                          {order.payment?.method === "COD" ? "Cash on Delivery" : (order.payment?.method || "Online")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xl font-bold gradient-text">
                          ₹{orderTotal.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-text-muted">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-text-muted">
                        {expandedOrder === orderId ? 
                          <ChevronUp size={20} /> : 
                          <ChevronDown size={20} />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Details Expanded */}
                {expandedOrder === orderId && (
                  <div className="border-t border-border">
                    {/* Tabs */}
                    <div className="flex border-b border-border bg-bg-alt/50">
                      <button
                        onClick={() => setOrderTab(orderId, "items")}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                          currentTab === "items"
                            ? "text-primary border-b-2 border-primary"
                            : "text-text-muted hover:text-text"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Package size={16} />
                          Order Items
                        </span>
                      </button>
                      <button
                        onClick={() => setOrderTab(orderId, "tracking")}
                        className={`px-6 py-3 text-sm font-medium transition-colors ${
                          currentTab === "tracking"
                            ? "text-primary border-b-2 border-primary"
                            : "text-text-muted hover:text-text"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Navigation size={16} />
                          Track Order
                        </span>
                      </button>
                    </div>

                    {/* Tab Content */}
                    <div className="p-5">
                      {currentTab === "items" ? (
                        // Order Items Content
                        <div className="space-y-6">
                          {/* Products */}
                          <div>
                            <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                              <ShoppingBag size={18} className="text-primary" />
                              Order Items
                            </h4>
                            <div className="space-y-3">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-card border border-border">
                                  {item.image ? (
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-16 h-16 object-cover rounded-lg border"
                                    />
                                  ) : (
                                    <div className="w-16 h-16 rounded-lg border bg-bg-alt flex items-center justify-center">
                                      <Package className="w-8 h-8 text-text-muted" />
                                    </div>
                                  )}
                                  <div className="flex-1">
                                    <p className="font-medium text-text">{item.name}</p>
                                    <p className="text-sm text-text-muted">Quantity: {item.quantity}</p>
                                    <p className="text-sm text-text-muted">₹{item.price?.toLocaleString('en-IN')} each</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-semibold gradient-text">
                                      ₹{(item.quantity * item.price)?.toLocaleString('en-IN')}
                                    </p>
                                    <p className="text-xs text-text-muted">Item total</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Payment Details */}
                          <div>
                            <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                              <CreditCard size={18} className="text-primary" />
                              Payment Details
                            </h4>
                            <div className="p-4 rounded-lg bg-card border border-border">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-text-muted">Payment Method</p>
                                  <p className="font-medium text-text">
                                    {order.payment?.method === "COD" ? "Cash on Delivery" : (order.payment?.method || "N/A")}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-text-muted">Payment Status</p>
                                  <p className={`font-medium ${order.payment?.status?.toLowerCase() === 'paid' ? 'text-success' : 'text-warning'}`}>
                                    {order.payment?.status || "Pending"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Summary */}
                          <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-lg p-4 border border-border">
                            <h4 className="font-semibold text-text mb-3">Order Summary</h4>
                            <div className="space-y-2">
                              {order.items?.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                  <span className="text-text-muted">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="text-text">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                                </div>
                              ))}
                              
                              <div className="border-t border-border pt-2 mt-2">
                                <div className="flex justify-between text-sm">
                                  <span className="text-text-muted">Subtotal</span>
                                  <span className="text-text">₹{orderTotal.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                  <span className="text-text-muted">Shipping</span>
                                  <span className="text-success">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t border-border">
                                  <span className="text-text">Total Amount</span>
                                  <span className="gradient-text font-bold">₹{orderTotal.toLocaleString('en-IN')}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Information */}
                          <div>
                            <h4 className="font-semibold text-text mb-3">Order Information</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg bg-card border border-border">
                              <div>
                                <p className="text-xs text-text-muted">Order ID</p>
                                <p className="text-sm font-mono text-text">{order._id || "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-xs text-text-muted">Order Number</p>
                                <p className="text-sm text-text">{orderNumber}</p>
                              </div>
                              <div>
                                <p className="text-xs text-text-muted">Placed on</p>
                                <p className="text-sm text-text">{orderDate}</p>
                              </div>
                              {order.updatedAt && (
                                <div>
                                  <p className="text-xs text-text-muted">Last updated</p>
                                  <p className="text-sm text-text">{formatDateTime(order.updatedAt)}</p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex flex-wrap gap-3 pt-4 border-t border-border">
                            <button
                              onClick={() => handleDownloadInvoice(order)}
                              className="btn btn-outline flex items-center gap-2"
                            >
                              <Download size={16} />
                              Download Invoice
                            </button>
                            <button
                              onClick={() => setOrderTab(orderId, "tracking")}
                              className="btn btn-primary flex items-center gap-2"
                            >
                              <Truck size={16} />
                              Track Order
                            </button>
                            {(status?.toLowerCase() === "delivered") && (
                              <button className="btn btn-secondary flex items-center gap-2">
                                <ShoppingBag size={16} />
                                Buy Again
                              </button>
                            )}
                          </div>
                        </div>
                      ) : (
                        // Order Tracking Content
                        <OrderTrackingMap order={order} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Help Section */}
        <div className="mt-8 p-6 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 border border-border">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-primary/10">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-text">Need Help With Your Order?</h4>
                <p className="text-sm text-text-muted">Contact our support team for assistance</p>
              </div>
            </div>
            <button className="btn btn-outline flex items-center gap-2">
              <ExternalLink size={16} />
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;