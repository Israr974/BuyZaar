import express from "express";
import auth from "../middleware/auth.js";
import {
  createSubCategory,
  getSubcategory,
  updateSubCategory,
  getSubCategoryById,
  deleteSubCategory
} from "../controllers/subCategoryController.js";

const subCategoryRouter = express.Router();


subCategoryRouter.post("/", auth, createSubCategory);


subCategoryRouter.get("/", getSubcategory);


subCategoryRouter.put("/:id", auth, updateSubCategory);
subCategoryRouter.get("/get/:id", getSubCategoryById);

subCategoryRouter.delete("/:id", auth, deleteSubCategory);

export default subCategoryRouter;
