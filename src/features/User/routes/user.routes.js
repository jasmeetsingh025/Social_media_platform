import express from "express";
import UserController from "../controller/user.controller.js";

const router = express.Router();

const userController = new UserController();

router.route("/signup").post((req, res, next) => {
  userController.registerUser(req, res, next);
});

router.route("/signin").post((req, res, next) => {
  userController.signInUser(req, res, next);
});

router.route("/signout").get((req, res, next) => {
  userController.signOutUser(req, res, next);
});
