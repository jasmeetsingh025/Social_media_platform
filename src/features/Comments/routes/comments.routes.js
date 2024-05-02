import express from "express";
import CommentController from "../controller/comments.controller.js";

const routes = express.Router();

const commentController = new CommentController();

//* get comments
routes.route("/:postId").get((req, res, next) => {
  commentController.fetchComments(req, res, next);
});

//* post comment
routes.route("/:postId").post((req, res, next) => {
  commentController.addComments(req, res, next);
});

//* update comments
routes.route("/:commentId").put((req, res, next) => {
  commentController.updateComment(req, res, next);
});

//* delete comments
routes.route("/:commentId").delete((req, res, next) => {
  commentController.deleteComment(req, res, next);
});

export default routes;
