import Category from "../models/Category.js";
import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";
import mongoose from "mongoose";


export const AddCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        message: "Name and image URL are required",
        success: false,
        error: true,
      });
    }


    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({
        message: "Category already exists",
        success: false,
        error: true,
      });
    }

    const newCategory = new Category({ name, image });
    const saved = await newCategory.save();

    return res.status(201).json({
      message: "Category added successfully",
      success: true,
      error: false,
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      success: false,
      error: true,
    });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      error: false,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Failed to fetch categories",
    });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid category ID",
      });
    }

    if (!name && !image) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Nothing to update",
      });
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image },
      { new: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid category ID",
      });
    }

   
    const checkSubCategory = await SubCategory.countDocuments({
      category: { $in: [id] },
    });

    
    const checkProduct = await Product.countDocuments({
      category: { $in: [id] },
    });

    if (checkProduct > 0 || checkSubCategory > 0) {
      return res.status(400).json({
        message: "Category already in use, can't delete",
        success: false,
        error: true,
      });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Category not found",
      });
    }

    res.status(200).json({
      success: true,
      error: false,
      message: "Category deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};
