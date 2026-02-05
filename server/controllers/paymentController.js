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

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

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

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
