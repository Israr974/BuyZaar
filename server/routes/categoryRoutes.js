import express from "express";
import auth from "../middleware/auth.js";
import {
  AddCategory,
  getAllCategories,
  updateCategory,
  deleteCategory
} from "../controllers/categoryController.js";

const categoryRouter = express.Router();


categoryRouter.post("/", auth, AddCategory);


categoryRouter.get("/", getAllCategories);


categoryRouter.put("/:id", auth, updateCategory);


categoryRouter.delete("/:id", auth, deleteCategory);

export default categoryRouter;
