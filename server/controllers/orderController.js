import Order from "../models/Order.js";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Address from "../models/Address.js";

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

const calculateShippingFee = (totalItems, pincode) => {
  const baseFee = 50;
  const perItemFee = 10;
  return baseFee + (totalItems * perItemFee);
};

const isCODAvailable = (pincode, orderAmount) => {
  const unavailablePincodes = ["123456", "654321", "111111"];
  
  if (unavailablePincodes.includes(pincode)) {
    return false;
  }
  
  const codMaxAmount = 5000;
  if (orderAmount > codMaxAmount) {
    return false;
  }
  
  return true;
};

export const placeOrder = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const { 
      items, 
      shippingAddressId, 
      paymentMethod,
      discount = 0,
      notes,
      couponCode 
    } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required"
      });
    }

    if (!shippingAddressId) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required"
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Payment method is required"
      });
    }

    const validPaymentMethods = ["CARD", "UPI", "COD"];
    if (!validPaymentMethods.includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method"
      });
    }

    const address = await Address.findById(shippingAddressId);
    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found"
      });
    }

    if (paymentMethod === "COD") {
      if (!isCODAvailable(address.pincode, req.body.priceBreakdown?.total || 0)) {
        return res.status(400).json({
          success: false,
          message: "COD not available for this location or amount exceeds limit"
        });
      }
    }

    const validatedItems = [];
    let totalItems = 0;
    let itemErrors = [];
    
    for (const item of items) {
      if (!item.product || !item.quantity) {
        return res.status(400).json({
          success: false,
          message: "Each item must have product ID and quantity"
        });
      }

      if (item.quantity < 1) {
        return res.status(400).json({
          success: false,
          message: "Quantity must be at least 1"
        });
      }

      const product = await Product.findById(item.product);
      
      if (!product) {
        itemErrors.push(`Product ${item.product} not found`);
        continue;
      }

      if (product.stock < item.quantity) {
        itemErrors.push(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`
        );
        continue;
      }

      validatedItems.push({
        product: product._id,
        name: product.name,
        image: product.image?.[0] || null,
        price: product.price,
        quantity: item.quantity
      });

      totalItems += item.quantity;
    }

    if (itemErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some items have issues",
        errors: itemErrors
      });
    }

    const orderNumber = generateOrderNumber();
    
    const subTotal = validatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingFee = calculateShippingFee(totalItems, address.pincode);
    const tax = subTotal * 0.18;
    const total = subTotal + shippingFee + tax - discount;
    
    const priceBreakdown = {
      subTotal: parseFloat(subTotal.toFixed(2)),
      shippingFee: parseFloat(shippingFee.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat(total.toFixed(2))
    };

    const order = new Order({
      user: userId,
      orderNumber,
      items: validatedItems,
      shippingAddress: shippingAddressId,
      payment: {
        method: paymentMethod,
        status: paymentMethod === "COD" ? "pending" : "pending"
      },
      priceBreakdown,
      notes: notes,
      couponCode,
      orderStatus: "pending"
    });

    const savedOrder = await order.save();

    if (!user.orderHistory || !Array.isArray(user.orderHistory)) {
      user.orderHistory = [];
    }
    
    user.orderHistory.push({
      orderId: savedOrder._id,
      orderNumber: savedOrder.orderNumber,
      date: savedOrder.createdAt,
      total: savedOrder.priceBreakdown.total,
      status: savedOrder.orderStatus,
      itemsCount: totalItems,
      paymentMethod: savedOrder.payment.method
    });
    
    if (user.orderHistory.length > 50) {
      user.orderHistory = user.orderHistory.slice(-50);
    }
    
    await user.save();

    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(
        item.product,
        { 
          $inc: { 
            stock: -item.quantity,
            sold: item.quantity 
          } 
        }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: savedOrder,
      orderAddedToHistory: true
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: Object.values(error.errors).map(e => e.message).join(", ")
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Failed to place order",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("items.product", "name image")
      .populate("shippingAddress");
    
    const user = await User.findById(userId).select("orderHistory");
    
    return res.status(200).json({
      success: true,
      totalOrders: orders.length,
      orders: orders.map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        total: order.priceBreakdown.total,
        status: order.orderStatus,
        paymentMethod: order.payment.method,
        paymentStatus: order.payment.status,
        items: order.items.map(item => ({
          name: item.name,
          image: item.image,
          quantity: item.quantity,
          price: item.price
        })),
        shippingAddress: order.shippingAddress,
        priceBreakdown: order.priceBreakdown
      })),
      orderHistory: user?.orderHistory || []
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const order = await Order.findOne({ 
      _id: orderId, 
      user: userId 
    })
    .populate("items.product", "name image category")
    .populate("shippingAddress");
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    return res.status(200).json({
      success: true,
      order: {
        _id: order._id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        total: order.priceBreakdown.total,
        status: order.orderStatus,
        payment: order.payment,
        items: order.items,
        shippingAddress: order.shippingAddress,
        priceBreakdown: order.priceBreakdown,
        notes: order.notes,
        timeline: {
          placed: order.createdAt,
          paid: order.paidAt,
          delivered: order.deliveredAt
        }
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch order"
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const orderId = req.params.id;
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }
    
    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    order.orderStatus = status;
    
    if (status === "delivered") {
      order.deliveredAt = new Date();
    } else if (status === "cancelled") {
      order.cancelledAt = new Date();
    }
    
    await order.save();
    
    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order: order
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update order status"
    });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user?.id || req.user?._id;
    const userRole = req.user?.role;
    const { reason } = req.body;
    
    let query = { _id: orderId };
    
    if (userRole !== "admin") {
      query.user = userId;
    }
    
    const order = await Order.findOne(query);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }
    
    const cancellableStatuses = ["pending", "processing"];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in ${order.orderStatus} status`
      });
    }
    
    order.orderStatus = "cancelled";
    order.cancelledAt = new Date();
    if (reason) {
      order.cancelReason = reason;
    }
    
    await order.save();
    
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: item.quantity } }
        );
      }
    }
    
    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: order
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to cancel order"
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      userId,
      startDate,
      endDate 
    } = req.query;
    
    const skip = (page - 1) * limit;
    
    let query = {};
    
    if (status && status !== "all") {
      query.orderStatus = status;
    }
    
    if (userId) {
      query.user = userId;
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate("user", "name email")
      .populate("shippingAddress");
    
    const total = await Order.countDocuments(query);
    
    const revenueResult = await Order.aggregate([
      { $match: query },
      { $group: { _id: null, totalRevenue: { $sum: "$priceBreakdown.total" } } }
    ]);
    
    const totalRevenue = revenueResult[0]?.totalRevenue || 0;
    
    return res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
        totalOrders: total
      },
      analytics: {
        totalRevenue,
        averageOrderValue: total > 0 ? totalRevenue / total : 0
      }
    });
    
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch orders"
    });
  }
};