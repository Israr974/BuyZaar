// import { Router } from "express";
// import userModelRegister, {
//   userLogin,
//   userLogout,
//   updateUserDetails,
//   forgotPassword,
//   verifyForgetPassword,
//   resetPassword,
//   refreshTokenController,
//   getUserDetails,
//   userVerifyEmail,
//   resendVerificationEmail,
//    uploadProfilePicture,
//   updateProfilePicture,
//   deleteProfilePicture
// } from "../controllers/userModel.js";
// import auth from "../middleware/auth.js";
// import { upload } from '../middleware/multer.js';

// const userRoute = Router();


// userRoute.post("/register", userModelRegister);
// userRoute.get("/verify-email", userVerifyEmail);
// userRoute.post("/resend-verification",resendVerificationEmail)


// userRoute.post("/login", userLogin);
// userRoute.post("/logout", auth, userLogout);
// userRoute.post("/refresh-token", refreshTokenController);


// userRoute.put("/update", auth, updateUserDetails);
// userRoute.get("/me", auth, getUserDetails);


// userRoute.put("/forgot-password", forgotPassword);
// userRoute.put("/verify-otp", verifyForgetPassword);
// userRoute.put("/reset-password", resetPassword);

// export default userRoute;


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
  resendVerificationEmail,
  uploadProfilePicture,
  updateProfilePicture,
  deleteProfilePicture
} from "../controllers/userModel.js";
import auth from "../middleware/auth.js";
import { upload } from '../middleware/multer.js';

const userRoute = Router();

// ========== PUBLIC ROUTES ==========
userRoute.post("/register", userModelRegister);
userRoute.get("/verify-email", userVerifyEmail);
userRoute.post("/resend-verification", resendVerificationEmail);
userRoute.post("/login", userLogin);
userRoute.post("/refresh-token", refreshTokenController);

// ========== PROTECTED ROUTES ==========
userRoute.post("/logout", auth, userLogout);
userRoute.put("/update", auth, updateUserDetails);
userRoute.get("/me", auth, getUserDetails);

// ========== PASSWORD ROUTES ==========
userRoute.put("/forgot-password", forgotPassword);
userRoute.put("/verify-otp", verifyForgetPassword);
userRoute.put("/reset-password", resetPassword);


userRoute.post("/upload-profile", auth, uploadProfilePicture);
userRoute.put("/update-profile", auth, updateProfilePicture);
userRoute.delete("/delete-profile", auth, deleteProfilePicture);

export default userRoute;