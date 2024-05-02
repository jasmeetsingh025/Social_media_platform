import mongoose from "mongoose";
import otpSchemaModel from "../model/otp.schema.js";

export default class OtpRepository {
  async otpCreateRepo(otp, userId, expiresAt) {
    try {
      const creatOtp = await otpSchemaModel.create({
        otp: otp,
        userId: userId,
        expiresAt: expiresAt,
      });
      if (!otp) {
        return {
          success: false,
          error: {
            statusCode: 404,
            message: "otp not created",
          },
        };
      }
      return {
        success: true,
        result: otp,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 500,
          message: err.message,
        },
      };
    }
  }
  async verifyOtpAndUpdatePasswordRepo(userID, otp, password) {
    try {
      const user = await userModel.findOneAndUpdate(
        { _id: userID },
        userDetails,
        { isNew: true }
      );
      return {
        success: true,
        result: user,
      };
    } catch (err) {
      return {
        success: false,
        error: {
          statusCode: 404,
          message: err.message,
        },
      };
    }
  }
}
