import express from "express";
import {
    logoutUser,
    registerUser,
    verifyEmail,
    loginUser,
    forgotPassword,
    verifyForgotPasswordOTP,
    resetPassword,
    googleAuth,
    refreshAccessToken,
} from "../controllers/auth.controller.js";
import { protectRoute } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/verify-email", verifyEmail);
router.post("/login", loginUser);
router.post("/logout", protectRoute, logoutUser);
router.post("/forgot-password", forgotPassword);
router.post("/verify-forgot-password-otp", verifyForgotPasswordOTP);
router.post("/reset-password", resetPassword);
router.post("/google", googleAuth);
router.post("/refresh-token", refreshAccessToken);

export default router;
