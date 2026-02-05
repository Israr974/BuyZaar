

import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token =
      req.cookies?.accessToken ||
      (authHeader && authHeader.startsWith("Bearer")
        ? authHeader.split(" ")[1]
        : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
        error: true
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_SECRET_KEY
    );

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
        error: true
      });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
        error: true
      });
    }


    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access required",
        error: true
      });
    }

    req.user = {
      id: user._id.toString(),
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    };

    next();
  } catch (error) {
    console.error("Admin auth error:", error.message);

    return res.status(401).json({
      success: false,
      message:
        error.name === "TokenExpiredError"
          ? "Session expired. Please login again."
          : "Not authorized, token failed",
      error: true
    });
  }
};

export default adminAuth;
