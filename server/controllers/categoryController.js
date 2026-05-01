import Category from "../models/Category.js";
import Product from "../models/Product.js";
import SubCategory from "../models/SubCategory.js";
import mongoose from "mongoose";

export const AddCategory = async (req, res) => {
  try {
    const { name, image } = req.body;

    if (!name || !image) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Name and image URL are required",
      });
    }

    const exists = await Category.findOne({ name });
    if (exists) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Category already exists",
      });
    }

    const newCategory = new Category({ name, image });
    const saved = await newCategory.save();

    return res.status(201).json({
      success: true,
      error: false,
      message: "Category added successfully",
      data: saved,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Server error",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const productCount = await Product.countDocuments({ 
          category: category._id 
        });
        return {
          ...category.toObject(),
          productCount
        };
      })
    );

    return res.status(200).json({
      success: true,
      error: false,
      data: categoriesWithCount,
    });
  } catch (error) {
    return res.status(500).json({
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

    const updateData = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Server error",
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

    const subCategoryCount = await SubCategory.countDocuments({
      category: { $in: [id] },
    });

    const productCount = await Product.countDocuments({
      category: { $in: [id] },
    });

    if (productCount > 0 || subCategoryCount > 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Category cannot be deleted as it is being used by products or subcategories",
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

    return res.status(200).json({
      success: true,
      error: false,
      message: "Category deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || "Server error",
    });
  }
};