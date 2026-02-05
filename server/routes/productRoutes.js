import express from "express";
import auth from "../middleware/auth.js";
import {
  AddProduct,
  deletProduct,
  getProduct,
  getProductByCategoryAndSubCategory,
  getProductByCategoryId,
  getProductById,
  searchProduct,
  updateProductDetail,
  upload
} from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.post("/add", auth, upload.array("image"), AddProduct);


productRouter.get("/", getProduct);


productRouter.post("/by-category", getProductByCategoryId);


productRouter.post("/by-category-subcategory", getProductByCategoryAndSubCategory);


productRouter.post("/by-id", getProductById);


productRouter.put("/update", auth, updateProductDetail);


productRouter.delete("/delete", auth, deletProduct);


productRouter.post("/search", searchProduct);

export default productRouter;
