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
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";

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
      return order.items.reduce((sum, item) => {
        const price = item.discountedPrice || item.priceAtTime || item.price || 0;
        return sum + (price * (item.quantity || 1));
      }, 0);
    }
    return 0;
  };

  const getItemDisplayPrice = (item) => {
    const price = item.discountedPrice || item.priceAtTime || item.price || 0;
    const discount = item.discount || 0;
    if (discount > 0) {
      return calculateDiscountedPrice(price, discount);
    }
    return price;
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
    <div className="min-h-screen bg-gray-50 p-3 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-4 md:mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-6 md:h-8 rounded-full bg-gradient-to-b from-blue-600 to-orange-500"></div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-800">
              Order Management
            </h1>
          </div>
          <p className="text-gray-500 text-sm ml-4">
            View and manage all customer orders
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Total</p>
                <p className="text-base md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">{stats.total}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <ShoppingBag className="w-3.5 h-3.5 md:w-6 md:h-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Pending</p>
                <p className="text-base md:text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 md:w-6 md:h-6 text-yellow-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Shipped</p>
                <p className="text-base md:text-2xl font-bold text-purple-600">{stats.shipped}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Truck className="w-3.5 h-3.5 md:w-6 md:h-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-xs md:text-sm">Revenue</p>
                <p className="text-xs md:text-2xl font-bold text-green-600">{formatPrice(stats.revenue)}</p>
              </div>
              <div className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 md:w-6 md:h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-3 md:p-5 mb-4 md:mb-6">
          <div className="flex flex-col gap-3">
      
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
            </div>
            
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMobileFilters(!showMobileFilters)}
                  className={`border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm ${
                    getActiveFiltersCount() > 0 ? "bg-blue-50 text-blue-600 border-blue-300" : ""
                  }`}
                >
                  <Filter size={14} />
                  <span>Filter</span>
                  {getActiveFiltersCount() > 0 && (
                    <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded-full">
                      {getActiveFiltersCount()}
                    </span>
                  )}
                </button>
                
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm"
                >
                  <RefreshCw size={14} />
                  Apply
                </button>
              </div> 
              <button className="border border-gray-300 px-3 py-1.5 rounded-lg flex items-center gap-1 text-sm hover:border-blue-600 hover:text-blue-600 transition">
                <Download size={14} />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
            {showMobileFilters && (
              <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Status</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Date Range</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    >
                      {dateOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <button onClick={clearFilters} className="w-full border border-gray-300 py-1.5 rounded-lg text-sm hover:bg-gray-100 transition">
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
            
            {getActiveFiltersCount() > 0 && (
              <div className="flex flex-wrap items-center gap-2 mt-1 pt-2 border-t border-gray-200">
                <span className="text-xs text-gray-500">Active:</span>
                {search && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs rounded-full flex items-center gap-1">
                    "{search.slice(0, 10)}"
                    <button onClick={() => setSearch("")} className="hover:text-red-600">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                {statusFilter !== "all" && (
                  <span className="bg-blue-50 text-blue-700 px-2 py-0.5 text-xs rounded-full flex items-center gap-1">
                    {statusFilter}
                    <button onClick={() => setStatusFilter("all")} className="hover:text-red-600">
                      <XCircle size={10} />
                    </button>
                  </span>
                )}
                <button onClick={clearFilters} className="text-xs text-blue-600 hover:underline">
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-4 md:p-8">
              <div className="space-y-2 md:space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-12 md:h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 md:py-16 text-center">
              <div className="w-12 h-12 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center mb-3 md:mb-4">
                <ShoppingBag className="w-6 h-6 md:w-12 md:h-12 text-gray-400" />
              </div>
              <h3 className="text-sm md:text-xl font-semibold text-gray-800 mb-1">
                No orders found
              </h3>
              <p className="text-gray-500 text-xs md:text-sm mb-3 md:mb-4 max-w-md">
                {search || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No orders have been placed yet'}
              </p>
              {(search || statusFilter !== 'all' || dateFilter !== 'all') && (
                <button onClick={clearFilters} className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] md:min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 md:p-4 font-semibold text-gray-600 text-xs md:text-sm">Order ID</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-gray-600 text-xs md:text-sm">Customer</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-gray-600 text-xs md:text-sm">Date</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-gray-600 text-xs md:text-sm">Items</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-gray-600 text-xs md:text-sm">Total</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-gray-600 text-xs md:text-sm">Status</th>
                    <th className="text-left p-3 md:p-4 font-semibold text-gray-600 text-xs md:text-sm">Actions</th>
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
                      <tr key={order._id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="p-3 md:p-4">
                          <div className="font-mono text-xs md:text-sm font-semibold text-blue-600">
                            #{orderId?.slice(-8)}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="h-6 w-6 md:h-8 md:w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User size={12} className="md:w-4 md:h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-xs md:text-sm">{getUserName(order)}</div>
                              <div className="text-xs text-gray-500 hidden md:block">{getUserEmail(order)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="text-xs md:text-sm">{formatDate(order.createdAt).slice(0, 10)}</div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="text-xs md:text-sm">{itemCount}</div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent text-xs md:text-sm">
                            {formatPrice(orderTotal)}
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 md:px-2.5 md:py-1 rounded-full text-xs font-medium border ${getStatusColor(orderStatus)}`}>
                            <StatusIcon size={10} className="md:w-3 md:h-3" />
                            <span className="capitalize">{orderStatus}</span>
                          </div>
                        </td>
                        <td className="p-3 md:p-4">
                          <div className="flex items-center gap-1 md:gap-2">
                            <button
                              onClick={() => handleViewOrder(order)}
                              className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors text-gray-500 hover:text-blue-600"
                              title="View Details"
                            >
                              <Eye size={14} className="md:w-4 md:h-4" />
                            </button>
                            {orderStatus === 'pending' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'processing')}
                                disabled={updatingStatus === order._id}
                                className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors text-blue-600 disabled:opacity-50"
                                title="Start Processing"
                              >
                                <Package size={14} className="md:w-4 md:h-4" />
                              </button>
                            )}
                            {orderStatus === 'processing' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'shipped')}
                                disabled={updatingStatus === order._id}
                                className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors text-purple-600 disabled:opacity-50"
                                title="Mark as Shipped"
                              >
                                <Truck size={14} className="md:w-4 md:h-4" />
                              </button>
                            )}
                            {orderStatus === 'shipped' && (
                              <button
                                onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                disabled={updatingStatus === order._id}
                                className="p-1.5 rounded-lg hover:bg-green-100 transition-colors text-green-600 disabled:opacity-50"
                                title="Mark as Delivered"
                              >
                                <CheckCircle size={14} className="md:w-4 md:h-4" />
                              </button>
                            )}
                            {orderStatus !== 'cancelled' && orderStatus !== 'delivered' && (
                              <button
                                onClick={() => openCancelConfirm(order._id)}
                                className="p-1.5 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                                title="Cancel Order"
                              >
                                <XCircle size={14} className="md:w-4 md:h-4" />
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

        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 md:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 md:p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-base md:text-xl font-bold text-gray-800">Order Details</h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)} • {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-4 md:p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 mb-4 md:mb-5">
               
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-3 flex items-center gap-2">
                      <User size={16} className="text-blue-600" />
                      Customer
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-blue-600 to-orange-500 flex items-center justify-center">
                          <span className="text-white font-bold text-xs md:text-sm">
                            {getUserName(selectedOrder).charAt(0) || 'G'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-800 text-sm md:text-base">{getUserName(selectedOrder)}</div>
                          <div className="text-xs text-gray-500">{getUserEmail(selectedOrder)}</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="grid grid-cols-2 gap-2 text-xs md:text-sm">
                          <div>
                            <p className="text-gray-500">Order #</p>
                            <p className="text-gray-800 font-medium">{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Payment</p>
                            <p className="text-gray-800 font-medium">{selectedOrder.payment?.method || 'COD'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-3 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-blue-600" />
                      Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-gray-800">{formatPrice(calculateTotal(selectedOrder))}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-green-600">FREE</span>
                      </div>
                      <div className="pt-2 border-t border-gray-200 mt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-gray-800 text-sm md:text-base">Total</span>
                          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent text-base md:text-lg">
                            {formatPrice(calculateTotal(selectedOrder))}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-3 flex items-center gap-2">
                    <Package size={16} className="text-blue-600" />
                    Items
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px]">
                      <thead className="border-b border-gray-200">
                        <tr>
                          <th className="text-left p-2 font-medium text-gray-500 text-xs md:text-sm">Product</th>
                          <th className="text-left p-2 font-medium text-gray-500 text-xs md:text-sm">Qty</th>
                          <th className="text-left p-2 font-medium text-gray-500 text-xs md:text-sm">Price</th>
                          <th className="text-left p-2 font-medium text-gray-500 text-xs md:text-sm">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items || []).map((item, index) => {
                          const displayPrice = getItemDisplayPrice(item);
                          const originalPrice = item.price || 0;
                          const hasDiscount = item.discount > 0 || displayPrice < originalPrice;
                          
                          return (
                            <tr key={index} className="border-b border-gray-200">
                              <td className="p-2">
                                <div className="flex items-center gap-2">
                                  <img
                                    src={item.image || item.productId?.image?.[0] || '/placeholder.png'}
                                    alt={item.name}
                                    className="h-8 w-8 md:h-12 md:w-12 rounded-lg object-cover border border-gray-200"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-800 text-xs md:text-sm">{item.name || item.productId?.name}</div>
                                    {hasDiscount && (
                                      <span className="text-xs text-red-500">-{item.discount || Math.round(((originalPrice - displayPrice) / originalPrice) * 100)}% OFF</span>
                                    )}
                                  </div>
                                </div>
                              </td>
                              <td className="p-2 text-gray-800 text-xs md:text-sm">{item.quantity}</td>
                              <td className="p-2">
                                <div>
                                  <span className="text-gray-800 text-xs md:text-sm">{formatPrice(displayPrice)}</span>
                                  {hasDiscount && (
                                    <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(originalPrice)}</span>
                                  )}
                                </div>
                              </td>
                              <td className="p-2 font-semibold text-blue-600 text-xs md:text-sm">
                                {formatPrice(displayPrice * item.quantity)}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 transition"
                  >
                    Close
                  </button>
                  <button className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:shadow-lg transition">
                    <Printer size={14} />
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

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