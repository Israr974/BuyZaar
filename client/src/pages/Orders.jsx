import React, { useState, useEffect } from 'react';

import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Clock,
  Truck,
  Package,
  ArrowUpDown,
  MoreVertical,
  ChevronRight,
  Calendar,
  User,
  DollarSign,
  ShoppingBag
} from 'lucide-react';
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
const  Orders = () => {
 const user = useSelector((state) => state.user);
console.log("ADMIN TOKEN:", localStorage.getItem("token"));
console.log("ADMIN TOKEN:", user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Orders', icon: Package, color: 'gray' },
    { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'blue' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'purple' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' }
  ];

  const dateOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await Axios({
        ...summaryApi().getMyOrders,
        params: {
          status: statusFilter !== 'all' ? statusFilter : undefined,
          dateRange: dateFilter !== 'all' ? dateFilter : undefined,
          search: search || undefined
        },
        headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  
fetchOrders();
    
    
  }, [statusFilter, dateFilter]);

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await Axios({
        ...summaryApi().updateDeliveryStatus(orderId),
        data: { status: newStatus },
         headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });


      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update order status');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;

    try {
      const res = await Axios({
        ...summaryApi().cancelOrder(orderId),
        headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
  }
      });

      if (res.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: 'cancelled' });
        }
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error('Failed to cancel order');
    }
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusMap[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    return iconMap[status] || Package;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 to-primary/5 p-4 md:p-6">
     
      <div className="glass rounded-2xl p-6 mb-6 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Order Management
            </h1>
            <p className="text-text-muted mt-2">
              View and manage all customer orders in one place
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="btn-outline flex items-center gap-2 px-4 py-2.5 rounded-xl hover:shadow-sm transition-all">
              <Download size={18} />
              Export
            </button>
            <button className="btn-primary flex items-center gap-3 px-6 py-3 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
              <ShoppingBag size={20} />
              New Order
            </button>
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Orders</p>
                <p className="text-2xl font-bold text-text">156</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">12</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Processing</p>
                <p className="text-2xl font-bold text-blue-600">8</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Package className="text-blue-600" size={24} />
              </div>
            </div>
          </div>
          
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Revenue</p>
                <p className="text-2xl font-bold text-green-600">$12,450</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="text-green-600" size={24} />
              </div>
            </div>
          </div>
        </div>

       
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pt-6 border-t border-border">
          <div className="relative flex-1 md:w-96">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
            <input
              type="text"
              placeholder="Search orders by ID, customer name, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && fetchOrders()}
              className="input pl-12 pr-4 py-3 rounded-xl w-full"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <Filter size={16} className="text-text-muted" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input py-3 rounded-xl min-w-[160px]"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-text-muted" />
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="input py-3 rounded-xl min-w-[140px]"
              >
                {dateOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <button
              onClick={fetchOrders}
              className="btn-primary flex items-center gap-2 px-4 py-3 rounded-xl"
            >
              <ArrowUpDown size={16} />
              Apply
            </button>
          </div>
        </div>
      </div>

      
      <div className="glass rounded-2xl shadow-lg overflow-hidden">
        {loading ? (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag size={48} className="text-primary/40" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              No orders found
            </h3>
            <p className="text-text-muted mb-6 max-w-md">
              {search || statusFilter !== 'all' || dateFilter !== 'all'
                ? 'Try adjusting your search or filter criteria'
                : 'No orders have been placed yet'}
            </p>
            <button
              onClick={() => {
                setSearch('');
                setStatusFilter('all');
                setDateFilter('all');
              }}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left p-4 font-semibold text-text-muted">Order ID</th>
                  <th className="text-left p-4 font-semibold text-text-muted">Customer</th>
                  <th className="text-left p-4 font-semibold text-text-muted">Date</th>
                  <th className="text-left p-4 font-semibold text-text-muted">Items</th>
                  <th className="text-left p-4 font-semibold text-text-muted">Total</th>
                  <th className="text-left p-4 font-semibold text-text-muted">Status</th>
                  <th className="text-left p-4 font-semibold text-text-muted">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <tr key={order._id} className="border-b hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="font-mono text-sm font-semibold text-primary">
                          #{order.orderId || order._id.slice(-8)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <User size={16} className="text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{order.customer?.name || 'Guest'}</div>
                            <div className="text-sm text-text-muted">{order.customer?.email || 'No email'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="p-4">
                        <div className="text-sm">{order.items?.length || 0} items</div>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-text">
                          ${calculateTotal(order.items || []).toFixed(2)}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(order.status)}`}>
                          <StatusIcon size={14} />
                          <span className="text-sm font-medium capitalize">{order.status}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewOrder(order)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'shipped')}
                            className="p-2 rounded-lg hover:bg-blue-100 transition-colors text-blue-600 hover:text-blue-700"
                            title="Mark as Shipped"
                          >
                            <Truck size={18} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order._id, 'delivered')}
                            className="p-2 rounded-lg hover:bg-green-100 transition-colors text-green-600 hover:text-green-700"
                            title="Mark as Delivered"
                          >
                            <CheckCircle size={18} />
                          </button>
                          {order.status !== 'cancelled' && (
                            <button
                              onClick={() => handleCancelOrder(order._id)}
                              className="p-2 rounded-lg hover:bg-red-100 transition-colors text-red-600 hover:text-red-700"
                              title="Cancel Order"
                            >
                              <XCircle size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        
        {orders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t">
            <div className="text-text-muted text-sm">
              Showing <span className="font-semibold text-primary">1</span>-
              <span className="font-semibold text-primary">{orders.length}</span> of{" "}
              <span className="font-semibold">{orders.length}</span> orders
            </div>
            
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-400 cursor-not-allowed">
                <ChevronRight className="rotate-180" size={18} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                <button className="h-10 w-10 rounded-lg font-medium bg-primary text-white shadow-md">
                  1
                </button>
              </div>
              
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-white text-primary border border-border hover:bg-primary hover:text-white transition-all">
                Next
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      
      {showOrderDetails && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-float">
            <div className="p-6 border-b flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-text">Order Details</h3>
                <p className="text-text-muted">
                  #{selectedOrder.orderId || selectedOrder._id.slice(-8)} • {formatDate(selectedOrder.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setShowOrderDetails(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted hover:text-text"
              >
                ✕
              </button>
            </div>
            
            <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="card p-4">
                  <h4 className="font-semibold text-text mb-3">Customer Information</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{selectedOrder.customer?.name || 'Guest'}</div>
                        <div className="text-sm text-text-muted">{selectedOrder.customer?.email || 'No email'}</div>
                      </div>
                    </div>
                    {selectedOrder.shippingAddress && (
                      <div className="mt-4 pt-4 border-t">
                        <h5 className="font-medium text-sm text-text-muted mb-2">Shipping Address</h5>
                        <p className="text-sm">
                          {selectedOrder.shippingAddress.street}<br />
                          {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}<br />
                          {selectedOrder.shippingAddress.country} - {selectedOrder.shippingAddress.zipCode}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="card p-4">
                  <h4 className="font-semibold text-text mb-3">Order Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-muted">Subtotal</span>
                      <span>${calculateTotal(selectedOrder.items || []).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Shipping</span>
                      <span>$5.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-muted">Tax</span>
                      <span>${(calculateTotal(selectedOrder.items || []) * 0.08).toFixed(2)}</span>
                    </div>
                    <div className="pt-4 border-t mt-4">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span className="text-primary">
                          ${(calculateTotal(selectedOrder.items || []) + 5 + (calculateTotal(selectedOrder.items || []) * 0.08)).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card p-4">
                <h4 className="font-semibold text-text mb-3">Order Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-medium text-text-muted">Product</th>
                        <th className="text-left p-3 font-medium text-text-muted">Price</th>
                        <th className="text-left p-3 font-medium text-text-muted">Quantity</th>
                        <th className="text-left p-3 font-medium text-text-muted">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((item, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={item.image || '/placeholder.png'}
                                alt={item.name}
                                className="h-12 w-12 rounded-lg object-cover"
                              />
                              <div>
                                <div className="font-medium">{item.name}</div>
                                <div className="text-sm text-text-muted">{item.category || 'General'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">${item.price?.toFixed(2)}</td>
                          <td className="p-3">{item.quantity}</td>
                          <td className="p-3 font-semibold">
                            ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="btn-outline px-6 py-2.5 rounded-xl"
                >
                  Close
                </button>
                <button className="btn-primary px-6 py-2.5 rounded-xl">
                  Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;


