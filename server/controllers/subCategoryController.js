import mongoose from "mongoose";
import SubCategory from "../models/SubCategory.js";
import Product from "../models/Product.js"; 


export const createSubCategory = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    if (!name || !image || !Array.isArray(category) || category.length === 0) {
      return res.status(400).json({
        message: "Name, image, and at least one category are required",
        success: false,
        error: true,
      });
    }

    const subCategory = new SubCategory({
      name,
      image,
      category,
    });

    await subCategory.save();

    return res.status(201).json({
      message: "SubCategory created successfully",
      success: true,
      error: false,
      data: subCategory,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      success: false,
      error: true,
    });
  }
};


export const getSubcategory = async (req, res) => {
  try {
    const subcategories = await SubCategory.find({})
      .sort({ createdAt: -1 })
      .populate("category", "name");

    return res.status(200).json({
      success: true,
      error: false,
      data: subcategories,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};


export const updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image, category } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid SubCategory ID",
      });
    }

    if (!name && !image && !category) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "At least one field is required to update",
      });
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      { name, image, category },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "SubCategory not found",
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      message: "SubCategory updated successfully",
      data: updatedSubCategory,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message || error,
    });
  }
};


export const deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "Invalid SubCategory ID",
      });
    }

  
    const usedInProduct = await Product.countDocuments({
      subCategory: id,
    });

    if (usedInProduct > 0) {
      return res.status(400).json({
        success: false,
        error: true,
        message: "SubCategory is in use. Cannot delete",
      });
    }

    const deleted = await SubCategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: true,
        message: "SubCategory not found",
      });
    }

    return res.json({
      success: true,
      error: false,
      message: "SubCategory deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: true,
      message: error.message,
    });
  }
};
