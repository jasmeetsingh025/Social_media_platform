import jwt from "jsonwebtoken";
import ApplicationError from "../../../ErrorHandler/errorHandler.js";
import UserRepository from "../repository/user.repository.js";

export default class UserController {
  constructor() {
    this.userRepository = new UserRepository();
  }
  async registerUser(req, res, next) {
    const { name, email, password, mobile, bio } = req.body;
    const savedUser = await this.userRepository.signUp({
      name: name,
      email: email,
      password: password,
      mobile: mobile,
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

  async signInUser(req, res, next) {}

  async signOutUser(req, res, next) {}

  //   async updateUser(req, res, next) {}
}
