import razorpay from '../config/razorpay.js';
import crypto from 'crypto';
import Order from '../models/Order.js';

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency, receipt } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({
        success: false,
        message: "Amount and currency are required",
      });
    }

    const options = {
      amount: amount * 100,
      currency,
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create Razorpay order",
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature",
      });
    }

    const order = await Order.findOne({ "payment.razorpayOrderId": razorpay_order_id });
    
    if (order) {
      order.payment.status = "paid";
      order.payment.razorpayPaymentId = razorpay_payment_id;
      order.paidAt = new Date();
      await order.save();
    }

    return res.status(200).json({ 
      success: true, 
      message: "Payment verified successfully" 
    });
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Payment verification failed" 
    });
  }
};