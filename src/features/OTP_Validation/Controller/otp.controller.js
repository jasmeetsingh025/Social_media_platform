import ApplicationError from "../../../ErrorHandler/errorHandler.js";
import OtpRepository from "../repository/otp.repository.js";
import UserRepository from "../../User/repository/user.repository.js";

export default class OtpController {
  constructor() {
    this.otpRepository = new OtpRepository();
    // this.userRepository = new UserRepository();
  }
  async sendOtp(req, res, next) {
    const userId = req.cookies.userId;
    const otp = Math.floor(100000 + Math.random() * 900000);
    const newOtp = await this.otpRepository.otpCreateRepo({
      otp: otp,
      userId: userId,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });
    if (!newOtp.success) {
      return next(
        new ApplicationError(newOtp.error.message, newOtp.error.statusCode)
      );
    }
    return res.status(200).send(newOtp);
  }

  async verifyOtpAndUpdatePassword(req, res, next) {
    const userId = req.cookies.userId;
    const otp = req.body.otp;
    const newPassword = req.body.password;
    const otpData = await this.otpRepository.verifyOtpAndUpdatePasswordRepo({
      userId: userId,
    });
    if (!otpData.success) {
      return next(
        new ApplicationError(otpData.error.message, otpData.error.statusCode)
      );
    }
    if (otpData.result.otp === otp && otpData.result.expiresAt > new Date()) {
      await this.otpRepository.delete(otpData.result._id);
      await this.userRepository.updatePassword(userId, newPassword, next);
      return res.status(200).send({
        success: true,
        message: "otp verified and password updated successfully",
      });
    } else {
      return res.status(200).send({
        success: false,
        message: "invalid otp ore otp's expired",
      });
    }
  }
}
