import express from "express";
import LikeController from "../controller/like.controller.js";
const router = express.Router();
const likeController = new LikeController();

//* get the like on posts by ID
router.route("/:id").get((req, res, next) => {
  likeController.fetchLikes(req, res, next);
});

//* toggle like on comments and posts by user
router.route("/toggle/:id").get((req, res, next) => {
  likeController.toggleLike(req, res, next);
});

export default router;
