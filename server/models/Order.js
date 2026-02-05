import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: String,
    image: String,
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    payment: {
      method: {
        type: String,
        enum: ["CARD", "UPI", "COD"],
        required: true,
      },

      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },

      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
    },

    orderStatus: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    priceBreakdown: {
      subTotal: {
        type: Number,
        required: true,
      },
      shippingFee: {
        type: Number,
        default: 0,
      },
      tax: {
        type: Number,
        default: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },

    invoiceUrl: String,

    paidAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,

    cancelReason: String,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
