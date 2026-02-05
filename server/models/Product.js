import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },

    image: [
      {
        type: String, 
        required: true
      }
    ],

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },

    sub_category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCategory",
        required: true
      }
    ],

    unit: {
      type: String,
      required: true,
      trim: true
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },

    description: {
      type: String,
      required: true,
      maxlength: 500
    },

    more_details: {
      type: String,
      default: ""
    },

    publish: {
      type: Boolean,
      default: true
    },

    sku: {
      type: String,
      trim: true,
      unique: true,
      sparse: true 
    },

    brand: {
      type: String,
      trim: true
    },

    weight: {
      type: String
    },

    dimensions: {
      type: String
    }
  },
  {
    timestamps: true
  }
);




productSchema.index(
  { name: "text", description: "text" },
  { 
    name: "product_text_search",
    weights: { name: 10, description: 5 } 
  }
);

productSchema.index({ publish: 1, category: 1 });
productSchema.index({ publish: 1, price: 1 });
productSchema.index({ publish: 1, discount: -1 });
productSchema.index({ publish: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);