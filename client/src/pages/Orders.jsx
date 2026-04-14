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
  ChevronRight,
  Calendar,
  User,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  AlertCircle,
  Printer,
  RefreshCw
} from 'lucide-react';
import Axios from "../utils/Axios";
import summaryApi from "../common/summartApi";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import ConfirmBox from "../components/ConfirmBox";

const Orders = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    revenue: 0
  });

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
        ...summaryApi().getAllOrders,
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
        const ordersData = res.data.orders || res.data.data || [];
        setOrders(ordersData);
        
        const total = ordersData.length;
        const pending = ordersData.filter(o => o.orderStatus === 'pending' || o.status === 'pending').length;
        const processing = ordersData.filter(o => o.orderStatus === 'processing' || o.status === 'processing').length;
        const shipped = ordersData.filter(o => o.orderStatus === 'shipped' || o.status === 'shipped').length;
        const delivered = ordersData.filter(o => o.orderStatus === 'delivered' || o.status === 'delivered').length;
        const cancelled = ordersData.filter(o => o.orderStatus === 'cancelled' || o.status === 'cancelled').length;
        const revenue = ordersData
          .filter(o => o.orderStatus === 'delivered' || o.status === 'delivered')
          .reduce((sum, o) => sum + (o.priceBreakdown?.total || o.totalAmount || 0), 0);
        
        setStats({ total, pending, processing, shipped, delivered, cancelled, revenue });
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

  const handleSearch = () => {
    fetchOrders();
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingStatus(orderId);
    try {
      const res = await Axios({
        ...summaryApi().updateOrderStatus(orderId),
        data: { status: newStatus },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success(`Order status updated to ${newStatus}`);
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, status: newStatus });
        }
      } else {
        toast.error(res.data.message || "Failed to update order status");
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(error.response?.data?.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCancelOrder = async () => {
    if (!orderToCancel) return;

    try {
      const res = await Axios({
        ...summaryApi().cancelOrder(orderToCancel),
        data: { reason: "Order cancelled by admin" },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrders();
        setShowCancelConfirm(false);
        setOrderToCancel(null);
        if (selectedOrder?._id === orderToCancel) {
          setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled', status: 'cancelled' });
        }
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const openCancelConfirm = (orderId) => {
    setOrderToCancel(orderId);
    setShowCancelConfirm(true);
  };

  const getStatusColor = (status) => {
    const statusMap = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      processing: 'bg-blue-100 text-blue-800 border-blue-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      pending: Clock,
      processing: Package,
      shipped: Truck,
      delivered: CheckCircle,
      cancelled: XCircle
    };
    return iconMap[status?.toLowerCase()] || Package;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const calculateTotal = (order) => {
    if (order.priceBreakdown?.total) return order.priceBreakdown.total;
    if (order.totalAmount) return order.totalAmount;
    if (order.total) return order.total;
    if (order.items) {
      return order.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
    }
    return 0;
  };

  const getUserName = (order) => {
    if (order.user?.name) return order.user.name;
    if (order.customer?.name) return order.customer.name;
    if (order.shippingAddress?.name) return order.shippingAddress.name;
    return 'Guest';
  };

  const getUserEmail = (order) => {
    if (order.user?.email) return order.user.email;
    if (order.customer?.email) return order.customer.email;
    return 'No email';
  };

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('all');
    setDateFilter('all');
    setShowMobileFilters(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (search) count++;
    if (statusFilter !== "all") count++;
    if (dateFilter !== "all") count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-bg p-3 md:p-6 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-xl md:text-3xl font-display font-bold text-text">
              Order Management
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-4">
            View and manage all customer orders
          </p>
        </div>

        {/* Stats Cards - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Total</p>
                <p className="text-base md:text-2xl font-bold gradient-text">{stats.total}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 md:w-6 md:h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Pending</p>
                <p className="text-base md:text-2xl font-bold text-warning">{stats.pending}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 md:w-6 md:h-6 text-warning" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Shipped</p>
                <p className="text-base md:text-2xl font-bold text-purple-600">{stats.shipped}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-xs md:text-sm">Revenue</p>
                <p className="text-xs md:text-2xl font-bold text-success">₹{(stats.revenue / 1000).toFixed(1)}k</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 md:w-6 md:h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters - Mobile Friendly */}
        <div className="bg-card rounded-xl border border-border p-3 md:p-5 mb-4 md:mb-6">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={14} />
              <input
                type="text"
                placeholder="Search orders..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input pl-9 pr-3 py-1.5 md:py-2 w-full text-sm"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`btn-outline px-2 py-1 rounded-lg flex items-center gap-1 text-xs ${
                    getActiveFiltersCount() > 0 ? "bg-primary/10 text-primary border-primary" : ""
                  }`}
                >
                  <Filter size={12} />
                  <span>Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="text-[10px] bg-primary text-white px-1 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={handleSearch}
                  className="btn-primary px-2 py-1 rounded-lg flex items-center gap-1 text-xs"
                >
                  <RefreshCw size={12} />
                  Apply
                </button>
              </div>
              
              <button className="btn-outline px-2 py-1 rounded-lg flex items-center gap-1 text-xs">
                <Download size={12} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
            
            {/* Mobile Filter Panel */}
            {showMobileFilters && (
              <div className="mt-2 p-2 bg-bg-alt rounded-lg border border-border">
                <div className="space-y-2">
                  <div>
                    <label className="text-[10px] font-medium text-text mb-1 block">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="input py-1 text-xs w-full"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-medium text-text mb-1 block">Date Range</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="input py-1 text-xs w-full"
                    >
                      {dateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button onClick={clearFilters} className="w-full btn btn-outline py-1 text-xs">
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
            
            {/* Active Filters */}
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap items-center gap-1 mt-1 pt-1 border-t border-border">
                <span className="text-[10px] text-text-muted">Active:</span>
                {search && (
                  <span className="badge bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] rounded-full flex items-center gap-1">
                    "{search.slice(0,8)}"
                    <button onClick={() => setSearch("")} className="hover:text-error">
                      <XCircle size={8} />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="badge bg-primary/10 text-primary px-1.5 py-0.5 text-[10px] rounded-full">
                    {statusFilter}
                    <button onClick={() => setStatusFilter("all")} className="ml-1 hover:text-error">
                      <XCircle size={8} />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-[10px] text-primary hover:underline">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Orders Table - Horizontal Scroll on Mobile */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-4 md:p-8">
              <div className="space-y-2 md:space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 md:h-16 bg-bg-alt rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
              <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-3 md:mb-4">
                <ShoppingBag className="w-6 h-6 md:w-12 md:h-12 text-primary/40" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-text mb-1">
                No orders found
              </h3>
              <p className="text-text-muted text-xs md:text-sm mb-3 md:mb-4 max-w-md">
                {search || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No orders have been placed yet'}
              </p>
              {(search || statusFilter !== 'all' || dateFilter !== 'all') && (
                <button onClick={clearFilters} className="btn btn-primary text-xs">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] md:min-w-full">
                <thead className="bg-bg-alt">
                  <tr>
                    <th className="text-left p-2 md:p-4 font-semibold text-text-muted text-[10px] md:text-sm">Order ID</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-text-muted text-[10px] md:text-sm">Customer</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-text-muted text-[10px] md:text-sm">Date</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-text-muted text-[10px] md:text-sm">Items</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-text-muted text-[10px] md:text-sm">Total</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-text-muted text-[10px] md:text-sm">Status</th>
                    <th className="text-left p-2 md:p-4 font-semibold text-text-muted text-[10px] md:text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const orderStatus = order.orderStatus || order.status || 'pending';
                    const StatusIcon = getStatusIcon(orderStatus);
                    const orderTotal = calculateTotal(order);
                    const itemCount = order.items?.length || 0;
                    const orderId = order.orderNumber || order._id;
                    
                    return (
                      <tr key={order._id} className="border-b border-border hover:bg-bg-alt/50 transition-colors">
                        <td className="p-2 md:p-4">
                          <div className="font-mono text-[10px] md:text-sm font-semibold text-primary">
                            #{orderId?.slice(-6)}
                          </div>
                        </td>
                        <td className="p-2 md:p-4">
                          <div className="flex items-center gap-1 md:gap-3">
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-primary/10 flex items-center justify-center">
                              <User size={12} className="md:w-4 md:h-4 text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-[10px] md:text-sm">{getUserName(order)}</div>
                              <div className="text-[8px] md:text-xs text-text-muted hidden md:block">{getUserEmail(order)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-2 md:p-4">
                          <div className="text-[10px] md:text-sm">{formatDate(order.createdAt).slice(0, 10)}</div>
                        </td>
                        <td className="p-2 md:p-4">
                          <div className="text-[10px] md:text-sm">{itemCount}</div>
                        </td>
                        <td className="p-2 md:p-4">
                          <div className="font-bold gradient-text text-[10px] md:text-sm">
                            ₹{orderTotal.toLocaleString()}
                          </div>
                        </td>
                        <td className="p-2 md:p-4">
                          <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 md:px-2.5 md:py-1 rounded-full text-[8px] md:text-xs font-medium border ${getStatusColor(orderStatus)}`}>
                            <StatusIcon size={10} className="md:w-3 md:h-3" />
                            <span className="capitalize hidden sm:inline">{orderStatus}</span>
                            <span className="capitalize sm:hidden">{orderStatus.charAt(0)}</span>
                          </div>
                        </td>
                        <td className="p-2 md:p-4">
                          <div className="flex items-center gap-0.5 md:gap-1">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="p-1 md:p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-text-muted hover:text-primary"
                              title="View Details"
                            >
                              <Eye size={12} className="md:w-4 md:h-4" />
                            </button>
                            {orderStatus === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'processing')}
                                disabled={updatingStatus === order._id}
                                className="p-1 md:p-1.5 rounded-lg hover:bg-blue-100 transition-colors text-blue-600 disabled:opacity-50"
                                title="Start Processing"
                              >
                                <Package size={12} className="md:w-4 md:h-4" />
                              </button>
                            )}
                            {orderStatus === 'processing' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'shipped')}
                                disabled={updatingStatus === order._id}
                                className="p-1 md:p-1.5 rounded-lg hover:bg-purple-100 transition-colors text-purple-600 disabled:opacity-50"
                                title="Mark as Shipped"
                              >
                                <Truck size={12} className="md:w-4 md:h-4" />
                              </button>
                            )}
                            {orderStatus === 'shipped' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                disabled={updatingStatus === order._id}
                                className="p-1 md:p-1.5 rounded-lg hover:bg-green-100 transition-colors text-green-600 disabled:opacity-50"
                                title="Mark as Delivered"
                              >
                                <CheckCircle size={12} className="md:w-4 md:h-4" />
                              </button>
                            )}
                            {orderStatus !== 'cancelled' && orderStatus !== 'delivered' && (
                              <button
                                onClick={() => openCancelConfirm(order._id)}
                                className="p-1 md:p-1.5 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                                title="Cancel Order"
                              >
                                <XCircle size={12} className="md:w-4 md:h-4" />
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
        </div>

        {/* Order Details Modal - Responsive */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
              <div className="sticky top-0 bg-card border-b border-border p-3 md:p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-xl font-display font-bold text-text">Order Details</h3>
                  <p className="text-xs md:text-sm text-text-muted">
                    #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)} • {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-1.5 md:p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
                >
                  <XCircle size={16} className="md:w-5 md:h-5" />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-3 md:p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-5 mb-3 md:mb-5">
                  {/* Customer Information */}
                  <div className="bg-bg-alt rounded-xl p-3 md:p-4 border border-border">
                    <h4 className="font-semibold text-text text-sm md:text-base mb-2 md:mb-3 flex items-center gap-2">
                      <User size={14} className="md:w-4 md:h-4 text-primary" />
                      Customer
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 md:gap-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-white font-bold text-xs md:text-sm">
                            {getUserName(selectedOrder).charAt(0) || 'G'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-text text-sm md:text-base">{getUserName(selectedOrder)}</div>
                          <div className="text-xs text-text-muted">{getUserEmail(selectedOrder)}</div>
                        </div>
                      </div>
                      <div className="mt-2 md:mt-4 pt-2 md:pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-1 md:gap-2 text-xs md:text-sm">
                          <div>
                            <p className="text-text-muted">Order #</p>
                            <p className="text-text font-medium">{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</p>
                          </div>
                          <div>
                            <p className="text-text-muted">Payment</p>
                            <p className="text-text font-medium">{selectedOrder.payment?.method || 'COD'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="bg-bg-alt rounded-xl p-3 md:p-4 border border-border">
                    <h4 className="font-semibold text-text text-sm md:text-base mb-2 md:mb-3 flex items-center gap-2">
                      <ShoppingBag size={14} className="md:w-4 md:h-4 text-primary" />
                      Summary
                    </h4>
                    <div className="space-y-1 md:space-y-2">
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-text-muted">Subtotal</span>
                        <span className="text-text">₹{calculateTotal(selectedOrder).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm">
                        <span className="text-text-muted">Shipping</span>
                        <span className="text-success">FREE</span>
                      </div>
                      <div className="pt-2 md:pt-3 border-t border-border mt-1 md:mt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-text text-sm md:text-base">Total</span>
                          <span className="gradient-text text-base md:text-lg">
                            ₹{calculateTotal(selectedOrder).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="bg-bg-alt rounded-xl p-3 md:p-4 border border-border">
                  <h4 className="font-semibold text-text text-sm md:text-base mb-2 md:mb-3 flex items-center gap-2">
                    <Package size={14} className="md:w-4 md:h-4 text-primary" />
                    Items
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-2 font-medium text-text-muted text-[10px] md:text-sm">Product</th>
                          <th className="text-left p-2 font-medium text-text-muted text-[10px] md:text-sm">Qty</th>
                          <th className="text-left p-2 font-medium text-text-muted text-[10px] md:text-sm">Price</th>
                          <th className="text-left p-2 font-medium text-text-muted text-[10px] md:text-sm">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items || []).slice(0, 3).map((item, index) => (
                          <tr key={index} className="border-b border-border">
                            <td className="p-2">
                              <div className="flex items-center gap-2">
                                <img
                                  src={item.image || item.productId?.image?.[0] || '/placeholder.png'}
                                  alt={item.name}
                                  className="h-8 w-8 md:h-12 md:w-12 rounded-lg object-cover border border-border"
                                />
                                <div>
                                  <div className="font-medium text-text text-xs md:text-sm">{item.name || item.productId?.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-2 text-text text-xs md:text-sm">{item.quantity}</td>
                            <td className="p-2 text-text text-xs md:text-sm">₹{item.price?.toLocaleString()}</td>
                            <td className="p-2 font-semibold text-primary text-xs md:text-sm">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {selectedOrder.items?.length > 3 && (
                      <p className="text-center text-text-muted text-xs mt-2">
                        + {selectedOrder.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-2 md:gap-3 mt-3 md:mt-5 pt-3 md:pt-4 border-t border-border">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="btn-outline px-3 md:px-5 py-1 md:py-2 rounded-lg text-xs md:text-sm"
                  >
                    Close
                  </button>
                  <button className="btn-primary px-3 md:px-5 py-1 md:py-2 rounded-lg flex items-center gap-1 md:gap-2 text-xs md:text-sm">
                    <Printer size={14} className="md:w-4 md:h-4" />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cancel Order Confirmation Modal */}
      {showCancelConfirm && (
        <ConfirmBox
          title="Cancel Order"
          message="Are you sure you want to cancel this order? This action cannot be undone."
          confirmText="Yes, Cancel"
          cancelText="No, Go Back"
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

export default Orders;