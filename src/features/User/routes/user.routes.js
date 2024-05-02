import express from "express";
import UserController from "../controller/user.controller.js";
import jwtToken from "../../../middleware/Auth.middleware.js";

const router = express.Router();

const userController = new UserController();

//* Post request
router.route("/signup").post((req, res, next) => {
  userController.registerUser(req, res, next);
});
router.route("/signin").post((req, res, next) => {
  userController.signInUser(req, res, next);
});
router.route("/updatePassword").post(jwtToken, (req, res, next) => {
  userController.updatePassword(req, res, next);
});
router.route("/update-details/:userId").post(jwtToken, (req, res, next) => {
  userController.updateUserDetails(req, res, next);
});

//* Get request
router.route("/signout").get((req, res, next) => {
  userController.signOutUser(req, res, next);
});
router.route("/get-details/:userId").get(jwtToken, (req, res, next) => {
  userController.fetchUserDetails(req, res, next);
});
router.route("/get-all-details").get(jwtToken, (req, res, next) => {
  userController.fetchUserDetails(req, res, next);
});

export default router;
