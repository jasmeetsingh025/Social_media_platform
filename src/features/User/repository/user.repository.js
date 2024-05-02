import { hashPassword } from "../../../util/hashPassword.js";
import { userSchema } from "../model/user.schema.js";
import mongoose from "mongoose";

const userModel = mongoose.model("User", userSchema);
export default class UserRepository {
  async signUp(user) {
    try {
      const isUser = await userModel.findOne({ email: user.email });
      if (isUser) {
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

  // async findUserByEmail(email) {
  //   try {
  //     const user = await userModel.findOne({ email: email });
  //     return {
  //       success: true,
  //       result: user,
  //     };
  //   } catch (err) {
  //     return {
  //       success: false,
  //       error: {
  //         statusCode: 404,
  //         message: err.message,
  //       },
  //     };
  //   }
  // }

  async findUser(criteria) {
    try {
      let query = {};
      if (criteria) {
        if (criteria.email) {
          query = { email: criteria.email };
        } else if (criteria.userId) {
          query = { _id: criteria.userId };
        }
      }
      let user = "";
      if (criteria && criteria.email) {
        user = await userModel.findOne(query);
      } else {
        user = await userModel.find(query).select("-password");
      }
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

  async updatePassword(userID, password, next) {
    try {
      const user = await userModel.findOneAndUpdate(
        { _id: userID },
        { password: await hashPassword(password, next) },
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

  async updateUserDetailsRepo(userID, userDetails) {
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
  async signOutFromAllDevicesRepo(userID, userDetails) {
    try {
      const user = await userModel.findByIdAndUpdate(
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
