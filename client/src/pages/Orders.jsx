// import React, { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Download, 
//   Eye, 
//   CheckCircle, 
//   XCircle, 
//   Clock,
//   Truck,
//   Package,
//   ArrowUpDown,
//   ChevronRight,
//   Calendar,
//   User,
//   DollarSign,
//   ShoppingBag,
//   TrendingUp,
//   AlertCircle,
//   Printer,
//   RefreshCw
// } from 'lucide-react';
// import Axios from "../utils/Axios";
// import summaryApi from "../common/summartApi";
// import toast from "react-hot-toast";
// import { useSelector } from "react-redux";

// const Orders = () => {
//   const user = useSelector((state) => state.user);
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [search, setSearch] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [dateFilter, setDateFilter] = useState('all');
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showOrderDetails, setShowOrderDetails] = useState(false);
//   const [updatingStatus, setUpdatingStatus] = useState(null);
//   const [stats, setStats] = useState({
//     total: 0,
//     pending: 0,
//     processing: 0,
//     shipped: 0,
//     delivered: 0,
//     cancelled: 0,
//     revenue: 0
//   });

//   const statusOptions = [
//     { value: 'all', label: 'All Orders', icon: Package, color: 'gray' },
//     { value: 'pending', label: 'Pending', icon: Clock, color: 'yellow' },
//     { value: 'processing', label: 'Processing', icon: Package, color: 'blue' },
//     { value: 'shipped', label: 'Shipped', icon: Truck, color: 'purple' },
//     { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'green' },
//     { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'red' }
//   ];

//   const dateOptions = [
//     { value: 'all', label: 'All Time' },
//     { value: 'today', label: 'Today' },
//     { value: 'week', label: 'This Week' },
//     { value: 'month', label: 'This Month' },
//     { value: 'year', label: 'This Year' }
//   ];

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const res = await Axios({
//         ...summaryApi().getAllOrders,
//         params: {
//           status: statusFilter !== 'all' ? statusFilter : undefined,
//           dateRange: dateFilter !== 'all' ? dateFilter : undefined,
//           search: search || undefined
//         },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`
//         }
//       });

//       if (res.data.success) {
//         const ordersData = res.data.orders || res.data.data || [];
//         setOrders(ordersData);
        
//         const total = ordersData.length;
//         const pending = ordersData.filter(o => o.orderStatus === 'pending' || o.status === 'pending').length;
//         const processing = ordersData.filter(o => o.orderStatus === 'processing' || o.status === 'processing').length;
//         const shipped = ordersData.filter(o => o.orderStatus === 'shipped' || o.status === 'shipped').length;
//         const delivered = ordersData.filter(o => o.orderStatus === 'delivered' || o.status === 'delivered').length;
//         const cancelled = ordersData.filter(o => o.orderStatus === 'cancelled' || o.status === 'cancelled').length;
//         const revenue = ordersData
//           .filter(o => o.orderStatus === 'delivered' || o.status === 'delivered')
//           .reduce((sum, o) => sum + (o.priceBreakdown?.total || o.totalAmount || 0), 0);
        
//         setStats({ total, pending, processing, shipped, delivered, cancelled, revenue });
//       }
//     } catch (error) {
//       console.error('Error fetching orders:', error);
//       toast.error('Failed to load orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [statusFilter, dateFilter]);

//   const handleSearch = () => {
//     fetchOrders();
//   };

//   const handleViewOrder = (order) => {
//     setSelectedOrder(order);
//     setShowOrderDetails(true);
//   };

//   const handleUpdateStatus = async (orderId, newStatus) => {
//     setUpdatingStatus(orderId);
//     try {
//       const res = await Axios({
//         ...summaryApi().updateOrderStatus(orderId),
//         data: { status: newStatus },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         toast.success(`Order status updated to ${newStatus}`);
//         fetchOrders();
//         if (selectedOrder?._id === orderId) {
//           setSelectedOrder({ ...selectedOrder, orderStatus: newStatus, status: newStatus });
//         }
//       } else {
//         toast.error(res.data.message || "Failed to update order status");
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error(error.response?.data?.message || 'Failed to update order status');
//     } finally {
//       setUpdatingStatus(null);
//     }
//   };

//   // const handleCancelOrder = async (orderId) => {
//   //   if (!window.confirm('Are you sure you want to cancel this order?')) return;

//   //   try {
//   //     const res = await Axios({
//   //       ...summaryApi().cancelOrder(orderId),
//   //       headers: {
//   //         Authorization: `Bearer ${localStorage.getItem("token")}`
//   //       }
//   //     });

//   //     if (res.data.success) {
//   //       toast.success('Order cancelled successfully');
//   //       fetchOrders();
//   //       if (selectedOrder?._id === orderId) {
//   //         setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled', status: 'cancelled' });
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error('Error cancelling order:', error);
//   //     toast.error(error.response?.data?.message || 'Failed to cancel order');
//   //   }
//   // };
// const handleCancelOrder = async (orderId) => {
//   if (!window.confirm('Are you sure you want to cancel this order?')) return;

//   try {
//     const res = await Axios({
//       ...summaryApi().cancelOrder(orderId),
//       data: { reason: "Order cancelled by admin" }, // Add this line
//       headers: {
//         Authorization: `Bearer ${localStorage.getItem("token")}`
//       }
//     });

//     if (res.data.success) {
//       toast.success('Order cancelled successfully');
//       fetchOrders();
//       if (selectedOrder?._id === orderId) {
//         setSelectedOrder({ ...selectedOrder, orderStatus: 'cancelled', status: 'cancelled' });
//       }
//     }
//   } catch (error) {
//     console.error('Error cancelling order:', error);
//     toast.error(error.response?.data?.message || 'Failed to cancel order');
//   }
// };
//   const getStatusColor = (status) => {
//     const statusMap = {
//       pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       processing: 'bg-blue-100 text-blue-800 border-blue-200',
//       shipped: 'bg-purple-100 text-purple-800 border-purple-200',
//       delivered: 'bg-green-100 text-green-800 border-green-200',
//       cancelled: 'bg-red-100 text-red-800 border-red-200'
//     };
//     return statusMap[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const getStatusIcon = (status) => {
//     const iconMap = {
//       pending: Clock,
//       processing: Package,
//       shipped: Truck,
//       delivered: CheckCircle,
//       cancelled: XCircle
//     };
//     return iconMap[status?.toLowerCase()] || Package;
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const calculateTotal = (order) => {
//     if (order.priceBreakdown?.total) return order.priceBreakdown.total;
//     if (order.totalAmount) return order.totalAmount;
//     if (order.total) return order.total;
//     if (order.items) {
//       return order.items.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0);
//     }
//     return 0;
//   };

//   const getUserName = (order) => {
//     if (order.user?.name) return order.user.name;
//     if (order.customer?.name) return order.customer.name;
//     if (order.shippingAddress?.name) return order.shippingAddress.name;
//     return 'Guest';
//   };

//   const getUserEmail = (order) => {
//     if (order.user?.email) return order.user.email;
//     if (order.customer?.email) return order.customer.email;
//     return 'No email';
//   };

//   const clearFilters = () => {
//     setSearch('');
//     setStatusFilter('all');
//     setDateFilter('all');
//   };

//   return (
//     <div className="min-h-screen bg-bg p-4 md:p-6 fade-in">
//       <div className="container-narrow">
//         {/* Header Section */}
//         <div className="mb-6">
//           <div className="flex items-center gap-3 mb-2">
//             <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
//             <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
//               Order Management
//             </h1>
//           </div>
//           <p className="text-text-muted ml-4">
//             View and manage all customer orders in one place
//           </p>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
//           <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-sm">Total Orders</p>
//                 <p className="text-2xl font-bold gradient-text">{stats.total}</p>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
//                 <ShoppingBag className="w-6 h-6 text-primary" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-sm">Pending</p>
//                 <p className="text-2xl font-bold text-warning">{stats.pending}</p>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
//                 <Clock className="w-6 h-6 text-warning" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-sm">Shipped</p>
//                 <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
//                 <Truck className="w-6 h-6 text-purple-600" />
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-text-muted text-sm">Revenue</p>
//                 <p className="text-2xl font-bold text-success">₹{stats.revenue.toLocaleString()}</p>
//               </div>
//               <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
//                 <TrendingUp className="w-6 h-6 text-success" />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-card rounded-xl border border-border p-5 mb-6">
//           <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
//             <div className="relative flex-1 w-full lg:max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
//               <input
//                 type="text"
//                 placeholder="Search orders by ID, customer name, or email..."
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
//                 className="input pl-10 pr-4 py-2.5 w-full"
//               />
//             </div>
            
//             <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
//               <div className="flex items-center gap-2">
//                 <Filter size={16} className="text-text-muted" />
//                 <select
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                   className="input py-2.5 rounded-lg text-sm"
//                 >
//                   {statusOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <div className="flex items-center gap-2">
//                 <Calendar size={16} className="text-text-muted" />
//                 <select
//                   value={dateFilter}
//                   onChange={(e) => setDateFilter(e.target.value)}
//                   className="input py-2.5 rounded-lg text-sm"
//                 >
//                   {dateOptions.map(option => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               <button
//                 onClick={handleSearch}
//                 className="btn-primary px-4 py-2.5 rounded-lg flex items-center gap-2"
//               >
//                 <RefreshCw size={16} />
//                 Apply
//               </button>
//             </div>
//           </div>
          
//           {/* Active Filters */}
//           {(search || statusFilter !== 'all' || dateFilter !== 'all') && (
//             <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
//               <span className="text-sm text-text-muted">Active filters:</span>
//               {search && (
//                 <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
//                   Search: "{search}"
//                   <button onClick={() => setSearch("")} className="hover:text-error">
//                     <XCircle size={12} />
//                   </button>
//                 </span>
//               )}
//               {statusFilter !== "all" && (
//                 <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
//                   Status: {statusFilter}
//                   <button onClick={() => setStatusFilter("all")} className="hover:text-error">
//                     <XCircle size={12} />
//                   </button>
//                 </span>
//               )}
//               {dateFilter !== "all" && (
//                 <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
//                   Date: {dateOptions.find(d => d.value === dateFilter)?.label}
//                   <button onClick={() => setDateFilter("all")} className="hover:text-error">
//                     <XCircle size={12} />
//                   </button>
//                 </span>
//               )}
//               <button
//                 onClick={clearFilters}
//                 className="text-sm text-primary hover:underline ml-2"
//               >
//                 Clear all
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Orders Table */}
//         <div className="bg-card rounded-xl border border-border overflow-hidden">
//           {loading ? (
//             <div className="p-8">
//               <div className="space-y-3">
//                 {[1, 2, 3, 4, 5].map((i) => (
//                   <div key={i} className="h-16 bg-bg-alt rounded-lg animate-pulse"></div>
//                 ))}
//               </div>
//             </div>
//           ) : orders.length === 0 ? (
//             <div className="flex flex-col items-center justify-center py-16 text-center">
//               <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
//                 <ShoppingBag className="w-12 h-12 text-primary/40" />
//               </div>
//               <h3 className="text-xl font-semibold text-text mb-2">
//                 No orders found
//               </h3>
//               <p className="text-text-muted mb-6 max-w-md">
//                 {search || statusFilter !== 'all' || dateFilter !== 'all'
//                   ? 'Try adjusting your search or filter criteria'
//                   : 'No orders have been placed yet'}
//               </p>
//               {(search || statusFilter !== 'all' || dateFilter !== 'all') && (
//                 <button onClick={clearFilters} className="btn btn-primary">
//                   Clear Filters
//                 </button>
//               )}
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead className="bg-bg-alt">
//                     <tr>
//                       <th className="text-left p-4 font-semibold text-text-muted text-sm">Order ID</th>
//                       <th className="text-left p-4 font-semibold text-text-muted text-sm">Customer</th>
//                       <th className="text-left p-4 font-semibold text-text-muted text-sm">Date</th>
//                       <th className="text-left p-4 font-semibold text-text-muted text-sm">Items</th>
//                       <th className="text-left p-4 font-semibold text-text-muted text-sm">Total</th>
//                       <th className="text-left p-4 font-semibold text-text-muted text-sm">Status</th>
//                       <th className="text-left p-4 font-semibold text-text-muted text-sm">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {orders.map((order) => {
//                       const orderStatus = order.orderStatus || order.status || 'pending';
//                       const StatusIcon = getStatusIcon(orderStatus);
//                       const orderTotal = calculateTotal(order);
//                       const itemCount = order.items?.length || 0;
//                       const orderId = order.orderNumber || order._id;
                      
//                       return (
//                         <tr key={order._id} className="border-b border-border hover:bg-bg-alt/50 transition-colors">
//                           <td className="p-4">
//                             <div className="font-mono text-sm font-semibold text-primary">
//                               #{orderId?.slice(-8)}
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <div className="flex items-center gap-3">
//                               <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
//                                 <User size={14} className="text-primary" />
//                               </div>
//                               <div>
//                                 <div className="font-medium text-sm">{getUserName(order)}</div>
//                                 <div className="text-xs text-text-muted">{getUserEmail(order)}</div>
//                               </div>
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <div className="text-sm">{formatDate(order.createdAt)}</div>
//                           </td>
//                           <td className="p-4">
//                             <div className="text-sm">{itemCount} items</div>
//                           </td>
//                           <td className="p-4">
//                             <div className="font-bold gradient-text text-sm">
//                               ₹{orderTotal.toLocaleString()}
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(orderStatus)}`}>
//                               <StatusIcon size={12} />
//                               <span className="capitalize">{orderStatus}</span>
//                             </div>
//                           </td>
//                           <td className="p-4">
//                             <div className="flex items-center gap-1">
//                               <button
//                                 onClick={() => handleViewOrder(order)}
//                                 className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-text-muted hover:text-primary"
//                                 title="View Details"
//                               >
//                                 <Eye size={16} />
//                               </button>
//                               {orderStatus === 'pending' && (
//                                 <button
//                                   onClick={() => handleUpdateStatus(order._id, 'processing')}
//                                   disabled={updatingStatus === order._id}
//                                   className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors text-blue-600 disabled:opacity-50"
//                                   title="Start Processing"
//                                 >
//                                   <Package size={16} />
//                                 </button>
//                               )}
//                               {orderStatus === 'processing' && (
//                                 <button
//                                   onClick={() => handleUpdateStatus(order._id, 'shipped')}
//                                   disabled={updatingStatus === order._id}
//                                   className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors text-purple-600 disabled:opacity-50"
//                                   title="Mark as Shipped"
//                                 >
//                                   <Truck size={16} />
//                                 </button>
//                               )}
//                               {orderStatus === 'shipped' && (
//                                 <button
//                                   onClick={() => handleUpdateStatus(order._id, 'delivered')}
//                                   disabled={updatingStatus === order._id}
//                                   className="p-1.5 rounded-lg hover:bg-green-100 transition-colors text-green-600 disabled:opacity-50"
//                                   title="Mark as Delivered"
//                                 >
//                                   <CheckCircle size={16} />
//                                 </button>
//                               )}
//                               {orderStatus !== 'cancelled' && orderStatus !== 'delivered' && (
//                                 <button
//                                   onClick={() => handleCancelOrder(order._id)}
//                                   className="p-1.5 rounded-lg hover:bg-red-100 transition-colors text-red-600"
//                                   title="Cancel Order"
//                                 >
//                                   <XCircle size={16} />
//                                 </button>
//                               )}
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </>
//           )}
//         </div>

//         {/* Order Details Modal */}
//         {showOrderDetails && selectedOrder && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//             <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
//               <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
//                 <div>
//                   <h3 className="text-xl font-display font-bold text-text">Order Details</h3>
//                   <p className="text-sm text-text-muted">
//                     #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)} • {formatDate(selectedOrder.createdAt)}
//                   </p>
//                 </div>
//                 <button
//                   onClick={() => setShowOrderDetails(false)}
//                   className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
//                 >
//                   <XCircle size={20} />
//                 </button>
//               </div>
              
//               <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-5">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
//                   {/* Customer Information */}
//                   <div className="bg-bg-alt rounded-xl p-4 border border-border">
//                     <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
//                       <User size={16} className="text-primary" />
//                       Customer Information
//                     </h4>
//                     <div className="space-y-2">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
//                           <span className="text-white font-bold text-sm">
//                             {getUserName(selectedOrder).charAt(0) || 'G'}
//                           </span>
//                         </div>
//                         <div>
//                           <div className="font-medium text-text">{getUserName(selectedOrder)}</div>
//                           <div className="text-sm text-text-muted">{getUserEmail(selectedOrder)}</div>
//                         </div>
//                       </div>
//                       <div className="mt-4 pt-3 border-t border-border">
//                         <div className="grid grid-cols-2 gap-2 text-sm">
//                           <div>
//                             <p className="text-text-muted">Order Number</p>
//                             <p className="text-text font-medium">{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</p>
//                           </div>
//                           <div>
//                             <p className="text-text-muted">Payment Method</p>
//                             <p className="text-text font-medium">{selectedOrder.payment?.method || 'COD'}</p>
//                           </div>
//                           <div>
//                             <p className="text-text-muted">Payment Status</p>
//                             <p className={`font-medium ${selectedOrder.payment?.status === 'paid' ? 'text-success' : 'text-warning'}`}>
//                               {selectedOrder.payment?.status || 'Pending'}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* Order Summary */}
//                   <div className="bg-bg-alt rounded-xl p-4 border border-border">
//                     <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
//                       <ShoppingBag size={16} className="text-primary" />
//                       Order Summary
//                     </h4>
//                     <div className="space-y-2">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-text-muted">Subtotal</span>
//                         <span className="text-text">₹{selectedOrder.priceBreakdown?.subTotal?.toLocaleString() || calculateTotal(selectedOrder).toLocaleString()}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-text-muted">Shipping</span>
//                         <span className="text-success">{selectedOrder.priceBreakdown?.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.priceBreakdown?.shippingFee?.toLocaleString() || 0}`}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-text-muted">Tax</span>
//                         <span className="text-text">₹{selectedOrder.priceBreakdown?.tax?.toLocaleString() || 0}</span>
//                       </div>
//                       <div className="pt-3 border-t border-border mt-2">
//                         <div className="flex justify-between font-bold">
//                           <span className="text-text">Total</span>
//                           <span className="gradient-text text-lg">
//                             ₹{calculateTotal(selectedOrder).toLocaleString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
                
//                 {/* Order Items */}
//                 <div className="bg-bg-alt rounded-xl p-4 border border-border">
//                   <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
//                     <Package size={16} className="text-primary" />
//                     Order Items
//                   </h4>
//                   <div className="overflow-x-auto">
//                     <table className="w-full">
//                       <thead className="border-b border-border">
//                         <tr>
//                           <th className="text-left p-3 font-medium text-text-muted text-sm">Product</th>
//                           <th className="text-left p-3 font-medium text-text-muted text-sm">Price</th>
//                           <th className="text-left p-3 font-medium text-text-muted text-sm">Quantity</th>
//                           <th className="text-left p-3 font-medium text-text-muted text-sm">Total</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {(selectedOrder.items || []).map((item, index) => (
//                           <tr key={index} className="border-b border-border hover:bg-card transition-colors">
//                             <td className="p-3">
//                               <div className="flex items-center gap-3">
//                                 <img
//                                   src={item.image || item.productId?.image?.[0] || '/placeholder.png'}
//                                   alt={item.name || item.productId?.name}
//                                   className="h-12 w-12 rounded-lg object-cover border border-border"
//                                 />
//                                 <div>
//                                   <div className="font-medium text-text text-sm">{item.name || item.productId?.name}</div>
//                                 </div>
//                               </div>
//                             </td>
//                             <td className="p-3 text-text">₹{(item.price || item.productId?.price)?.toLocaleString()}</td>
//                             <td className="p-3 text-text">{item.quantity}</td>
//                             <td className="p-3 font-semibold text-primary">
//                               ₹{((item.price || item.productId?.price) * item.quantity).toLocaleString()}
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
                
//                 {/* Action Buttons */}
//                 <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-border">
//                   <button
//                     onClick={() => setShowOrderDetails(false)}
//                     className="btn-outline px-5 py-2 rounded-lg"
//                   >
//                     Close
//                   </button>
//                   <button className="btn-primary px-5 py-2 rounded-lg flex items-center gap-2">
//                     <Printer size={16} />
//                     Print Invoice
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Orders;

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
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-6 fade-in">
      <div className="container-narrow">
        {/* Header Section */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-primary to-accent"></div>
            <h1 className="text-2xl md:text-3xl font-display font-bold text-text">
              Order Management
            </h1>
          </div>
          <p className="text-text-muted ml-4">
            View and manage all customer orders in one place
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Total Orders</p>
                <p className="text-2xl font-bold gradient-text">{stats.total}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Pending</p>
                <p className="text-2xl font-bold text-warning">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-warning/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Shipped</p>
                <p className="text-2xl font-bold text-purple-600">{stats.shipped}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <Truck className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl border border-border p-5 hover:shadow-md transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-muted text-sm">Revenue</p>
                <p className="text-2xl font-bold text-success">₹{stats.revenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-success" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-xl border border-border p-5 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="relative flex-1 w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" size={18} />
              <input
                type="text"
                placeholder="Search orders by ID, customer name, or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="input pl-10 pr-4 py-2.5 w-full"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-text-muted" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="input py-2.5 rounded-lg text-sm"
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
                  className="input py-2.5 rounded-lg text-sm"
                >
                  {dateOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleSearch}
                className="btn-primary px-4 py-2.5 rounded-lg flex items-center gap-2"
              >
                <RefreshCw size={16} />
                Apply
              </button>
            </div>
          </div>
          
          {/* Active Filters */}
          {(search || statusFilter !== 'all' || dateFilter !== 'all') && (
            <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border">
              <span className="text-sm text-text-muted">Active filters:</span>
              {search && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Search: "{search}"
                  <button onClick={() => setSearch("")} className="hover:text-error">
                    <XCircle size={12} />
                  </button>
                </span>
              )}
              {statusFilter !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Status: {statusFilter}
                  <button onClick={() => setStatusFilter("all")} className="hover:text-error">
                    <XCircle size={12} />
                  </button>
                </span>
              )}
              {dateFilter !== "all" && (
                <span className="badge bg-primary/10 text-primary px-3 py-1 text-sm rounded-full flex items-center gap-1">
                  Date: {dateOptions.find(d => d.value === dateFilter)?.label}
                  <button onClick={() => setDateFilter("all")} className="hover:text-error">
                    <XCircle size={12} />
                  </button>
                </span>
              )}
              <button
                onClick={clearFilters}
                className="text-sm text-primary hover:underline ml-2"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Orders Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          {loading ? (
            <div className="p-8">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-16 bg-bg-alt rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-primary/40" />
              </div>
              <h3 className="text-xl font-semibold text-text mb-2">
                No orders found
              </h3>
              <p className="text-text-muted mb-6 max-w-md">
                {search || statusFilter !== 'all' || dateFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'No orders have been placed yet'}
              </p>
              {(search || statusFilter !== 'all' || dateFilter !== 'all') && (
                <button onClick={clearFilters} className="btn btn-primary">
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-bg-alt">
                    <tr>
                      <th className="text-left p-4 font-semibold text-text-muted text-sm">Order ID</th>
                      <th className="text-left p-4 font-semibold text-text-muted text-sm">Customer</th>
                      <th className="text-left p-4 font-semibold text-text-muted text-sm">Date</th>
                      <th className="text-left p-4 font-semibold text-text-muted text-sm">Items</th>
                      <th className="text-left p-4 font-semibold text-text-muted text-sm">Total</th>
                      <th className="text-left p-4 font-semibold text-text-muted text-sm">Status</th>
                      <th className="text-left p-4 font-semibold text-text-muted text-sm">Actions</th>
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
                          <td className="p-4">
                            <div className="font-mono text-sm font-semibold text-primary">
                              #{orderId?.slice(-8)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <User size={14} className="text-primary" />
                              </div>
                              <div>
                                <div className="font-medium text-sm">{getUserName(order)}</div>
                                <div className="text-xs text-text-muted">{getUserEmail(order)}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{formatDate(order.createdAt)}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm">{itemCount} items</div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold gradient-text text-sm">
                              ₹{orderTotal.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(orderStatus)}`}>
                              <StatusIcon size={12} />
                              <span className="capitalize">{orderStatus}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleViewOrder(order)}
                                className="p-1.5 rounded-lg hover:bg-primary/10 transition-colors text-text-muted hover:text-primary"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </button>
                              {orderStatus === 'pending' && (
                                <button
                                  onClick={() => handleUpdateStatus(order._id, 'processing')}
                                  disabled={updatingStatus === order._id}
                                  className="p-1.5 rounded-lg hover:bg-blue-100 transition-colors text-blue-600 disabled:opacity-50"
                                  title="Start Processing"
                                >
                                  <Package size={16} />
                                </button>
                              )}
                              {orderStatus === 'processing' && (
                                <button
                                  onClick={() => handleUpdateStatus(order._id, 'shipped')}
                                  disabled={updatingStatus === order._id}
                                  className="p-1.5 rounded-lg hover:bg-purple-100 transition-colors text-purple-600 disabled:opacity-50"
                                  title="Mark as Shipped"
                                >
                                  <Truck size={16} />
                                </button>
                              )}
                              {orderStatus === 'shipped' && (
                                <button
                                  onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                  disabled={updatingStatus === order._id}
                                  className="p-1.5 rounded-lg hover:bg-green-100 transition-colors text-green-600 disabled:opacity-50"
                                  title="Mark as Delivered"
                                >
                                  <CheckCircle size={16} />
                                </button>
                              )}
                              {orderStatus !== 'cancelled' && orderStatus !== 'delivered' && (
                                <button
                                  onClick={() => openCancelConfirm(order._id)}
                                  className="p-1.5 rounded-lg hover:bg-red-100 transition-colors text-red-600"
                                  title="Cancel Order"
                                >
                                  <XCircle size={16} />
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
            </>
          )}
        </div>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-fade-in">
              <div className="sticky top-0 bg-card border-b border-border p-5 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-text">Order Details</h3>
                  <p className="text-sm text-text-muted">
                    #{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)} • {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <button
                  onClick={() => setShowOrderDetails(false)}
                  className="p-2 rounded-lg hover:bg-bg-alt transition-colors text-text-muted hover:text-text"
                >
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Customer Information */}
                  <div className="bg-bg-alt rounded-xl p-4 border border-border">
                    <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      Customer Information
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            {getUserName(selectedOrder).charAt(0) || 'G'}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-text">{getUserName(selectedOrder)}</div>
                          <div className="text-sm text-text-muted">{getUserEmail(selectedOrder)}</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-text-muted">Order Number</p>
                            <p className="text-text font-medium">{selectedOrder.orderNumber || selectedOrder._id?.slice(-8)}</p>
                          </div>
                          <div>
                            <p className="text-text-muted">Payment Method</p>
                            <p className="text-text font-medium">{selectedOrder.payment?.method || 'COD'}</p>
                          </div>
                          <div>
                            <p className="text-text-muted">Payment Status</p>
                            <p className={`font-medium ${selectedOrder.payment?.status === 'paid' ? 'text-success' : 'text-warning'}`}>
                              {selectedOrder.payment?.status || 'Pending'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Summary */}
                  <div className="bg-bg-alt rounded-xl p-4 border border-border">
                    <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                      <ShoppingBag size={16} className="text-primary" />
                      Order Summary
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Subtotal</span>
                        <span className="text-text">₹{selectedOrder.priceBreakdown?.subTotal?.toLocaleString() || calculateTotal(selectedOrder).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Shipping</span>
                        <span className="text-success">{selectedOrder.priceBreakdown?.shippingFee === 0 ? 'FREE' : `₹${selectedOrder.priceBreakdown?.shippingFee?.toLocaleString() || 0}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-text-muted">Tax</span>
                        <span className="text-text">₹{selectedOrder.priceBreakdown?.tax?.toLocaleString() || 0}</span>
                      </div>
                      <div className="pt-3 border-t border-border mt-2">
                        <div className="flex justify-between font-bold">
                          <span className="text-text">Total</span>
                          <span className="gradient-text text-lg">
                            ₹{calculateTotal(selectedOrder).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Order Items */}
                <div className="bg-bg-alt rounded-xl p-4 border border-border">
                  <h4 className="font-semibold text-text mb-3 flex items-center gap-2">
                    <Package size={16} className="text-primary" />
                    Order Items
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b border-border">
                        <tr>
                          <th className="text-left p-3 font-medium text-text-muted text-sm">Product</th>
                          <th className="text-left p-3 font-medium text-text-muted text-sm">Price</th>
                          <th className="text-left p-3 font-medium text-text-muted text-sm">Quantity</th>
                          <th className="text-left p-3 font-medium text-text-muted text-sm">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedOrder.items || []).map((item, index) => (
                          <tr key={index} className="border-b border-border hover:bg-card transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.image || item.productId?.image?.[0] || '/placeholder.png'}
                                  alt={item.name || item.productId?.name}
                                  className="h-12 w-12 rounded-lg object-cover border border-border"
                                />
                                <div>
                                  <div className="font-medium text-text text-sm">{item.name || item.productId?.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-3 text-text">₹{(item.price || item.productId?.price)?.toLocaleString()}</td>
                            <td className="p-3 text-text">{item.quantity}</td>
                            <td className="p-3 font-semibold text-primary">
                              ₹{((item.price || item.productId?.price) * item.quantity).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-5 pt-4 border-t border-border">
                  <button
                    onClick={() => setShowOrderDetails(false)}
                    className="btn-outline px-5 py-2 rounded-lg"
                  >
                    Close
                  </button>
                  <button className="btn-primary px-5 py-2 rounded-lg flex items-center gap-2">
                    <Printer size={16} />
                    Print Invoice
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
          confirmText="Yes, Cancel Order"
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