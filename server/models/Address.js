import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, 
    },
    address_line: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    country: { type: String, required: true, default: "India" },
    mobile: {
      type: String,
      required: true,
      match: /^[6-9]\d{9}$/, 
    },
    
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);

