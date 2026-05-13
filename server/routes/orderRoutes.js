import express from "express";
import { 
  placeOrder, 
  getMyOrders, 
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getAllOrders 
} from "../controllers/orderController.js";
import  auth from "../middleware/auth.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();


router.use(auth);


router.post("/", placeOrder);
router.get("/my-orders", getMyOrders);
router.get("/:id", getOrderById);
router.put("/:id/cancel", cancelOrder);


router.get("/", adminAuth, getAllOrders); 
router.put("/:id/status", adminAuth, updateOrderStatus);

export default router;