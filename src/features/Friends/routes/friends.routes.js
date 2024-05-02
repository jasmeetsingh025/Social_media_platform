import express from "express";
import FriendsController from "../controller/firends.controller.js";

const router = express.Router();
const friendsController = new FriendsController();

router.route("/get-friends/:userId").get((req, res, next) => {
  friendsController.fetchFriends(req, res, next);
});
router.route("/get-pending-requests").get((req, res, next) => {
  friendsController.fetchPendingRequests(req, res, next);
});
router.route("/toggle-friendship/:friendsId").get((req, res, next) => {
  friendsController.toggleFriendship(req, res, next);
});
router.route("/response-to-request/:friendsId").get((req, res, next) => {
  friendsController.responseToRequest(req, res, next);
});

export default router;
