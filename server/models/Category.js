import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    image: {
      type: String,
      default: "/placeholder-category.png",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);
