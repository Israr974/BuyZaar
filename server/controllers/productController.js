




import multer from "multer";
import mongoose from "mongoose";
import Product from "../models/Product.js";

const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const AddProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      sub_category,
      unit,
      stock,
      price,
      discount = 0,
      description,
      more_details = "",
      publish = true,
      image,
      sku,
      brand,
      weight,
      dimensions
    } = req.body;

    
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Product name is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Category is required",
      });
    }

    if (!Array.isArray(sub_category) || sub_category.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "At least one subcategory is required",
      });
    }

    if (!Array.isArray(image) || image.length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "At least one product image is required",
      });
    }

    if (!unit) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Unit is required",
      });
    }

    if (price <= 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Price must be greater than 0",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Stock cannot be negative",
      });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Discount must be between 0 and 100",
      });
    }

    const product = await Product.create({
      name: name.trim(),
      category,
      sub_category,
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      publish,
      image,
      sku,
      brand,
      weight,
      dimensions
    });

    return res.status(201).json({
      success: true,
      error: false,
      message: "Product created successfully",
      data: product,
    });

  } catch (error) {
    console.error("AddProduct Error:", error);

    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "SKU already exists",
      });
    }

    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to create product",
    });
  }
};


export const getProduct = async (req, res) => {
  try {
    let { page, limit, search } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const query = search ? { $text: { $search: search } } : {};
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("sub_category"),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product Details",
      success: true,
      error: false,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};


export const getProductByCategoryId = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Valid Category ID is required",
      });
    }

    const products = await Product.find({
      category: { $in: [id] },
    }).limit(15);

    return res.json({
      message: "Product list",
      success: true,
      error: false,
      data: products,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};


export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    let { categoryId, subCategoryId, page, limit } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "Provide Category And SubCategory",
        success: false,
        error: true,
      });
    }

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const query = {
      category: { $in: Array.isArray(categoryId) ? categoryId : [categoryId] },
      sub_category: { $in: Array.isArray(subCategoryId) ? subCategoryId : [subCategoryId] },
    };

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product List",
      success: true,
      error: false,
      data,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      page,
      limit,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Internal Server Error",
    });
  }
};


export const getProductById = async (req, res) => {
  try {
    const { productId } = req.body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Valid Product ID is required",
      });
    }

    const product = await Product.findById(productId)
      .populate("category")
      .populate("sub_category");

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    return res.json({
      message: "Product Details",
      success: true,
      error: false,
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};


export const updateProductDetail = async (req, res) => {
  try {
    const { id, ...updateData } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Valid Product ID is required",
      });
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "No fields provided to update",
      });
    }

    const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      error: false,
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Server Error",
    });
  }
};


export const deletProduct = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Valid Product ID is required",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      error: false,
      data: product,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: "Server Error",
    });
  }
};


export const searchProduct = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    const query = search ? { $text: { $search: search } } : {};
    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("category")
        .populate("sub_category"),
      Product.countDocuments(query),
    ]);

    return res.json({
      message: "Product Details",
      success: true,
      error: false,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};
