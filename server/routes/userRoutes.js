import { Router } from "express";
import userModelRegister, {
  userLogin,
  userLogout,
  updateUserDetails,
  forgotPassword,
  verifyForgetPassword,
  resetPassword,
  refreshTokenController,
  getUserDetails,
  userVerifyEmail,
} from "../controllers/userModel.js";
import auth from "../middleware/auth.js";

const userRoute = Router();


userRoute.post("/register", userModelRegister);
userRoute.get("/verify-email", userVerifyEmail);


userRoute.post("/login", userLogin);
userRoute.post("/logout", auth, userLogout);
userRoute.post("/refresh-token", refreshTokenController);


userRoute.put("/update", auth, updateUserDetails);
userRoute.get("/me", auth, getUserDetails);


userRoute.put("/forgot-password", forgotPassword);
userRoute.put("/verify-otp", verifyForgetPassword);
userRoute.put("/reset-password", resetPassword);

export default userRoute;
