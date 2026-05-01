import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    name: {
      type: String,
      required: [true, "Recipient name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    address_line: {
      type: String,
      required: [true, "Address line is required"],
      trim: true,
      minlength: [5, "Address must be at least 5 characters"],
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    state: {
      type: String,
      required: [true, "State is required"],
      trim: true,
    },
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      validate: {
        validator: function(v) {
          return /^\d{6}$/.test(v);
        },
        message: "Pincode must be a valid 6-digit number",
      },
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      default: "India",
      trim: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      validate: {
        validator: function(v) {
          return /^[6-9]\d{9}$/.test(v);
        },
        message: "Mobile number must be a valid 10-digit Indian number",
      },
    },
    address_type: {
      type: String,
      enum: ["home", "office", "other"],
      default: "home",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);