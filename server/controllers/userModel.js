import userModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import sendMails from "../utils/resendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmails.js";
import generateAccessToken from "../utils/accessToken.js";
import generaterefreshToken from "../utils/refreshToken.js";
import genrateOtp from "../utils/genrateOtp.js";
import forgotPasswordOtp from "../utils/forgotPassword.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import { upload } from '../middleware/multer.js';

export const uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Image URL is required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    user.profile = image;
    await user.save();

    return res.status(200).json({
      message: "Profile picture uploaded successfully",
      success: true,
      error: false,
      data: {
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to upload profile picture",
      error: true,
      success: false,
    });
  }
};

export const updateProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({
        message: "Image URL is required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    user.profile = image;
    await user.save();

    return res.status(200).json({
      message: "Profile picture updated successfully",
      success: true,
      error: false,
      data: {
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to update profile picture",
      error: true,
      success: false,
    });
  }
};

export const deleteProfilePicture = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    user.profile = "/placeholder-profile.png";
    await user.save();

    return res.status(200).json({
      message: "Profile picture deleted successfully",
      success: true,
      error: false,
      data: {
        profile: user.profile,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete profile picture",
      error: true,
      success: false,
    });
  }
};

async function userModelRegister(req, res) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        message: "All fields are required",
        error: true,
        success: false,
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match",
        error: true,
        success: false,
      });
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
        error: true,
        success: false,
      });
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    const emailToken = jwt.sign(
      { id: user._id },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: "24h" }
    );

    const verifyEmailUrl = `http://localhost:3030/api/user/verify-email?code=${emailToken}`;

    await sendMails({
      to: email,
      subject: "Verify Email - BuyZaar",
      html: verifyEmailTemplate({ name, url: verifyEmailUrl }),
    });

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

export default userModelRegister;

export async function userVerifyEmail(req, res) {
  try {
    const { code } = req.query;

    const decoded = jwt.verify(code, process.env.EMAIL_VERIFY_SECRET);
    const user = await userModel.findById(decoded.id);

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification link",
        error: true,
        success: false,
      });
    }

    if (user.verify_email) {
      return res.status(200).json({
        message: "Email already verified",
        success: true,
        error: false,
      });
    }

    user.verify_email = true;
    await user.save();

    return res.status(200).json({
      message: "Email verified successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Verification link expired",
      error: true,
      success: false,
    });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "No account found with this email address",
        error: true,
        success: false,
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account inactive or banned. Please contact support.",
        error: true,
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Incorrect password. Please try again.",
        error: true,
        success: false,
      });
    }

    const accessToken = await generateAccessToken(user._id);
    const refreshToken = await generaterefreshToken(user._id);

    user.refresh_token = refreshToken;
    user.last_login_date = new Date();
    await user.save();

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };

    res.cookie("accessToken", accessToken, cookieOptions);
    res.cookie("refreshToken", refreshToken, cookieOptions);

    const userData = {
      id: user._id,
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile || "",
      role: user.role || "user",
      status: user.status,
      verify_email: user.verify_email || false,
      isEmailVerified: user.verify_email || false,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    if (!user.verify_email) {
      return res.status(200).json({
        message: "Login successful! Please verify your email to access all features.",
        success: true,
        error: false,
        requiresEmailVerification: true,
        data: {
          user: userData,
          accessToken,
          refreshToken,
        },
      });
    }

    return res.status(200).json({
      message: "Login successful",
      success: true,
      error: false,
      requiresEmailVerification: false,
      data: {
        user: userData,
        accessToken,
        refreshToken,
      },
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function resendVerificationEmail(req, res) {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    if (user.verify_email === true) {
      return res.status(400).json({
        message: "Email already verified",
        error: true,
        success: false,
      });
    }

    const emailToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.EMAIL_VERIFY_SECRET,
      { expiresIn: "24h" }
    );

    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.BACKEND_URL 
      : 'http://localhost:3000';
    
    const verifyEmailUrl = `${baseUrl}/api/user/verify-email?code=${emailToken}`;

    await sendMails({
      to: user.email,
      subject: "Verify Your Email - BuyZaar",
      html: verifyEmailTemplate({ 
        name: user.name, 
        url: verifyEmailUrl 
      }),
    });

    return res.status(200).json({
      message: "Verification email sent successfully",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to send verification email",
      error: true,
      success: false,
    });
  }
}

export async function userLogout(req, res) {
  try {
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    };

    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    if (req.user?.id) {
      await userModel.findByIdAndUpdate(req.user.id, {
        refresh_token: null,
      });
    }

    return res.status(200).json({
      message: "Logout successful",
      success: true,
      error: false,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Logout failed",
      success: false,
      error: true,
    });
  }
}

export async function updateUserDetails(req, res) {
  try {
    const user = await userModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const { name, email, mobile, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (password) user.password = await bcryptjs.hash(password, 10);

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      success: true,
      error: false,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profile: user.profile,
        role: user.role,
        verify_email: user.verify_email,
      },
    });
  } catch (error) {
    return res.status(500).json({ 
      message: "Server error",
      error: true,
      success: false,
    });
  }
}

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const otp = await genrateOtp();
    const hashedOtp = await bcryptjs.hash(otp, 10);

    user.forgot_password_otp = hashedOtp;
    user.forgot_password_expiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendMails({
      to: email,
      subject: "Forgot Password - BuyZaar",
      html: forgotPasswordOtp({ name: user.name, otp }),
    });

    return res.status(200).json({
      message: "OTP sent to email",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ 
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}

export async function verifyForgetPassword(req, res) {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const isValid = await bcryptjs.compare(otp, user.forgot_password_otp);
    if (!isValid || Date.now() > user.forgot_password_expiry) {
      return res.status(400).json({ 
        message: "Invalid or expired OTP",
        error: true,
        success: false,
      });
    }

    user.forgot_password_otp = null;
    user.forgot_password_expiry = null;
    await user.save();

    return res.status(200).json({
      message: "OTP verified",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ 
        message: "User not found",
        error: true,
        success: false,
      });
    }

    user.password = await bcryptjs.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({
      message: "Password reset successful",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
}

export async function refreshTokenController(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ 
        message: "No refresh token",
        error: true,
        success: false,
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY
    );

    const user = await userModel.findById(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ 
        message: "Invalid refresh token",
        error: true,
        success: false,
      });
    }

    const newAccessToken = jwt.sign(
      { id: user._id },
      process.env.ACCESS_SECRET_KEY,
      { expiresIn: "5h" }
    );

    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      success: true,
      error: false,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return res.status(401).json({ 
      message: "Token expired",
      error: true,
      success: false,
    });
  }
}

export async function getUserDetails(req, res) {
  try {
    const user = await userModel.findById(req.user.id).select("-password -refresh_token");
    
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      error: false,
      user: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        profile: user.profile,
        role: user.role,
        verify_email: user.verify_email,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      error: true,
      success: false,
    });
  }
}

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }
    
    if (user.profile && user.profile !== "/placeholder-profile.png") {
      try {
        const publicId = user.profile.split('/').slice(-2).join('/').split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log(err)
      }
    }
    
    await userModel.findByIdAndDelete(userId);
    
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    
    return res.status(200).json({
      message: "Account deleted successfully",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Failed to delete account",
      error: true,
      success: false,
    });
  }
};