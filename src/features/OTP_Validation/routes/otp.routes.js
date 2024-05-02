import express from "express";
import OtpController from "../Controller/otp.controller.js";

const router = express.Router();

const otpController = new OtpController();

router.route("/send").post((req, res, next) => {
  otpController.sendOtp(req, res, next);
});

router.route("/verify").post((req, res, next) => {
  otpController.verifyOtpAndUpdatePassword(req, res, next);
});

// router.route("reset-password").post((req, res, next) => {
//   otpController.resetPassword(req, res, next);
// });

export default router;
