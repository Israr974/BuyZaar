import express from "express";
import {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
  getAddressById
} from "../controllers/addressController.js";
import auth from "../middleware/auth.js";
import toast from "react-hot-toast";

const addressRouter = express.Router();

const validateAddress = (req, res, next) => {
  const { address_line, city, state, pincode, mobile } = req.body;

  if (
    !address_line ||
    !city ||
    !state ||
    !pincode ||
    !mobile
  ) {
    return res.status(400).json({
      success: false,
      message: "All required address fields must be filled",
    });
  }

  next();
};




addressRouter.post("/", auth, validateAddress, addAddress);


addressRouter.get("/", auth, getAddresses);


addressRouter.put("/:id", auth, updateAddress);


addressRouter.delete("/:id", auth, deleteAddress);
addressRouter.post("/by-id",auth,getAddressById)

export default addressRouter;
