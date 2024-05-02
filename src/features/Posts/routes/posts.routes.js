import express from "express";
import PostController from "../controller/posts.controller.js";
const router = express.Router();

const postController = new PostController();

//* get request
router.route("/all").get((req, res, next) => {
  postController.fetchAllPost(req, res, next);
});
router.route("/:postId").get((req, res, next) => {
  postController.fetchPosts(req, res, next);
});
router.route("/").get((req, res, next) => {
  postController.fetchPosts(req, res, next);
});

//* Post request
router.route("/").post((req, res, next) => {
  postController.createPost(req, res, next);
});
router.route("/:postId").delete((req, res, next) => {
  postController.deletePost(req, res, next);
});
router.route("/:postId").put((req, res, next) => {
  postController.updatePost(req, res, next);
});

export default router;
