import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

export const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const existingItem = await Wishlist.findOne({ userId, productId });
    if (existingItem) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist"
      });
    }

    const wishlistItem = await Wishlist.create({
      userId,
      productId
    });

    return res.status(201).json({
      success: true,
      message: "Added to wishlist",
      data: wishlistItem
    });

  } catch (error) {
    console.error("Add to wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlistItems = await Wishlist.find({ userId })
      .populate("productId")
      .sort({ createdAt: -1 });

    const formattedItems = wishlistItems.map(item => ({
      _id: item._id,
      productId: item.productId,
      addedAt: item.addedAt
    }));

    return res.status(200).json({
      success: true,
      data: formattedItems,
      totalItems: wishlistItems.length
    });

  } catch (error) {
    console.error("Get wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required"
      });
    }

    const deletedItem = await Wishlist.findOneAndDelete({ userId, productId });

    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found in wishlist"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Removed from wishlist"
    });

  } catch (error) {
    console.error("Remove from wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};

export const clearWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    await Wishlist.deleteMany({ userId });

    return res.status(200).json({
      success: true,
      message: "Wishlist cleared successfully"
    });

  } catch (error) {
    console.error("Clear wishlist error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error"
    });
  }
};