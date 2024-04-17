import jwt from "jsonwebtoken";
import ApplicationError from "../../../ErrorHandler/errorHandler.js";
import UserRepository from "../repository/user.repository.js";
import {
  compareHashedPassword,
  hashPassword,
} from "../../../util/hashPassword.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async registerUser(req, res, next) {
    const { name, email, password, mobile, bio } = req.body;
    if (!this.validatePassword(password)) {
      return next(
        new ApplicationError("Password must be at least 8 characters long", 400)
      );
    }
    const savedUser = await this.userRepository.signUp({
      name: name,
      email: email,
      password: await hashPassword(password, next),
      mobileNumber: mobile,
      bio: bio,
    });
    if (savedUser.success) {
      res.status(201).json(savedUser);
    } else {
      next(
        new ApplicationError(
          savedUser.error.message,
          savedUser.error.statusCode
        )
      );
    }
  }

  async signInUser(req, res, next) {
    const { email, password } = req.body;
    if (!this.validatePassword(password)) {
      return next(
        new ApplicationError("Password must be at least 8 characters long", 400)
      );
    }
    const isUser = await this.userRepository.findUserByEmail(email);
    if (!isUser.success) {
      return next(new ApplicationError("User not found", 404));
    }
    const isPasswordMatch = await compareHashedPassword(
      password,
      isUser.result.password,
      next
    );
    if (!isPasswordMatch) {
      return next(new ApplicationError("Invalid password", 401));
    }
    const token = jwt.sign(
      { userId: isUser.result._id, email: isUser.result.email },
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      }
    );
    res
      .status(200)
      .cookie("jwtToken", token)
      .cookie("userId", isUser.result._id)
      .json({ status: "success", message: "login successful" });
  }

  async signOutUser(req, res, next) {
    res
      .clearCookie("jwtToken")
      .clearCookie("userId")
      .json({ success: true, msg: "logout successful" });
  }

  async updatePassword(req, res, next) {
    const { newPassword } = req.body;
    if (!this.validatePassword(newPassword)) {
      return next(
        new ApplicationError("Password must be at least 8 characters long", 400)
      );
    }
    const result = await this.userRepository.updatePassword(
      req.userId,
      newPassword,
      next
    );
    if (!result.success) {
      return next(
        new ApplicationError(result.error.message, result.error.statusCode)
      );
    }
    res.status(201).json({
      success: true,
      message: "password updated successfully",
    });
  }

  validatePassword(password) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
      password
    );
  }
}
