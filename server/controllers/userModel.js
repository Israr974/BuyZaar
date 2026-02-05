


import userModel from "../models/User.js";
import bcryptjs from "bcryptjs";
import sendMails from "./resendEmail.js";
import verifyEmailTemplate from "../utils/verifyEmails.js";
import generateAccessToken from "../utils/accessToken.js";
import generaterefreshToken from "../utils/refreshToken.js";
import genrateOtp from "../utils/genrateOtp.js";
import forgotPasswordOtp from "../utils/forgotPassword.js";
import jwt from "jsonwebtoken";


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
      return res.json({
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

    return res.json({
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
      return res.json({
        message: "Email already verified",
        success: true,
        error: false,
      });
    }

    user.verify_email = true;
    await user.save();

    return res.json({
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
        message: "Email and password required",
        error: true,
        success: false,
      });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
        error: true,
        success: false,
      });
    }

    if (user.verify_email !== undefined && !user.verify_email) {
      return res.status(403).json({
        message: "Please verify your email first",
        error: true,
        success: false,
      });
    }

    if (user.status !== "active") {
      return res.status(403).json({
        message: "Account inactive or banned",
        error: true,
        success: false,
      });
    }

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
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
      verify_email: user.verify_email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return res.json({
      message: "Login successful",
      success: true,
      error: false,
      data: {
        user: userData,
        accessToken,     
        refreshToken,
      },
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
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

    return res.json({
      message: "Logout successful",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("Logout error:", error);
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
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email, mobile, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;
    if (mobile) user.mobile = mobile;
    if (password) user.password = await bcryptjs.hash(password, 10);

    await user.save();

    return res.json({
      message: "Profile updated",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}


export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
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

    return res.json({
      message: "OTP sent to email",
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
}


export async function verifyForgetPassword(req, res) {
  const { email, otp } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const isValid = await bcryptjs.compare(otp, user.forgot_password_otp);
  if (!isValid || Date.now() > user.forgot_password_expiry) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  user.forgot_password_otp = null;
  user.forgot_password_expiry = null;
  await user.save();

  return res.json({
    message: "OTP verified",
    success: true,
    error: false,
  });
}


export async function resetPassword(req, res) {
  const { email, newPassword } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.password = await bcryptjs.hash(newPassword, 10);
  await user.save();

  return res.json({
    message: "Password reset successful",
    success: true,
    error: false,
  });
}


export async function refreshTokenController(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_KEY
    );

    const user = await userModel.findById(decoded.id);
    if (!user || user.refresh_token !== refreshToken) {
      return res.status(401).json({ message: "Invalid refresh token" });
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

    return res.json({
      success: true,
      error: false,
      data: { accessToken: newAccessToken },
    });
  } catch (error) {
    return res.status(401).json({ message: "Token expired" });
  }
}


export async function getUserDetails(req, res) {
  const user = await userModel.findById(req.user.id).select("-password");

  return res.json({
    success: true,
    error: false,
    user,
  });
}

