import express from "express";
import auth from "../middleware/auth.js";
import { 
  addToCart, 
  getCartProducts, 
  updateCartQuantity, 
  removeFromCart, 
  clearCart,
  getCartCount 
} from "../controllers/cartController.js";

const cartRouter = express.Router();


cartRouter.use(auth);


cartRouter.post("/add", addToCart);


cartRouter.get("/", getCartProducts);


cartRouter.put("/update", updateCartQuantity);


cartRouter.delete("/remove", removeFromCart);


cartRouter.delete("/clear", clearCart);


cartRouter.get("/count", getCartCount);

export default cartRouter;