


import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { 
  Package, Calendar, MapPin, CreditCard, 
  Truck, CheckCircle, XCircle, Clock,
  ChevronDown, ChevronUp, ExternalLink
} from "lucide-react";
import summaryApi from "../common/summartApi";
import Axios from "../utils/Axios";

const MyOrders = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
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

      console.log("Orders API Response:", response);
      
     
      
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
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "success":
      case "paid":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
      case "paid":
        return <CheckCircle size={16} />;
      case "shipped":
        return <Truck size={16} />;
      case "processing":
      case "pending":
        return <Clock size={16} />;
      case "cancelled":
      case "failed":
        return <XCircle size={16} />;
      default:
        return <Package size={16} />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      
      const date = new Date(dateString);
      
      
      if (isNaN(date.getTime())) {
        console.log("Invalid date string:", dateString);
        return "N/A";
      }
      
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch (error) {
      console.log("Date formatting error:", error, "for date:", dateString);
      return "N/A";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      
      if (isNaN(date.getTime())) {
        console.log("Invalid datetime string:", dateString);
        return "N/A";
      }
      
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.log("DateTime formatting error:", error, "for date:", dateString);
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

  
  const debugDates = (order) => {
    console.log("Order date fields:", {
      _id: order._id,
      createdAt: order.createdAt,
      typeOfCreatedAt: typeof order.createdAt,
      created: order.created,
      date: order.date,
      orderDate: order.orderDate,
      updatedAt: order.updatedAt
    });
  };

 
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600">Loading your orders...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }


  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Error Loading Orders</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchOrders}
              className="btn btn-primary px-6 py-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-6">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">No Orders Yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              You haven't placed any orders. Start shopping to see your order history here.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="btn btn-primary px-8 py-3"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
       
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Track and manage all your orders in one place
          </p>
          <div className="flex items-center gap-4 mt-4">
            <div className="badge badge-primary">
              {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
            </div>
            <div className="text-sm text-gray-500">
              <Calendar size={14} className="inline mr-1" />
              Last updated: {formatDate(new Date())}
            </div>
          </div>
        </div>

        
        <div className="space-y-4">
          {orders.map((order, index) => {
            const orderTotal = calculateOrderTotal(order);
            const itemCount = order.items?.reduce((total, item) => total + item.quantity, 0) || 0;
            const orderDate = formatCreatedAt(order);
            
            
            if (index === 0) {
              debugDates(order);
            }
            
            return (
              <div
                key={order._id || index}
                className="bg-white rounded-xl shadow-md border border-border hover:shadow-lg transition-shadow"
              >
                
                <div 
                  className="p-5 cursor-pointer"
                  onClick={() => toggleOrder(order._id || index)}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Package className="w-5 h-5 text-primary" />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{order.orderNumber || order._id?.slice(-8) || `ORD${1000 + index}`}
                          </h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {orderDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`badge ${getStatusColor(order.orderStatus || order.status)} flex items-center gap-1`}>
                          {getStatusIcon(order.orderStatus || order.status)}
                          {order.orderStatus || order.status || "Processing"}
                        </span>
                        <span className={`badge ${getStatusColor(order.payment?.status)} flex items-center gap-1`}>
                          <CreditCard size={12} />
                          {order.payment?.method === "COD" ? "Cash on Delivery" : (order.payment?.status || "Pending")}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          ₹{orderTotal.toLocaleString('en-IN')}
                        </p>
                        <p className="text-sm text-gray-500">
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className="text-gray-400">
                        {expandedOrder === (order._id || index) ? 
                          <ChevronUp size={20} /> : 
                          <ChevronDown size={20} />
                        }
                      </div>
                    </div>
                  </div>
                </div>

                
                {expandedOrder === (order._id || index) && (
                  <div className="border-t border-border p-5 space-y-6">
                
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Products</h4>
                      <div className="space-y-3">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border"
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-lg border bg-gray-100 flex items-center justify-center">
                                <Package className="w-8 h-8 text-gray-400" />
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                              <p className="text-sm text-gray-600">₹{item.price?.toLocaleString('en-IN')} each</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">₹{(item.quantity * item.price)?.toLocaleString('en-IN')}</p>
                              <p className="text-xs text-gray-500">Item total</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

              
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <CreditCard size={18} />
                        Payment Details
                      </h4>
                      <div className="p-4 rounded-lg bg-gray-50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium">{order.payment?.method === "COD" ? "Cash on Delivery" : (order.payment?.method || "N/A")}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Payment Status</p>
                            <p className="font-medium">{order.payment?.status || "N/A"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                   
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Order Summary</h4>
                      <div className="space-y-2">
                        {order.items?.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.name} × {item.quantity}
                            </span>
                            <span>₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                          </div>
                        ))}
                        
                        <div className="border-t pt-2 mt-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal</span>
                            <span>₹{orderTotal.toLocaleString('en-IN')}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shipping</span>
                            <span className="text-green-600">Free</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                            <span>Total Amount</span>
                            <span className="text-primary">₹{orderTotal.toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Order Information</h4>
                        <div className="space-y-1 text-sm">
                          <p className="text-gray-600">
                            <span className="font-medium">Order ID:</span> {order._id || "N/A"}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Order Number:</span> {order.orderNumber || "N/A"}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Placed on:</span> {orderDate}
                          </p>
                          {order.updatedAt && (
                            <p className="text-gray-600">
                              <span className="font-medium">Last updated:</span> {formatDateTime(order.updatedAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                   
                    <div className="flex gap-3 pt-4 border-t">
                      <button className="btn btn-outline flex-1">
                        View Invoice
                      </button>
                      <button className="btn btn-primary flex-1">
                        Track Order
                      </button>
                      {(order.orderStatus?.toLowerCase() === "delivered" || order.status?.toLowerCase() === "delivered") && (
                        <button className="btn btn-secondary flex-1">
                          Buy Again
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

     
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <Package className="w-10 h-10 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold">
                  ₹{orders.reduce((sum, order) => sum + calculateOrderTotal(order), 0).toLocaleString('en-IN')}
                </p>
              </div>
              <CreditCard className="w-10 h-10 text-green-500/20" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered Orders</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => 
                    o.orderStatus?.toLowerCase() === "delivered" || 
                    o.status?.toLowerCase() === "delivered"
                  ).length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-blue-500/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;