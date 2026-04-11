import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, rating, title, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Product ID, rating, and comment are required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const existingReview = await Review.findOne({ product: productId, user: userId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const order = await Order.findOne({
      user: userId,
      "items.product": productId,
      orderStatus: "delivered",
    });

    const isVerifiedPurchase = !!order;

    const review = await Review.create({
      product: productId,
      user: userId,
      rating: Number(rating),
      title: title || "",
      comment,
      isVerifiedPurchase,
    });

    // Update product rating
    const allReviews = await Review.find({ product: productId, status: "approved" });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const reviewCount = allReviews.length;

    await Product.findByIdAndUpdate(productId, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviewCount,
    });

    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      data: review,
    });

  } catch (error) {
    console.error("Add review error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const skip = (page - 1) * limit;

    const reviews = await Review.find({ product: productId, status: "approved" })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ product: productId, status: "approved" });

    return res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Get reviews error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { rating, title, comment } = req.body;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (rating) review.rating = rating;
    if (title) review.title = title;
    if (comment) review.comment = comment;

    await review.save();

    // Update product rating
    const allReviews = await Review.find({ product: review.product, status: "approved" });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    const reviewCount = allReviews.length;

    await Product.findByIdAndUpdate(review.product, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviewCount,
    });

    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      data: review,
    });

  } catch (error) {
    console.error("Update review error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const review = await Review.findOne({ _id: reviewId, user: userId });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    await review.deleteOne();

    // Update product rating
    const allReviews = await Review.find({ product: review.product, status: "approved" });
    const avgRating = allReviews.length > 0
      ? allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      : 0;
    const reviewCount = allReviews.length;

    await Product.findByIdAndUpdate(review.product, {
      rating: parseFloat(avgRating.toFixed(1)),
      reviewCount: reviewCount,
    });

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });

  } catch (error) {
    console.error("Delete review error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const markHelpful = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found",
      });
    }

    if (review.helpfulUsers && review.helpfulUsers.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: "You already marked this review as helpful",
      });
    }

    review.helpful = (review.helpful || 0) + 1;
    if (!review.helpfulUsers) review.helpfulUsers = [];
    review.helpfulUsers.push(userId);
    await review.save();

    return res.status(200).json({
      success: true,
      message: "Marked as helpful",
      helpful: review.helpful,
    });

  } catch (error) {
    console.error("Mark helpful error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};