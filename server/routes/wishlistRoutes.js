import express from "express";
import auth from "../middleware/auth.js";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
  clearWishlist
} from "../controllers/wishlistController.js";

const wishlistRouter = express.Router();

wishlistRouter.use(auth);

wishlistRouter.post("/add", addToWishlist);
wishlistRouter.get("/", getWishlist);
wishlistRouter.delete("/remove", removeFromWishlist);
wishlistRouter.delete("/clear", clearWishlist);

export default wishlistRouter;