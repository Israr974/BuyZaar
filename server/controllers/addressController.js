import Address from "../models/Address.js";
import User from "../models/User.js";
import mongoose from "mongoose";


export const addAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { address_line, city, state, pincode, country, mobile } = req.body;

   
    if (!address_line || !city || !state || !pincode || !mobile) {
      return res.status(400).json({
        success: false,
        message: "All address fields are required",
      });
    }

    
    const newAddress = await Address.create({
      userId,
      address_line: address_line.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      country: country?.trim() || "India",
      mobile: mobile.trim(),
    });

    
    await User.findByIdAndUpdate(userId, {
      $push: { address_details: newAddress._id },
    });

    return res.json({
      success: true,
      message: "Address added successfully",
      data: newAddress,
    });
  } catch (error) {
    console.error(" Add Address Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("address_details");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.json({
      success: true,
      data: user.address_details,
    });
  } catch (error) {
    console.error(" Get Address Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getAddressById = async (req, res) => {
  console.log(" [getAddressById] Started");
  console.log(" User from auth:", req.user);
  console.log(" User ID:", req.user?.id);
  console.log(" Request body:", req.body);
  
  try {
    const { selectedAddress } = req.body;
    
   
    if (!selectedAddress) {
      console.log(" No address ID provided");
      return res.status(400).json({
        success: false,
        message: "Address ID is required",
      });
    }
    
    console.log(" Looking for address with ID:", selectedAddress);
    
    
    if (!mongoose.Types.ObjectId.isValid(selectedAddress)) {
      console.log(" Invalid ObjectId format:", selectedAddress);
      return res.status(400).json({
        success: false,
        message: "Invalid address ID format",
      });
    }
    
    
    let address;
    try {
      address = await Address.findById(selectedAddress);
    } catch (dbError) {
      console.error(" Database query error:", dbError);
      return res.status(500).json({
        success: false,
        message: "Database error occurred",
      });
    }
    
    console.log(" Found address:", address);
    
    if (!address) {
      console.log(" Address not found in database");
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }
    

    console.log(" Address user field:", address.user);
    console.log(" Address user type:", typeof address.user);
    console.log(" Address user toString exists:", address.user?.toString);
    
    
    if (req.user && address.user) {
      console.log(" Checking ownership...");
      console.log(" Address user:", address.user.toString());
      console.log(" Request user:", req.user.id);
      
      
      const addressUserId = address.user.toString();
      const requestUserId = req.user.id.toString();
      
      if (addressUserId !== requestUserId) {
        console.log(" Ownership mismatch");
        return res.status(403).json({
          success: false,
          message: "Unauthorized access to this address",
        });
      }
    } else if (!address.user) {
      console.log(" Address has no user field - skipping ownership check");
    }
    
    console.log(" Address found successfully");
    return res.status(200).json({
      success: true,
      message: "Address fetched successfully",
      data: address,
    });
    
  } catch (error) {
    console.error(" [getAddressById] Unhandled error:", error);
    console.error(" Error name:", error.name);
    console.error(" Error message:", error.message);
    console.error(" Error stack:", error.stack);
    
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID format",
      });
    }
    
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};


export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    
    const allowedFields = [
      "address_line",
      "city",
      "state",
      "pincode",
      "country",
      "mobile",
    ];

    const updateData = {};
    allowedFields.forEach((field) => {
      if (req.body[field]) {
        updateData[field] = req.body[field].trim();
      }
    });

    const updatedAddress = await Address.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true }
    );

    if (!updatedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    return res.json({
      success: true,
      message: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(" Update Address Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid address ID",
      });
    }

    const deletedAddress = await Address.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deletedAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found or unauthorized",
      });
    }

    
    await User.findByIdAndUpdate(userId, {
      $pull: { address_details: deletedAddress._id },
    });

    return res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(" Delete Address Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

