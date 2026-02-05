import mongoose from "mongoose";

const userCartProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    quantity: {
      type: Number,
      default: 1,
      min: 1,
    },

    priceAtAddTime: {
      type: Number,
      required: true, 
    },
  },
  {
    timestamps: true,
  }
);


userCartProductSchema.index(
  { userId: 1, productId: 1 },
  { unique: true }
);

export default mongoose.model("UserCartProduct", userCartProductSchema);
