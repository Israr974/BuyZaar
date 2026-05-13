import express from "express";
import auth from "../middleware/auth.js";
import {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  markHelpful,
  getAllReviews,
} from "../controllers/reviewController.js";

const reviewRouter = express.Router();

reviewRouter.post("/", auth, addReview);
reviewRouter.get("/product/:productId", getProductReviews);
reviewRouter.put("/:reviewId", auth, updateReview);
reviewRouter.delete("/:reviewId", auth, deleteReview);
reviewRouter.post("/:reviewId/helpful", auth, markHelpful);
reviewRouter.get("/all",getAllReviews)
export default reviewRouter;