import { userSchema } from "../model/user.schema";
import mongoose from "mongoose";

const userModel = mongoose.model("User", userSchema);
export default class UserRepository {
  async signUp(user) {
    try {
      const user = await userModel.findOne({ email: user.email });
      if (user) {
        return {
          success: false,
          message: "User already exists",
        };
      }
      const newUser = new userModel(user);
      await newUser.save();
      return {
        success: true,
        result: newUser,
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
